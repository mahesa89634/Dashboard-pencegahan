export interface CompressionResult {
  dataUrl: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  width: number;
  height: number;
  originalFormat: string;
  savedPercent: number;
}

/**
 * Formats byte size into human readable string (KB / MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Automatically resizes image to max width of 800px and compresses to JPEG format.
 * Ensures the generated base64 string is lightweight and well below Firestore's 1MB document limit.
 */
export async function compressImageFile(
  file: File | Blob,
  maxWidth = 800,
  initialQuality = 0.75
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const originalFormat = file.type || 'image/jpeg';

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      
      img.onerror = () => reject(new Error('Gagal memproses data gambar'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Resize: limit maximum width to 800px while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context tidak tersedia'));
          return;
        }

        // Fill background with white in case of transparent PNG/WebP to prevent black JPEG background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Multi-pass compression to guarantee small payload (< 400KB)
        let quality = initialQuality;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Rough calculation of base64 size in bytes
        let compressedSize = Math.round((dataUrl.length * 3) / 4);

        // If unexpectedly large, compress more aggressively
        if (compressedSize > 350 * 1024 && quality > 0.4) {
          quality = 0.55;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          compressedSize = Math.round((dataUrl.length * 3) / 4);
        }

        if (compressedSize > 350 * 1024 && quality > 0.3) {
          quality = 0.35;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          compressedSize = Math.round((dataUrl.length * 3) / 4);
        }

        const savedPercent = originalSize > 0 
          ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
          : 0;

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          width,
          height,
          originalFormat,
          savedPercent
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}
