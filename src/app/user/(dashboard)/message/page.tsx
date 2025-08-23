import UserMessage from "@/app/components/user/UserMessage";
import { Suspense } from "react";
export const dynamic = "force-dynamic"; // یا: export const revalidate = 0;

export default function Message() {
  return (
    <Suspense fallback={null}>
      <UserMessage />
    </Suspense>
  );
}
