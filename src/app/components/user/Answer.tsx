"use client";
import React from "react";
import Tabs, { TabItem } from "../ui/Tabs";
import {
  MessageCircleHeart,
  MessageCircleWarning,
  MessageSquare,
} from "lucide-react";

const answerTabs: TabItem[] = [
  {
    key: "waiting",
    label: "در انتظار دیدگاه",
    icon: <MessageCircleWarning className="size-4" />,
    emptyIcon: <MessageCircleWarning className="size-24 text-slate-300" />,
    emptyText: "در انتظار دیدگاه ثبت شده",
  },
  {
    key: "opinion",
    label: "دیدگاه من",
    icon: <MessageCircleHeart className="size-4" />,
    emptyIcon: <MessageCircleHeart className="size-24 text-slate-300" />,
    emptyText: "هنوز دیدگاهی ثبت نکرده اید",
  },
  {
    key: "question",
    label: "پرسش و پاسخ",
    icon: <MessageSquare className="size-4" />,
    emptyIcon: <MessageSquare className="size-24 text-slate-300" />,
    emptyText: "لیست سوال های شما خالی است",
  },
];

const Answer: React.FC = () => {
  return (
    <div>
      <Tabs tabs={answerTabs} />
    </div>
  );
};

export default Answer;
