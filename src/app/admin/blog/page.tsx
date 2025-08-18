import AdminBlogClient from "./AdminBlogClient";

export default function Page() {
  // این فایل هیچ dynamic با ssr:false ندارد
  return <AdminBlogClient />;
}
