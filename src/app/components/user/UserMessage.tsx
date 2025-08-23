"use client";

import Tabs, { type TabItem } from "./Tabs";
import { Archive, Inbox, Mail, Star } from "lucide-react";

const messageTabs = [
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
] satisfies ReadonlyArray<TabItem>; // immutable + type-safe

export default function UserMessage() {
  return <Tabs tabs={messageTabs} paramsName="status" />;
}
