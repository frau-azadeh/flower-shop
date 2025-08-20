import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import CheckoutClient from "@/app/components/ui/CheckoutClient";

export default async function CheckoutPage() {
  const sb = await supabaseServer();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) redirect("/login");

  // اگر ستون address نداری، حذفش کن
  const { data: profile } = await sb
    .from("profiles")
    .select("fullName, phone, address")
    .eq("id", u.user.id)
    .single();

  return (
    <CheckoutClient
      defaultFullName={profile?.fullName ?? ""}
      defaultPhone={profile?.phone ?? ""}
      defaultAddress={profile?.address ?? ""}
    />
  );
}
