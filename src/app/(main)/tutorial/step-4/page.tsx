"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TutorialStepFourPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?startTutorial=ongoing");
  }, [router]);

  return null;
}
