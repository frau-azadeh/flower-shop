"use client";
import { Archive, Inbox, Mail, Star } from "lucide-react";
import Tabs, { TabItem } from "@/app/components/ui/Tabs";

const messageTabs: TabItem[] = [
  {
    key: "inbox",
    label: "همه پیامها",
    icon: <Inbox className="size-4" />,
    emptyIcon: <Inbox className="size-24 text-slate-300" />,
    text: "هنوز پیامی در صندوق شما نیست",
  },
  {
    key: "unread",
    label: "خوانده نشده",
    icon: <Mail className="size-4" />,
    emptyIcon: <Mail className="size-24 text-slate-300" />,
    text: "پیام خوانده نشده ای ندارید",
  },
  {
    key: "starred",
    label: "ستاره دار",
    icon: <Star className="size-4" />,
    emptyIcon: <Star className="size-24 text-slate-300" />,
    text: "پیام ستاره دار ثبت نشده است",
  },
  {
    key: "archive",
    label: "بایگانی",
    icon: <Archive className="size-4" />,
    emptyIcon: <Archive className="size-24 text-slate-300" />,
    text: "پیامی در بایگانی وجود ندارد",
  },
];

export default function UserMessage() {
  return <Tabs tabs={messageTabs} />;
}
