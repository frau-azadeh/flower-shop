type Props = { html: string };

export default function ArticleBody({ html }: Props) {
  return (
    <div className="p-6 sm:p-8">
      <div
        className="
          prose prose-sm lg:prose-base max-w-none text-justify leading-8
          prose-headings:text-gray-900 prose-p:text-gray-700
          prose-a:text-emerald-700 hover:prose-a:text-emerald-800
          prose-strong:font-extrabold
          prose-img:rounded-xl prose-img:border prose-img:mx-auto
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
