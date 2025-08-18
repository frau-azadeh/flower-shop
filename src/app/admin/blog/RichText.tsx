"use client";

import { useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

export type RichTextProps = {
  value: string;
  onChange: (html: string) => void;
  onPickImage?: () => Promise<string | null>;
};

type Align = "left" | "center" | "right" | "justify";

function cx(...cls: Array<string | false>): string {
  return cls.filter(Boolean).join(" ");
}

export default function RichText({
  value,
  onChange,
  onPickImage,
}: RichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // ساده‌تر
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
      Color,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    immediatelyRender: false, // جلوگیری از هیدریشن
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // سینک مقدار بیرونی با ادیتور
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [value, editor]);

  // درج تصویر
  async function addImage() {
    if (!editor || !onPickImage) return;
    const url = await onPickImage();
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  // ساخت/حذف لینک
  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | null;
    const url = window.prompt("آدرس لینک:", prev ?? "https://");
    if (url === null) return; // Cancel
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
      .run();
  }

  function unsetLink() {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }

  function align(dir: Align) {
    if (!editor) return;
    editor.chain().focus().setTextAlign(dir).run();
  }

  const toolbarDisabled = useMemo(() => !editor, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-xl">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center p-2 border-b">
        {/* پاراگراف و هدینگ‌ها */}
        <div className="flex gap-1">
          <Btn
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
          >
            P
          </Btn>
          {[2, 3, 4].map((lvl) => (
            <Btn
              key={lvl}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: lvl as 2 | 3 | 4 })
                  .run()
              }
              active={editor.isActive("heading", { level: lvl })}
            >
              H{lvl}
            </Btn>
          ))}
        </div>

        {/* سبک متن */}
        <Sep />
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          B
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          I
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          S
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          U
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          هایلایت
        </Btn>

        {/* لیست‌ها / کوت */}
        <Sep />
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          • لیست
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. لیست
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          ❝ نقل‌قول
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          — خط
        </Btn>

        {/* تراز متن */}
        <Sep />
        <Btn
          onClick={() => align("right")}
          active={editor.isActive({ textAlign: "right" })}
        >
          راست
        </Btn>
        <Btn
          onClick={() => align("center")}
          active={editor.isActive({ textAlign: "center" })}
        >
          وسط
        </Btn>
        <Btn
          onClick={() => align("left")}
          active={editor.isActive({ textAlign: "left" })}
        >
          چپ
        </Btn>
        <Btn
          onClick={() => align("justify")}
          active={editor.isActive({ textAlign: "justify" })}
        >
          هم‌تراز
        </Btn>

        {/* لینک و تصویر */}
        <Sep />
        <Btn onClick={setLink} active={editor.isActive("link")}>
          🔗 لینک
        </Btn>
        <Btn onClick={unsetLink} disabled={!editor.isActive("link")}>
          قطع لینک
        </Btn>
        <Btn onClick={addImage}>🖼️ تصویر</Btn>

        {/* Undo/Redo */}
        <Sep />
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </Btn>

        {/* انتخاب رنگ متن نمونه (چند رنگ پایه) */}
        <Sep />
        {["#111827", "#ef4444", "#10b981", "#3b82f6", "#f59e0b"].map((c) => (
          <button
            key={c}
            type="button"
            title="رنگ متن"
            className={cx(
              "w-5 h-5 rounded border",
              editor.isActive("textStyle", { color: c }) &&
                "ring-2 ring-offset-1",
            )}
            style={{ backgroundColor: c }}
            onClick={() => editor.chain().focus().setColor(c).run()}
          />
        ))}
        <button
          type="button"
          className="px-2 py-1 text-xs border rounded"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          حذف رنگ
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-3 min-h-[240px] prose prose-slate max-w-none"
      />
    </div>
  );
}

/* ————— کمکی‌های UI ————— */
type BtnProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};
function Btn({
  onClick,
  active = false,
  disabled = false,
  children,
}: BtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "px-2 py-1 text-sm border rounded",
        active && "bg-slate-900 text-white",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return (
    <span className="mx-1 h-5 w-px bg-slate-300 inline-block align-middle" />
  );
}
