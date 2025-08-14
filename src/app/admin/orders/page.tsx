// app/admin/orders/page.tsx
import OrdersCard from "@/app/components/admin/OrdersCard";
import { Suspense } from "react";
import RequireAuth from "@/app/components/admin/RequireAuth";

export default function OrdersAdmin() {
  return (
    <Suspense fallback={null}>
      <RequireAuth allow={["PRODUCTS", "FULL"]}>
        <OrdersCard />
      </RequireAuth>
    </Suspense>
  );
}
