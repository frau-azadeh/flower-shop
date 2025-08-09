'use client';

import React from "react";
import {  Search, Heart, ShoppingBag, User2Icon } from "lucide-react";


const MobileNavBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 w-full bg-primary shadow-lg flex justify-around items-center py-2 z-50 md:hidden rounded-t-md">
      <a
        href="#"
        className="flex flex-col items-center text-white"
      >
        <Search size={24} />
      </a>

      <a
        href="#"
        className="flex flex-col items-center text-white"
      >
        <Heart size={24} />
      </a>

      <a
        href="#"
        className="flex flex-col items-center text-white"
      >
        <ShoppingBag size={24} />
      </a>

      <a
        href=""
        className="flex flex-col items-center text-white"
      >
        <User2Icon size={24} />
      </a>
    </div>
  );
};

export default MobileNavBar;