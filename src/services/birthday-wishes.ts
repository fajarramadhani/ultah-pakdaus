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

const TABLE_NAME = "birthday_wishes";
const LOCAL_STORAGE_KEY = "mf_birthday_wishes_backup";

/**
 * Format Supabase record to Wish UI model
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
 * Local storage helpers
 */
function getLocalWishes(): Wish[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalWish(wish: Wish): void {
  try {
    const prev = getLocalWishes();
    const updated = [wish, ...prev.filter((w) => w.id !== wish.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save local wish backup:", e);
  }
}

/**
 * Fetch all birthday wishes from Supabase database
 */
export async function getBirthdayWishes(): Promise<Wish[]> {
  const localWishes = getLocalWishes();

  const client = supabase;
  if (!client) {
    return localWishes;
  }

  try {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) {
      console.warn("Supabase fetch notice:", error.message);
      return localWishes;
    }

    const fetchedRemote = (data || []).map((item) => formatSupabaseWish(item as SupabaseWish));
    
    // Merge remote and local entries uniquely by ID
    const remoteIds = new Set(fetchedRemote.map((w) => w.id));
    const uniqueLocal = localWishes.filter((w) => !remoteIds.has(w.id));

    return [...fetchedRemote, ...uniqueLocal];
  } catch (err) {
    console.error("Error fetching wishes:", err);
    return localWishes;
  }
}

/**
 * Insert a new birthday wish into Supabase database
 */
export async function createBirthdayWish(input: CreateWishInput): Promise<Wish> {
  const cleanName = input.name.trim();
  const cleanCompany = `${input.company.trim()} (${input.group_name})`;
  const cleanMessage = input.message.trim();

  const newWishItem: Wish = {
    id: `local-${Date.now()}`,
    name: cleanName,
    role: input.company.trim(),
    group: input.group_name,
    quote: cleanMessage,
    mediaType: "text-only",
    isHighlight: false,
  };

  // Save to local backup first to guarantee zero user data loss
  saveLocalWish(newWishItem);

  const client = supabase;
  if (!client) {
    return newWishItem;
  }

  try {
    const { data, error } = await client
      .from(TABLE_NAME)
      .insert([
        {
          name: cleanName,
          company: cleanCompany,
          message: cleanMessage,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.warn("Supabase insert notice (fallback to local state):", error.message);
      return newWishItem;
    }

    const createdWish = formatSupabaseWish(data as SupabaseWish);
    saveLocalWish(createdWish);
    return createdWish;
  } catch (err) {
    console.warn("Failed inserting into Supabase, wish saved locally:", err);
    return newWishItem;
  }
}

/**
 * Subscribe to realtime INSERT events on birthday_wishes table
 */
export function subscribeToBirthdayWishes(onNewWish: (wish: Wish) => void): () => void {
  const client = supabase;
  if (!client) return () => {};

  try {
    const channel = client
      .channel("public-realtime-wishes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: TABLE_NAME },
        (payload) => {
          if (payload.new) onNewWish(formatSupabaseWish(payload.new as SupabaseWish));
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}
