import Wishlists from "@/app/components/user/WishLists";
import React, { Suspense } from "react";
export const dynamic = "force-dynamic"; // یا: export const revalidate = 0;

const UserList = () => {
  return (
    <Suspense fallback={null}>
      <Wishlists />
    </Suspense>
  );
};

export default UserList;
