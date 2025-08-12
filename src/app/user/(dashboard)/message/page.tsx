import UserMessage from "@/app/components/user/UserMessage";
import { Suspense } from "react";

export default function Message() {
  return (
    <Suspense fallback={null}>
      <UserMessage />
    </Suspense>
  );
}
