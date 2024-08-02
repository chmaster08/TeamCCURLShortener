import { SupabaseClient } from "@supabase/supabase-js";
import Url from "./model/url";

export async function listUrls(
  client: SupabaseClient<any, "public", any>,
): Promise<Url[] | null> {
  const { data: urls, error: error } = await client.from("urls").select("*");
  if (error) {
    console.error("error", error);
    return null;
  }

  return urls.map(({ id, original, created_at, short_code }) => ({
    id,
    original,
    createdAt: created_at,
    shortCode: short_code,
  }));
}

export async function searchUrl(
  client: SupabaseClient<any, "public", any>,
  original: string,
): Promise<any | null> {
  const { data: id, error: error } = await client.from("urls").select("id").eq("original", original)
  if (error) {
    console.error("error", error);
    return null;
  }

  return id;
}

export async function createUrl(
  client: SupabaseClient<any, "public", any>,
  name: string,
  original: string,
  shortCode: string,
): Promise<Url | null> {
  const { data: url, error } = await client
    .from("urls")
    .insert([{ name, original, short_code: shortCode }]);

  if (error) {
    console.error("error", error);
    return null;
  }

  return url;
}

export async function updateUrl(
  client: SupabaseClient<any, "public", any>,
  id: number,
  name: string,
  shortCode: string,
): Promise<Url | null> {
  console.log(id);
  const { data: url, error } = await client
    .from("urls")
    .update({ name, short_code: shortCode })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("error", error);
    return null;
  }

  return { ...url, shortCode: url.short_code, createdAt: url.created_at };
}

export async function deleteUrl(
  client: SupabaseClient<any, "public", any>,
  id: number,
): Promise<boolean> {
  const { error } = await client.from("urls").delete().eq("id", id);
  if (error) {
    console.error("error", error);
    return false;
  }

  return true;
}
