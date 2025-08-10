"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  ImagePlus,
  Eye,
  Save,
  Upload,
  Tag,
  FileText,
  Settings2,
} from "lucide-react";

type Status = "draft" | "published";

export default function PostEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("draft");
  const [tags, setTags] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [preview, setPreview] = useState(false);

  // ساخت اسلاگ از روی عنوان (قابل ویرایش)
  useEffect(() => {
    if (!title) return setSlug("");
    setSlug(slugify(title));
  }, [title]);

  const tagList = useMemo(
    () =>
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tags],
  );

  return (
    <section dir="rtl" className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Header actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Settings2 className="size-5" />
          <span className="text-sm">ویرایش نوشته</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => setPreview((v) => !v)}
          >
            <Eye className="size-4" />
            پیش‌نمایش
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            disabled
            title="فعلاً فقط UI"
          >
            <Save className="size-4" />
            ذخیره پیش‌نویس
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm text-white hover:opacity-90"
            disabled
            title="فعلاً فقط UI"
          >
            <Upload className="size-4" />
            انتشار
          </button>
        </div>
      </div>

      {/* Grid: editor + sidebar */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
        {/* Editor */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 text-right">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان نوشته..."
            className="w-full border-none bg-transparent text-xl md:text-2xl font-bold outline-none placeholder:text-slate-400"
          />

          {/* Slug */}
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>اسلاگ:</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 outline-none focus:bg-white"
              placeholder="my-post-slug"
            />
          </div>

          {/* Toolbar (UI فقط) */}
          <div className="mt-4 flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600">
            <ToolBtn icon={<Bold className="size-4" />} />
            <ToolBtn icon={<Italic className="size-4" />} />
            <ToolBtn icon={<Heading2 className="size-4" />} />
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <ToolBtn icon={<List className="size-4" />} />
            <ToolBtn icon={<ListOrdered className="size-4" />} />
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <ToolBtn icon={<LinkIcon className="size-4" />} />
            <ToolBtn icon={<ImagePlus className="size-4" />} />
          </div>

          {/* Content */}
          {!preview ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="متن نوشته را اینجا بنویسید..."
              rows={16}
              className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-7 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          ) : (
            <article className="prose prose-slate rtl:prose-ul:text-right rtl:prose-ol:text-right max-w-none mt-4">
              {/* پیش‌نمایش خیلی ساده؛ بعداً می‌تونی Markdown/Tiptap وصل کنی */}
              {content ? (
                <div className="whitespace-pre-wrap text-slate-800">
                  {content}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
                  <FileText className="size-10 mb-3" />
                  هنوز متنی وارد نشده است.
                </div>
              )}
            </article>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">وضعیت</h4>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر شده</option>
            </select>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Tag className="size-4" />
              برچسب‌ها
            </h4>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="مثال: آموزش, نکست, ترفند"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {tagList.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tagList.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cover */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">
              تصویر کاور
            </h4>
            <input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="پیوند تصویر (URL)"
              className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt=""
                className="aspect-video w-full rounded-xl object-cover"
              />
            ) : (
              <div className="aspect-video w-full rounded-xl border border-dashed border-slate-200 bg-slate-50" />
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ToolBtn({ icon }: { icon: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-lg px-2 py-1 hover:bg-white"
      disabled
      title="فعلاً فقط UI"
    >
      {icon}
    </button>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
