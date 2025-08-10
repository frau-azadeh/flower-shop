import Answer from "@/app/components/user/Answer";
import React, { Suspense } from "react";

const AnswerUser: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Answer />
    </Suspense>
  );
};

export default AnswerUser;
