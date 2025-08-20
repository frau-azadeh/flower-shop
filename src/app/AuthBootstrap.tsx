"use client";

import { useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { useAppDispatch } from "@/store/hooks";
import { setProfile, clearProfile, setStatus } from "@/store/user/userSlice";
import { setOwner } from "@/store/orders/cartSlice";

type ProfileRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
};

export default function AuthBootstrap(): null {
  const supabase = createSupabaseClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      dispatch(setStatus("loading"));
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;

      // سبد را به همین کاربر/میهمان گره بزن
      dispatch(setOwner(uid));

      if (uid) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, fullName, email, phone")
          .eq("id", uid)
          .maybeSingle();

        profile
          ? dispatch(setProfile(profile as ProfileRow))
          : dispatch(clearProfile());
      } else {
        dispatch(clearProfile());
      }
      dispatch(setStatus("idle"));
    };

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      const uid = session?.user?.id ?? null;
      dispatch(setOwner(uid)); // تغییر کاربر ⇒ سبد همان کاربر
      load(); // پروفایل را تازه کن
    });

    return () => {
      sub.subscription?.unsubscribe();
    };
  }, [dispatch, supabase]);

  return null;
}
