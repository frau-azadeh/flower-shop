"use client";
import { useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { useAppDispatch } from "@/store/hooks";
import { setProfile, clearProfile, setStatus } from "@/store/user/userSlice";

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
    const loadProfile = async () => {
      dispatch(setStatus("loading"));

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data: profile }: { data: ProfileRow | null } = await supabase
          .from("profiles")
          .select("id, fullName, email, phone")
          .eq("id", userId)
          .maybeSingle();

        if (profile) {
          dispatch(setProfile(profile));
        } else {
          dispatch(clearProfile());
        }
      } else {
        dispatch(clearProfile());
      }

      dispatch(setStatus("idle"));
    };

    loadProfile();
  }, [dispatch, supabase]);

  return null;
}
