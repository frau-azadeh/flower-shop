import Answer from "@/app/components/user/Answer";
import React, { Suspense } from "react";
export const dynamic = "force-dynamic"; // یا: export const revalidate = 0;

const AnswerUser: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Answer />
    </Suspense>
  );
};

export default AnswerUser;
