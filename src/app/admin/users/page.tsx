import RequireAuth from "@/app/components/admin/RequireAuth";
import UserAccessCard from "@/app/components/admin/user-access/UsersAccessCard";
export default function Page() {
  return (
    <RequireAuth allow={["FULL"]}>
      <UserAccessCard />
    </RequireAuth>
  );
}
