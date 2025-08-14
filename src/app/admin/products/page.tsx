import ProductCreateCard from "@/app/components/admin/ProductCreateCard";
import RequireAuth from "@/app/components/admin/RequireAuth";

export default function Page() {
  return (
    <RequireAuth allow={["PRODUCTS", "FULL"]}>
         <ProductCreateCard />
    </RequireAuth>
  );
}




     
