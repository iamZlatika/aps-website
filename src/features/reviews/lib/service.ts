const AVATAR_COLORS = [
  "#ee7a3a",
  "#5db86f",
  "#3a8fd9",
  "#d8553e",
  "#7b5cd4",
  "#2db5a3",
  "#b94a14",
];

export function getAvatarColor(name: string): string {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export type ReviewStats = {
  avg: number;
  dist: Array<{ star: number; pct: number }>;
};

export function computeReviewStats(ratings: number[]): ReviewStats {
  const total = ratings.length;
  if (total === 0)
    return { avg: 0, dist: [5, 4, 3, 2, 1].map((star) => ({ star, pct: 0 })) };
  const sum = ratings.reduce((s, r) => s + r, 0);
  const avg = sum / total;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: Math.round((ratings.filter((r) => r === star).length / total) * 100),
  }));
  return { avg, dist };
}
