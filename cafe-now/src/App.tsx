import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useFavorites } from "./useFavorites";

type Cafe = {
  id: string;
  name: string;
  area: string;
  lat?: number;
  lng?: number;
};

export default function App() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Hooks はここ
  const fav = useFavorites();

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const snap = await getDocs(collection(db, "cafes"));
        const list: Cafe[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Cafe, "id">),
        }));
        console.log("Firestore snapshot:", list.length);
        setCafes(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h1>Cafe Now</h1>

      {/* ===== 詳細 ===== */}
     {selectedCafe ? (
  <div>
    <button onClick={() => setSelectedCafe(null)}>← 戻る</button>

    {/* ① カフェ名 */}
    <h2>{selectedCafe.name}</h2>

    {/* ② エリア */}
    <p>エリア：{selectedCafe.area}</p>

    {/* ③ ★ここに地図を追加する★ */}
    {selectedCafe.lat && selectedCafe.lng && (
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
    )}

    {/* ④ お気に入り */}
    <button onClick={() => fav.toggle(selectedCafe.id)}>
      {fav.isFav(selectedCafe.id) ? "❤️ お気に入り" : "🤍 お気に入り"}
    </button>
  </div>
) : (
        // ===== 一覧 =====
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
              </div>

              {/* ❤️ 一覧お気に入り */}
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
