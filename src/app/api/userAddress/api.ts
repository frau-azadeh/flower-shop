import type {
  ApiGetProfileResponse,
  ApiPostProfileResponse,
  ProfileDto,
} from "@/types/userAddress";

export async function fetchProfile(): Promise<ProfileDto | null> {
  const res = await fetch("/api/profile", {
    credentials: "include",
    cache: "no-store",
  });
  const json: ApiGetProfileResponse = await res.json();
  return json.ok ? json.profile : null;
}

export async function saveProfile(payload: {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
}): Promise<void> {
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: ApiPostProfileResponse = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(
      (json as { message?: string }).message ?? "ثبت اطلاعات ناموفق بود",
    );
  }
}
