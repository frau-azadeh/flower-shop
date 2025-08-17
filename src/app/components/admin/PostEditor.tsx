"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "draft" | "published";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: Status;
  content: string;
  coverUrl?: string | null;
  created_at?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
}

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

export default function AdminBlogPage() {
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
    setContent(row.content); // ← محتوای فعلی
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

  // آپلود کاور (از Route سرور)
  async function onPickCover(f: File) {
    if (!f || !slug.trim()) {
      setMsg("برای آپلود کاور، اول عنوان/اسلاگ را وارد کن.");
      return;
    }
    if (!f.type.startsWith("image/")) {
      setMsg("فقط فایل تصویر مجاز است.");
      return;
    }

    // پیش‌نمایش لوکال
    setPreview(URL.createObjectURL(f));
    setUploading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("slug", slug.trim().toLowerCase());

      // توجه: هیچ هِدری از نوع JSON ست نکن!
      const res = await fetch("/api/admin/posts/upload", {
        method: "POST",
        body: fd,
      });

      // پاسخ JSON را امن بخوانیم
      const text = await res.text();
      const data: { url?: string; error?: string } = (() => {
        try {
          return JSON.parse(text);
        } catch {
          return { error: text }; // اگر باز HTML بود، همین متن را نشان بده
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Editor */}
          <section className="md:col-span-2 space-y-4">
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

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان…"
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">اسلاگ:</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-post-slug"
                className="flex-1 rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Cover */}
            <div className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">کاور مقاله</div>
                {uploading && (
                  <div className="text-xs text-emerald-600">در حال آپلود…</div>
                )}
              </div>

              <div className="mt-3 flex items-start gap-4">
                <label className="inline-flex items-center rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                  انتخاب تصویر
                  <input
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
                  <img
                    src={preview}
                    alt="cover preview"
                    className="h-24 w-24 rounded-lg object-cover border"
                  />
                )}
              </div>

              {coverUrl && (
                <p className="mt-2 text-xs ltr:font-mono break-all text-gray-600">
                  {coverUrl}
                </p>
              )}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="متن…"
              rows={10}
              className="w-full rounded-xl border p-3 leading-7 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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

              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="تگ‌ها با ویرگول: nextjs, supabase"
                className="w-full sm:flex-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

            {msg && <p className="text-emerald-700 text-sm">{msg}</p>}
          </section>

          {/* List */}
          <aside className="md:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">پست‌ها</h2>
              <button
                onClick={loadList}
                className="text-xs rounded-md border px-3 py-1 hover:bg-gray-50"
                disabled={loadingList}
              >
                بروزرسانی
              </button>
            </div>

            {listError && (
              <p className="text-red-600 text-sm mb-2">خطا: {listError}</p>
            )}

            <ul className="space-y-3">
              {rows.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl bg-white border p-3 flex items-start justify-between gap-3 shadow-sm"
                >
                  <button
                    onClick={() => pickForEdit(r)}
                    className="flex-1 text-start"
                    title="ویرایش"
                  >
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs opacity-70 ltr:font-mono">
                      /blog/{r.slug}
                    </div>
                    <div
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                        r.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                    </div>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => pickForEdit(r)}
                      className="text-blue-600 text-xs underline"
                      title="ویرایش"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => removePost(r)}
                      className="text-red-600 text-xs underline"
                      title="حذف"
                    >
                      حذف
                    </button>
                  </div>
                </li>
              ))}
              {rows.length === 0 && !loadingList && (
                <li className="rounded-xl bg-white border p-3 text-sm opacity-70">
                  هنوز پستی ندارید.
                </li>
              )}
              {loadingList && (
                <li className="rounded-xl bg-white border p-3 text-sm opacity-70">
                  در حال بارگذاری…
                </li>
              )}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
