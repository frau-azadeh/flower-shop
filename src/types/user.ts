export type ProfileDto = {
  id: string;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
};

export type ApiGetProfileResponse =
  | { ok: true; profile: ProfileDto | null }
  | { ok: false; message: string };

export type ApiPostProfileResponse =
  | { ok: true }
  | { ok: false; message: string };
