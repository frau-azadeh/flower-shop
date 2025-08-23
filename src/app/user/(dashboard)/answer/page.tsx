import { Suspense } from "react";
import Answer from "@/app/components/user/Answer";

export const dynamic = "force-dynamic"; // اگر لازم داری prerender نشه؛ وگرنه می‌تونی حذفش کنی

export default function AnswerUser() {
  return (
    <Suspense fallback={null}>
      <Answer />
    </Suspense>
  );
}
