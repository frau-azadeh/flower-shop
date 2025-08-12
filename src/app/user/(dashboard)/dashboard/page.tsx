import OrderHistory from "@/app/components/user/OrderHistory";
import { Suspense } from "react";
export default function UserDashboard() {
  return (
    <Suspense fallback={null}>
      <OrderHistory />
    </Suspense>
  );
}
