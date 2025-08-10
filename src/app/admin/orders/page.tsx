// app/admin/orders/page.tsx
import OrdersCard from "@/app/components/admin/OrdersCard";
import { Suspense } from "react";

export default function OrdersAdmin() {
  return (
    <Suspense fallback={null}>
      <OrdersCard />
    </Suspense>
  );
}
