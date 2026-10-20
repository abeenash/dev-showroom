// Organic "blob" outlines for a 0 0 100 100 viewBox. Each shape is a smooth closed curve through
// 7 points at the given distances from the centre. All shapes share the point count, so
// MorphSVGPlugin can morph between them cleanly.

function blobPath(radii: number[]) {
  const n = radii.length;
  const pts = radii.map((r, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)] as const;
  });
  const p = (i: number) => pts[(i + n) % n];
  const f = (v: number) => v.toFixed(2);
  // Catmull-Rom → cubic Bézier: each segment's control points follow the neighbouring points.
  let d = `M${f(p(0)[0])} ${f(p(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

export const BLOBS = [
  blobPath([46, 41, 47, 43, 45, 40, 47]),
  blobPath([42, 47, 41, 46, 40, 47, 43]),
  blobPath([47, 43, 45, 40, 47, 42, 44]),
] as const;
