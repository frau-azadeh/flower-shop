import OrderHistory from "@/app/components/user/OrderHistory";
import AutoCheckout from "@/app/components/user/AutoCheckout";
import { Suspense } from "react";
export const dynamic = "force-dynamic"; // یا: export const revalidate = 0;

export default function UserDashboard() {
  return (
    <Suspense fallback={null}>
      <AutoCheckout />
      <OrderHistory />
    </Suspense>
  );
}
