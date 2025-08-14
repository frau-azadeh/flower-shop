"use client";

import { useEffect, useState } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "@/app/admin/users/actions";
import type { AdminUser, AdminRole } from "@/types/admin";
import UsersTable from "./UsersTable";
import UserModal from "./UserModal";

export default function UsersPage() {
  const [q, setQ] = useState<string>("");
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  async function load() {
    setLoading(true);
    const data = await listUsers(q);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);

  async function onCreate(data: {
    firstName: string; lastName: string; password: string; role: AdminRole; isActive: boolean;
  }) {
    const saved = await createUser(data);
    setItems(prev => [saved, ...prev]);
  }

  async function onUpdate(id: string, data: {
    firstName: string; lastName: string; role: AdminRole; isActive: boolean; password?: string;
  }) {
    const saved = await updateUser(id, data);
    setItems(prev => prev.map(x => x.id === id ? saved : x));
  }

  async function onDelete(id: string) {
    await deleteUser(id);
    setItems(prev => prev.filter(x => x.id !== id));
  }

  return (
    <section dir="rtl" className="mx-auto max-w-5xl p-4">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">کاربران و سطح دسترسی</h2>
        <div className="flex gap-2">
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو (نام)"
            className="rounded border px-3 py-2 text-sm"
          />
          <button
            onClick={() => { setEditing(null); setOpen(true); }}
            className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
          >
            افزودن کاربر
          </button>
        </div>
      </header>

      <UsersTable
        items={items}
        loading={loading}
        onEdit={(u) => { setEditing(u); setOpen(true); }}
        onDelete={(id) => { if (confirm("حذف شود؟")) onDelete(id); }}
      />

      {open && (
        <UserModal
          initial={editing}
          onClose={() => setOpen(false)}
          onSubmit={async (values) => {
            if (editing) await onUpdate(editing.id, values);
            else await onCreate(values as {
              firstName: string; lastName: string; password: string; role: AdminRole; isActive: boolean;
            });
            setOpen(false);
          }}
        />
      )}
    </section>
  );
}
