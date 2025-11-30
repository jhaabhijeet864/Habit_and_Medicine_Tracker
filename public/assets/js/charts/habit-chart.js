// Habit progress charts (placeholder)
export function renderHabitChart(ctx, data = []) {
  if (!ctx) return;
  // Placeholder: draw simple bars using canvas API
  const c = ctx.getContext('2d');
  c.clearRect(0, 0, ctx.width, ctx.height);
  const w = ctx.width / (data.length || 1);
  data.forEach((v, i) => {
    c.fillStyle = '#10b981';
    const h = (v / 100) * ctx.height;
    c.fillRect(i * w + 4, ctx.height - h, w - 8, h);
  });
}