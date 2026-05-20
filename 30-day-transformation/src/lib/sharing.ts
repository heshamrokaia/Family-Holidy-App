export async function generateBeforeAfterCard(
  beforePhoto: string,
  afterPhoto: string,
  stats: { weightLost: number; daysCompleted: number; bodyFatLost?: number },
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('30-Day Transformation', 540, 100);

  // Subtitle
  ctx.font = '24px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Intermittent Fasting Journey', 540, 145);

  // Load and draw photos
  const [beforeImg, afterImg] = await Promise.all([
    loadImage(beforePhoto),
    loadImage(afterPhoto),
  ]);

  const photoWidth = 460;
  const photoHeight = 650;
  const photoY = 200;
  const gap = 40;

  // Before photo
  ctx.save();
  roundedRect(ctx, 50, photoY, photoWidth, photoHeight, 16);
  ctx.clip();
  ctx.drawImage(beforeImg, 50, photoY, photoWidth, photoHeight);
  ctx.restore();

  // After photo
  ctx.save();
  roundedRect(ctx, 50 + photoWidth + gap, photoY, photoWidth, photoHeight, 16);
  ctx.clip();
  ctx.drawImage(afterImg, 50 + photoWidth + gap, photoY, photoWidth, photoHeight);
  ctx.restore();

  // Labels
  ctx.font = 'bold 28px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('BEFORE', 50 + photoWidth / 2, photoY + photoHeight + 45);
  ctx.fillStyle = '#22c55e';
  ctx.fillText(`DAY ${stats.daysCompleted}`, 50 + photoWidth + gap + photoWidth / 2, photoY + photoHeight + 45);

  // Stats section
  const statsY = photoY + photoHeight + 100;
  const statItems = [
    { label: 'Weight Lost', value: `${stats.weightLost.toFixed(1)} kg` },
    { label: 'Days', value: `${stats.daysCompleted}` },
  ];
  if (stats.bodyFatLost) {
    statItems.push({ label: 'Body Fat', value: `-${stats.bodyFatLost.toFixed(1)}%` });
  }

  const statWidth = 1080 / statItems.length;
  statItems.forEach((stat, i) => {
    const x = statWidth * i + statWidth / 2;
    ctx.font = 'bold 56px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#818cf8';
    ctx.textAlign = 'center';
    ctx.fillText(stat.value, x, statsY + 50);
    ctx.font = '22px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(stat.label, x, statsY + 85);
  });

  // Watermark
  ctx.font = '20px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.textAlign = 'center';
  ctx.fillText('30-Day Transformation App', 540, 1880);

  return canvas.toDataURL('image/jpeg', 0.9);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export async function shareContent(
  dataUrl: string,
  title: string,
  text: string,
): Promise<boolean> {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'transformation.jpg', { type: 'image/jpeg' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ title, text, files: [file] });
      return true;
    }
  } catch {
    // User cancelled or share failed
  }

  // Fallback: download
  downloadImage(dataUrl, 'transformation.jpg');
  return false;
}

export function downloadImage(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
