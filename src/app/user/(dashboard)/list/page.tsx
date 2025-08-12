import Wishlists from "@/app/components/user/WishLists";
import React, { Suspense } from "react";

const UserList = () => {
  return (
    <Suspense fallback={null}>
      <Wishlists />
    </Suspense>
  );
};

export default UserList;
