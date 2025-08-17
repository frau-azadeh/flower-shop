"use client";

import clsx from "clsx";
import React from "react";

interface PaginationItemProps {
  page: number | "...";
  isActive?: boolean;
  onClick?: (page: number) => void;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  page,
  isActive,
  onClick,
}) => {
  if (page === "...") {
    return <span className="px-2 text-gray-400">...</span>;
  }

  return (
    <button
      onClick={() => onClick?.(page)}
      className={clsx(
        "px-3 py-1 rounded-md text-sm font-medium transition",
        isActive
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-800 hover:bg-blue-200",
      )}
    >
      {page}
    </button>
  );
};

export default PaginationItem;