"use client"

import { useEffect, useMemo, useState } from "react"

type Status = "draft" | "published"
type ApiResult = { id?: string; slug?: string; error?: string } | null

export default function PostEditor() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<Status>("draft")
  const [tagsInput, setTagsInput] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!title) return setSlug("")
    setSlug(slugify(title))
  }, [title])

  const tagList = useMemo(
    () => tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    [tagsInput],
  )

  // helper خیلی ساده برای parse کردن پاسخ
  async function safeJson(res: Response): Promise<ApiResult> {
    try {
      const text = await res.text()
      if (!text) return null
      return JSON.parse(text) as ApiResult
    } catch {
      return null
    }
  }

  async function saveDraft() {
    setMessage("")
    const res = await fetch("/api/admin/posts/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slug.toLowerCase(),
        content,
        status,
        // tags: tagList, // اگر الان در API استفاده نمی‌کنی، لازم نیست بفرستی
      }),
    })

    const data = await safeJson(res)
    if (!res.ok) {
      return setMessage(data?.error || `خطا در ذخیره (${res.status})`)
    }
    setMessage("ذخیره شد ✅")
  }

  async function publishNow() {
    setMessage("")
    await saveDraft()

    const res = await fetch("/api/admin/posts/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug.toLowerCase() }),
    })

    const data = await safeJson(res)
    if (!res.ok) {
      return setMessage(data?.error || `خطا در انتشار (${res.status})`)
    }
    setStatus("published")
    setMessage("منتشر شد 🎉")
  }

  return (
    <section dir="rtl" className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-xl font-bold">نوشتهٔ جدید</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان…"
        className="w-full rounded-md border p-2"
      />

      <div className="flex items-center gap-2 text-sm">
        <span>اسلاگ:</span>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="my-post-slug"
          className="flex-1 rounded-md border p-2"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="متن…"
        rows={10}
        className="w-full rounded-md border p-2"
      />

      <div className="flex items-center gap-2">
        <label className="text-sm">وضعیت:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="rounded-md border p-2"
        >
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشر شده</option>
        </select>
      </div>

      <input
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="تگ‌ها با ویرگول: nextjs, supabase"
        className="w-full rounded-md border p-2"
      />

      <div className="flex gap-2">
        <button onClick={saveDraft} className="rounded-md border px-3 py-2">
          ذخیره
        </button>
        <button onClick={publishNow} className="rounded-md bg-black px-3 py-2 text-white">
          انتشار
        </button>
      </div>

      {message && <p className="text-emerald-600 text-sm">{message}</p>}
    </section>
  )
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
}
