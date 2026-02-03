export type CrowdLevel = "low" | "mid" | "high";

export function estimateCrowd(): {
  level: CrowdLevel;
  label: string;
  color: string;
} {
  const hour = new Date().getHours();

  if (hour >= 11 && hour <= 13) {
    return {
      level: "high",
      label: "混雑",
      color: "#e53935",
    };
  }

  if (hour >= 8 && hour <= 10) {
    return {
      level: "mid",
      label: "やや混雑",
      color: "#fb8c00",
    };
  }

  return {
    level: "low",
    label: "空いています",
    color: "#43a047",
  };
}
