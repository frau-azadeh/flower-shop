import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function requireUser() {
  const sb = createRouteHandlerClient({ cookies });
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) {
    return {
      ok: false as const,
      res: NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      ),
    };
  }
  return { ok: true as const, userId: user.id };
}
