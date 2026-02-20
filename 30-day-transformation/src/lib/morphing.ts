interface MorphParams {
  headSlimPercent: number;
  waistSlimPercent: number;
  hipSlimPercent: number;
  overallSlimPercent: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function gaussian(x: number, mean: number, sigma: number): number {
  return Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function calculateMorphParams(
  dayNumber: number,
  totalDays: number,
  totalWeightLossPercent: number,
): MorphParams {
  const progress = dayNumber / totalDays;
  const easedProgress = easeOutCubic(progress);
  const dayLossPercent = totalWeightLossPercent * easedProgress;

  return {
    headSlimPercent: dayLossPercent * 0.4,
    waistSlimPercent: dayLossPercent * 1.5,
    hipSlimPercent: dayLossPercent * 0.8,
    overallSlimPercent: dayLossPercent * 0.3,
  };
}

function getSqueezeAtPosition(normalizedY: number, params: MorphParams): number {
  const HEAD_END = 0.20;
  const UPPER_END = 0.40;
  const WAIST_END = 0.65;
  const HIP_END = 0.80;

  if (normalizedY < HEAD_END) {
    const center = 0.15;
    const sigma = 0.08;
    return params.headSlimPercent * gaussian(normalizedY, center, sigma);
  } else if (normalizedY < UPPER_END) {
    const t = (normalizedY - HEAD_END) / (UPPER_END - HEAD_END);
    return lerp(params.headSlimPercent * 0.3, params.waistSlimPercent * 0.5, smoothstep(t));
  } else if (normalizedY < WAIST_END) {
    const center = 0.52;
    const sigma = 0.10;
    return params.waistSlimPercent * gaussian(normalizedY, center, sigma);
  } else if (normalizedY < HIP_END) {
    const center = 0.72;
    const sigma = 0.08;
    return params.hipSlimPercent * gaussian(normalizedY, center, sigma);
  } else {
    const t = (normalizedY - HIP_END) / (1.0 - HIP_END);
    return params.hipSlimPercent * 0.3 * (1 - smoothstep(t));
  }
}

export function morphImage(
  sourceImage: HTMLImageElement,
  canvas: HTMLCanvasElement,
  params: MorphParams,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = sourceImage.naturalWidth;
  const h = sourceImage.naturalHeight;
  canvas.width = w;
  canvas.height = h;

  ctx.clearRect(0, 0, w, h);

  // Fill background with a neutral color to avoid transparency gaps
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, w, h);

  // Draw the image in horizontal slices, each squeezed according to its zone
  const sliceCount = h;

  for (let y = 0; y < sliceCount; y++) {
    const normalizedY = y / sliceCount;
    const squeeze = getSqueezeAtPosition(normalizedY, params);

    const srcX = 0;
    const srcY = y;
    const srcW = w;
    const srcH = 1;

    const squeezePixels = (w * squeeze) / 100;
    const dstX = squeezePixels / 2;
    const dstY = y;
    const dstW = w - squeezePixels;
    const dstH = 1;

    ctx.drawImage(sourceImage, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
  }
}

export function morphImageForDay(
  sourceImage: HTMLImageElement,
  canvas: HTMLCanvasElement,
  day: number,
  totalWeightLossPercent: number,
): void {
  const params = calculateMorphParams(day, 30, totalWeightLossPercent);
  morphImage(sourceImage, canvas, params);
}

export function getMorphedDataUrl(
  sourceDataUrl: string,
  day: number,
  totalWeightLossPercent: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      morphImageForDay(img, canvas, day, totalWeightLossPercent);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = sourceDataUrl;
  });
}

export async function compressPhoto(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const MAX_SIZE = 800;
      let { width, height } = img;

      if (width > height && width > MAX_SIZE) {
        height = (height * MAX_SIZE) / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = (width * MAX_SIZE) / height;
        height = MAX_SIZE;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };

    img.src = url;
  });
}
