"use client";
import React from "react";
import Tabs, { TabItem } from "../ui/Tabs";
import { Archive, Inbox, Mail, Star } from "lucide-react";

const messageTabs: TabItem[] = [
  {
    key: "inbox",
    label: "همه پیامها",
    icon: <Inbox className="size-4" />,
    emptyIcon: <Inbox className="size-24 text-slate-300" />,
    emptyText: "هنوز پیامی در صندوق شما نیست",
  },
  {
    key: "unread",
    label: "خوانده نشده",
    icon: <Mail className="size-4" />,
    emptyIcon: <Mail className="size-24 text-slate-300" />,
    emptyText: "پیام خوانده نشده ای ندارید",
  },
  {
    key: "starred",
    label: "ستاره دار",
    icon: <Star className="size-4" />,
    emptyIcon: <Star className="size-24 text-slate-300" />,
    emptyText: "پیامی در بایگانی وجود ندارد",
  },
  {
    key: "archive",
    label: "بایگانی",
    icon: <Archive className="size-4" />,
    emptyIcon: <Archive className="size-24 text-slate-300" />,
    emptyText: "پیامی در بایگانی وجود ندارد",
  },
];

const UserMessage: React.FC = () => {
  return (
    <div>
      <Tabs tabs={messageTabs} paramName="status" />
    </div>
  );
};

export default UserMessage;
