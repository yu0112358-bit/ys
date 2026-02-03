export type CrowdLevel = "empty" | "normal" | "busy";

export function estimateCrowd(): {
  level: CrowdLevel;
  label: string;
} {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0:日曜

  // 平日昼
  if (day >= 1 && day <= 5 && hour >= 12 && hour <= 13) {
    return { level: "busy", label: "混雑" };
  }

  // 平日夕方
  if (day >= 1 && day <= 5 && hour >= 17 && hour <= 19) {
    return { level: "normal", label: "やや混雑" };
  }

  // 週末昼
  if ((day === 0 || day === 6) && hour >= 11 && hour <= 15) {
    return { level: "normal", label: "やや混雑" };
  }

  return { level: "empty", label: "空いてそう" };
}
