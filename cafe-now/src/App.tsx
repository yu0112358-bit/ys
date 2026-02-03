import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useFavorites } from "./useFavorites";
import { useLocation } from "./useLocation";
import { calcDistance } from "./utils/distance";

type Cafe = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  distance?: number;
};

export default function App() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);

  const fav = useFavorites();
  const { location } = useLocation(); // ← ★これが必要

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const snap = await getDocs(collection(db, "cafes")); // ← ★必要

        const list: Cafe[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Cafe, "id">;

          return {
            id: d.id,
            ...data,
            distance: location
              ? calcDistance(
                  location.lat,
                  location.lng,
                  data.lat,
                  data.lng
                )
              : undefined,
          };
        });

        setCafes(list); // ← ★必要
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false); // ← ★必要
      }
    };

    fetchCafes();
  }, [location]); // ← ★ location が取れたら再計算

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h1>Cafe Now</h1>

      {selectedCafe ? (
        <div>
          <button onClick={() => setSelectedCafe(null)}>← 戻る</button>
          <h2>{selectedCafe.name}</h2>
          <p>エリア：{selectedCafe.area}</p>

          {/* 地図 */}
          <div style={{ marginTop: 12 }}>
            <iframe
              title="map"
              width="100%"
              height="240"
              style={{ border: 0, borderRadius: 8 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${selectedCafe.lat},${selectedCafe.lng}&z=16&output=embed`}
            />
          </div>

          {/* お気に入り */}
          <button onClick={() => fav.toggle(selectedCafe.id)}>
            {fav.isFav(selectedCafe.id) ? "❤️ お気に入り" : "🤍 お気に入り"}
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {cafes.map((cafe) => (
            <div
              key={cafe.id}
              onClick={() => setSelectedCafe(cafe)}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{cafe.name}</strong>
                <div style={{ color: "#666" }}>{cafe.area}</div>

                {cafe.distance && (
                  <div style={{ marginTop: 4 }}>
                    🚶‍♂️ {cafe.distance}m（徒歩約
                    {Math.ceil(cafe.distance / 80)}分）
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fav.toggle(cafe.id);
                }}
              >
                {fav.isFav(cafe.id) ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
