import { useEffect, useState } from "react";

type Location = {
  lat: number;
  lng: number;
};

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("位置情報が利用できません");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setError("位置情報の取得が拒否されました");
      }
    );
  }, []);

  return { location, error };
}
