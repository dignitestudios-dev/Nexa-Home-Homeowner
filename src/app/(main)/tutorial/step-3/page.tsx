"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TutorialStepThreePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?startTutorial=true");
  }, [router]);

  return null;
}
