"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

type Attachment = {
    _id?: string;
    location: string;
    filename?: string;
    type?: string
};

interface AttachmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    attachments: Attachment[];
    selectedIndex: number;
    onNext: () => void;
    onPrev: () => void;
}

const isVideoFile = (url: string) => {
    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);
};

export default function AttachmentDialog({
    open,
    onOpenChange,
    attachments,
    selectedIndex,
    onNext,
    onPrev,
}: AttachmentDialogProps) {
    const currentFile = attachments[selectedIndex];

    if (!currentFile) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! !p-0 overflow-hidden">
                <div className="relative flex items-center justify-center bg-black min-h-[500px]">
                    {(isVideoFile(currentFile.location) || currentFile.type == "video") ? (
                        <video
                            src={currentFile.location}
                            controls
                            autoPlay
                            className="max-h-[80vh] max-w-full"
                        />
                    ) : (
                        <Image
                            src={currentFile.location}
                            alt={currentFile.filename || "Attachment"}
                            width={1400}
                            height={1000}
                            className="max-h-[80vh] w-auto object-contain"
                        />
                    )}

                    {attachments.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={onPrev}
                                className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                type="button"
                                onClick={onNext}
                                className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-center p-4 text-sm text-[#565656]">
                    {selectedIndex + 1} / {attachments.length}
                </div>
            </DialogContent>
        </Dialog>
    );
}