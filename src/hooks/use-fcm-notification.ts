"use client";

import { useEffect, useRef } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging, getFcmToken } from "@/lib/firebase";
import { useUpdateFcmToken } from "@/features/auth/hooks";
import { useGetOwnUser } from "@/features/user/hooks";

export const useFcmNotification = () => {
    const { data: user } = useGetOwnUser();
    const userId = user?.data?._id;

    const { mutate: updateFcmToken } = useUpdateFcmToken();

    const unsubscribeRef = useRef<(() => void) | null>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!userId) {
            unsubscribeRef.current?.();
            unsubscribeRef.current = null;
            initializedRef.current = false;
            return;
        }

        if (initializedRef.current) return;

        const init = async () => {
            const sessionKey = `fcm-token-registered:${userId}`;

            if (!sessionStorage.getItem(sessionKey)) {
                const token = await getFcmToken();

                if (token) {
                    updateFcmToken(
                        { fcmToken: token },
                        {
                            onSuccess: () => {
                                sessionStorage.setItem(sessionKey, "true");
                            },
                        }
                    );
                }
            }

            const messaging = await getFirebaseMessaging();

            if (!messaging) return;

            unsubscribeRef.current = onMessage(messaging, (payload) => {
                const title =
                    payload.notification?.title ?? "New Notification";

                const body =
                    payload.notification?.body ?? "";

                const icon =
                    payload.notification?.icon ?? "/favicon.ico";

                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(title, {
                        body,
                        icon,
                    });
                });
            });

            initializedRef.current = true;
        };

        init();

        return () => {
            unsubscribeRef.current?.();
            unsubscribeRef.current = null;
            initializedRef.current = false;
        };
    }, [userId, updateFcmToken]);
};