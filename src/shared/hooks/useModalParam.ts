import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UseModalParamReturn = {
  value: string | null;
  set: (value: string) => void;
  clear: () => void;
};

export function useModalParam(key: string): UseModalParamReturn {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const value = searchParams.get(key);

  const set = (val: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, val);
    router.push(`${pathname}?${next}`, { scroll: false });
  };

  const clear = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return { value, set, clear };
}
