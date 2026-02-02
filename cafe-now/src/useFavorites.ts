import { useEffect, useState } from "react";

const KEY = "cafe-now:favorites";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setIds(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle = (id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const isFav = (id: string) => ids.includes(id);

  return { ids, toggle, isFav };
}
