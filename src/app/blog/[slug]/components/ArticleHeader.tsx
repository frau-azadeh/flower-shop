type Props = {
  title: string;
  faDate: string;
};

export default function ArticleHeader({ title, faDate }: Props) {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h1>
      {faDate && (
        <span className="mt-2 inline-block text-xs text-gray-500">
          {faDate}
        </span>
      )}
    </div>
  );
}
