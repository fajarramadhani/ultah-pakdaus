import { supabase } from "../lib/supabase";
import type { Wish, WishGroup } from "../config/wishes.data";

export interface SupabaseWish {
  id: string;
  name: string;
  company: string;
  message: string;
  group_name?: string;
  created_at?: string;
}

export interface CreateWishInput {
  name: string;
  company: string;
  message: string;
  group_name: WishGroup;
}

const TABLE_PRIMARY = "birthday_wishes";
const TABLE_SECONDARY = "birthday_wishes_firdaus";

/**
 * Convert Supabase record to Wish format
 */
export function formatSupabaseWish(record: SupabaseWish): Wish {
  let group: WishGroup = (record.group_name as WishGroup) || "Tim & Karyawan";
  let role = record.company || "Tamu";

  if (role.includes("(") && role.includes(")")) {
    const match = role.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const g = match[1] as WishGroup;
      if (["Direksi", "Tim & Karyawan", "Rekan & Sahabat", "Keluarga", "Anak"].includes(g)) {
        group = g;
        role = role.replace(/\([^)]+\)/, "").trim();
      }
    }
  }

  return {
    id: String(record.id || `w-${Date.now()}`),
    name: record.name || "Anonim",
    role: role || "Tamu",
    group: group,
    quote: record.message || "",
    mediaType: "text-only",
    isHighlight: false,
  };
}

/**
 * Fetch all birthday wishes from Supabase database
 */
export async function getBirthdayWishes(): Promise<Wish[]> {
  const client = supabase;
  if (!client) {
    console.warn("Supabase client not initialized.");
    return [];
  }

  let { data, error } = await client
    .from(TABLE_PRIMARY)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error || !data || data.length === 0) {
    const fallback = await client
      .from(TABLE_SECONDARY)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (!fallback.error && fallback.data) {
      data = fallback.data;
    }
  }

  return (data || []).map((item) => formatSupabaseWish(item as SupabaseWish));
}

/**
 * Insert a new birthday wish into Supabase database
 */
export async function createBirthdayWish(input: CreateWishInput): Promise<Wish> {
  const client = supabase;
  if (!client) {
    throw new Error("Koneksi Supabase belum siap.");
  }

  const cleanName = input.name.trim();
  const cleanCompany = `${input.company.trim()} (${input.group_name})`;
  const cleanMessage = input.message.trim();

  const payload = {
    name: cleanName,
    company: cleanCompany,
    message: cleanMessage,
    group_name: input.group_name,
  };

  let { data, error } = await client
    .from(TABLE_PRIMARY)
    .insert({
      name: cleanName,
      company: cleanCompany,
      message: cleanMessage,
    })
    .select("*")
    .single();

  if (error) {
    const res = await client
      .from(TABLE_SECONDARY)
      .insert(payload)
      .select("*")
      .single();

    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message || "Gagal menyimpan ucapan ke database Supabase.");
  }

  return formatSupabaseWish(data as SupabaseWish);
}

/**
 * Subscribe to realtime INSERT events on birthday_wishes table
 */
export function subscribeToBirthdayWishes(onNewWish: (wish: Wish) => void): () => void {
  const client = supabase;
  if (!client) return () => {};

  const channel = client
    .channel("public-realtime-wishes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: TABLE_PRIMARY },
      (payload) => {
        if (payload.new) onNewWish(formatSupabaseWish(payload.new as SupabaseWish));
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: TABLE_SECONDARY },
      (payload) => {
        if (payload.new) onNewWish(formatSupabaseWish(payload.new as SupabaseWish));
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
