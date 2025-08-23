"use client";

import { useEffect, useMemo, useState } from "react";
import RichText from "@/app/admin/blog/RichText";
import Input from "../ui/Input";
import PostList, { type PostRow, type Status } from "./PostList";

/* ---------- Types برای API ---------- */
interface SavePayload {
  id?: string;
  title: string;
  slug: string;
  content: string;
  status: Status;
  tags?: string[];
  coverUrl?: string | null;
}

type ApiOk =
  | { id: string; slug: string }
  | { ok: true }
  | { ok: true; rows: PostRow[] };

type ApiErr = { error: string };
type ApiResult = ApiOk | ApiErr | null;

/* ---------- Helpers ---------- */
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

async function safeJson(res: Response): Promise<ApiResult> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as ApiResult;
  } catch {
    return null;
  }
}

function isPostRowArray(x: unknown): x is PostRow[] {
  return (
    Array.isArray(x) &&
    x.every((r) => r && typeof r.id === "string" && typeof r.slug === "string")
  );
}

/* ---------- Component ---------- */
export default function PostEditor() {
  // لیست
  const [loadingList, setLoadingList] = useState(false);
  const [rows, setRows] = useState<PostRow[]>([]);
  const [listError, setListError] = useState("");

  // فرم
  const [id, setId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [tagsInput, setTagsInput] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  // ui
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // اسلاگ خودکار از عنوان
  useEffect(() => {
    if (!title) return setSlug("");
    setSlug(slugify(title));
  }, [title]);

  // تگ‌ها
  const tagList = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsInput],
  );

  // لود لیست
  async function loadList() {
    setLoadingList(true);
    setListError("");
    try {
      const res = await fetch("/api/admin/posts/list", {
        credentials: "include",
      });
      const data = await safeJson(res);
      if (!res.ok || !data || "error" in (data ?? {})) {
        setRows([]);
        setListError(
          "error" in (data ?? {})
            ? (data as ApiErr).error
            : "خطا در دریافت لیست",
        );
        return;
      }
      if ("rows" in data && isPostRowArray(data.rows)) {
        setRows(data.rows);
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
      setListError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoadingList(false);
    }
  }
  useEffect(() => {
    void loadList();
  }, []);

  // ریست فرم
  function resetForm() {
    setId(undefined);
    setTitle("");
    setSlug("");
    setContent("");
    setStatus("draft");
    setTagsInput("");
    setCoverUrl(null);
    setPreview(null);
    setMsg("");
  }

  // شروع ادیت
  function pickForEdit(row: PostRow) {
    setId(row.id);
    setTitle(row.title);
    setSlug(row.slug);
    setStatus(row.status);
    setCoverUrl(row.coverUrl ?? null);
    setPreview(row.coverUrl ?? null);
    setContent(row.content);
    setTagsInput("");
    setMsg("");
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ذخیره
  async function saveDraft() {
    setMsg("");
    if (!title.trim() || !slug.trim()) {
      setMsg("عنوان و اسلاگ الزامی است");
      return;
    }
    const payload: SavePayload = {
      id,
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      content,
      status,
      tags: tagList,
      coverUrl,
    };
    const res = await fetch("/api/admin/posts/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await safeJson(res);
    if (!res.ok || !data || "error" in data) {
      setMsg(
        (data && "error" in data && (data as ApiErr).error) ||
          `خطا در ذخیره (${res.status})`,
      );
      return;
    }
    setMsg("ذخیره شد ✅");
    await loadList();
  }

  // انتشار
  async function publishNow() {
    setMsg("");
    await saveDraft();
    const res = await fetch("/api/admin/posts/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ slug: slug.toLowerCase() }),
    });
    const data = await safeJson(res);
    if (!res.ok || !data || "error" in data) {
      setMsg(
        (data && "error" in data && (data as ApiErr).error) ||
          `خطا در انتشار (${res.status})`,
      );
      return;
    }
    setStatus("published");
    setMsg("منتشر شد 🎉");
    await loadList();
  }

  // حذف
  async function removePost(row: PostRow) {
    if (!confirm(`حذف «${row.title}»؟`)) return;
    const res = await fetch("/api/admin/posts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: row.id }),
    });
    const data = await safeJson(res);
    if (!res.ok || !data || "error" in data) {
      alert(
        (data && "error" in data && (data as ApiErr).error) ||
          `خطا در حذف (${res.status})`,
      );
      return;
    }
    if (row.id === id) resetForm();
    await loadList();
  }

  // آپلود کاور
  async function onPickCover(f: File) {
    if (!f || !slug.trim()) {
      setMsg("برای آپلود کاور، اول عنوان/اسلاگ را وارد کن.");
      return;
    }
    if (!f.type.startsWith("image/")) {
      setMsg("فقط فایل تصویر مجاز است.");
      return;
    }

    setPreview(URL.createObjectURL(f));
    setUploading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("slug", slug.trim().toLowerCase());

      const res = await fetch("/api/admin/posts/upload", {
        method: "POST",
        body: fd,
      });
      const text = await res.text();
      const data: { url?: string; error?: string } = (() => {
        try {
          return JSON.parse(text);
        } catch {
          return { error: text };
        }
      })();

      if (!res.ok || data.error || !data.url) {
        setMsg(`خطا در آپلود: ${data.error ?? res.statusText}`);
        return;
      }

      setCoverUrl(data.url);
      setMsg("کاور آپلود شد ✅ (ذخیره را بزن)");
    } catch (e) {
      setMsg(`خطای غیرمنتظره: ${(e as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl p-4" dir="rtl">
        {/* ادیتور */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              {id ? "ویرایش پست" : "پست جدید"}
            </h1>
            {id && (
              <button
                onClick={resetForm}
                className="text-xs rounded-md border px-3 py-1 hover:bg-gray-50"
              >
                جدید
              </button>
            )}
          </div>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان…"
            className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">اسلاگ:</span>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-post-slug"
              className="flex-1 rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Cover */}
          <div className="rounded-xl border border-gray-300 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">کاور مقاله</div>
              {uploading && (
                <div className="text-xs text-emerald-600">در حال آپلود…</div>
              )}
            </div>

            <div className="mt-3 flex items-start gap-4">
              <label className="inline-flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-50">
                انتخاب تصویر
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onPickCover(f);
                  }}
                />
              </label>

              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="cover preview"
                  className="h-24 w-24 rounded-lg border object-cover"
                />
              )}
            </div>

            {coverUrl && (
              <p className="mt-2 break-all text-xs text-gray-600 ltr:font-mono">
                {coverUrl}
              </p>
            )}
          </div>

          <RichText
            value={content}
            onChange={setContent}
            onPickImage={async () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";

              return new Promise<string | null>((resolve) => {
                input.onchange = async () => {
                  const f = input.files?.[0];
                  if (!f) return resolve(null);
                  const fd = new FormData();
                  fd.append("file", f);
                  fd.append("slug", slug.trim().toLowerCase());
                  const res = await fetch("/api/admin/posts/upload", {
                    method: "POST",
                    body: fd,
                  });
                  const data: { url?: string; error?: string } =
                    await res.json();
                  resolve(data.url ?? null);
                };
                input.click();
              });
            }}
          />

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">وضعیت:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
              </select>
            </div>

            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="تگ‌ها با ویرگول: nextjs, supabase"
              className="w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:flex-1"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveDraft}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              ذخیره
            </button>
            <button
              onClick={publishNow}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              انتشار
            </button>
          </div>

          {msg && <p className="text-sm text-emerald-700">{msg}</p>}
        </section>

        {/* لیست زیر ادیتور */}
        <PostList
          rows={rows}
          loading={loadingList}
          error={listError}
          onRefresh={loadList}
          onEdit={pickForEdit}
          onDelete={removePost}
        />
      </div>
    </div>
  );
}
