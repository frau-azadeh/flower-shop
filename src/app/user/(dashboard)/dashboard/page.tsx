import OrderHistory from "@/app/components/user/OrderHistory/index";
import AutoCheckout from "@/app/components/user/AutoCheckout/index";
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
