"use client";

import Button from "@/app/components/ui/Button";
import PaginationItem from "@/app/components/ui/PaginationItem";
import { getPaginationRange } from "@/lib/paginationUtils";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <Button
        variant="primary"
        size="md"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) => (
          <PaginationItem
            key={idx}
            page={page}
            isActive={page === currentPage}
            onClick={(p) => onPageChange(p)}
          />
        ))}
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;