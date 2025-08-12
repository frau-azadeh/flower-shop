import React, { Suspense } from "react";
import UserAddress from "@/app/components/user/UserAddress";
const Adress: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <UserAddress />
    </Suspense>
  );
};

export default Adress;
