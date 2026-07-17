type FetchOptions = {
  revalidate?: number | false;
};

export async function getServer<T = unknown>(
  path: string,
  options?: FetchOptions,
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: options?.revalidate ?? 3600 },
  });

  if (!res.ok) {
    throw new Error(`GET ${path} failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}
