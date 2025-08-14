import PostEditor from "@/app/components/admin/PostEditor";
import RequireAuth from "@/app/components/admin/RequireAuth";

export default function Page() {
  return (
    <RequireAuth allow={["BLOG", "FULL"]}>
      <PostEditor />
    </RequireAuth>
  );
}
