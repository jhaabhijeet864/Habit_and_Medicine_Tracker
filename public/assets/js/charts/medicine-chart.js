// Medicine adherence charts (placeholder)
export function renderMedicineChart(ctx, data = []) {
  if (!ctx) return;
  const c = ctx.getContext('2d');
  c.clearRect(0, 0, ctx.width, ctx.height);
  const w = ctx.width / (data.length || 1);
  data.forEach((v, i) => {
    c.fillStyle = '#3b82f6';
    const h = (v / 100) * ctx.height;
    c.fillRect(i * w + 4, ctx.height - h, w - 8, h);
  });
}