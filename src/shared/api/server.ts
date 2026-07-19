type FetchOptions = {
  revalidate?: number | false;
};

const SERVER_FETCH_TIMEOUT_MS = 15_000;

export async function getServer<T = unknown>(
  path: string,
  options?: FetchOptions,
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: options?.revalidate ?? 3600 },
      signal: AbortSignal.timeout(SERVER_FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(
        `GET ${path} timed out after ${SERVER_FETCH_TIMEOUT_MS}ms`,
      );
    }
    throw error;
  }

  if (!res.ok) {
    throw new Error(`GET ${path} failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}
