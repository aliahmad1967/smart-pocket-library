// scripts/generate-icons.js
// usage: node scripts/generate-icons.js assets/logo.png #2F7F79 #ECE9D6
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const [, , inputPath = 'assets/logo.png', brandColor = '#2F7F79', bgColor = '#ECE9D6'] = process.argv;

const outDir = 'icons';
const manifestPath = 'manifest.webmanifest';

// مقاسات الأيقونات الشائعة
const sizes = [512, 384, 256, 192, 180, 152, 128, 96, 72, 48, 32, 16];

async function ensureDir(d) {
  await fs.promises.mkdir(d, { recursive: true });
}

async function makeIcon(size) {
  const padding = 0.12; // 12% فراغ حول الشعار
  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bgColor
    }
  });

  // نحمّل الشعار ونحجّمه بحيث يترك حدود آمنة
  const logo = await sharp(inputPath)
    .resize(Math.round(size * (1 - padding * 2)))
    .png()
    .toBuffer();

  // نضيف إطار داخلي خافت بنفس اللون الرئيسي (اختياري)
  const border = Math.max(2, Math.round(size * 0.01));
  const bordered = await sharp(logo)
    .extend({ top: border, bottom: border, left: border, right: border, background: bgColor })
    .toBuffer();

  const out = await canvas
    .composite([{ input: bordered, gravity: 'center' }])
    .png()
    .toBuffer();

  const file = path.join(outDir, `icon-${size}.png`);
  await fs.promises.writeFile(file, out);
  return file;
}

async function makeFavicon() {
  // توليد 16 و 32 واستعمالهما لاحقًا لإنشاء .ico إن رغبت
  // كثير من المنصات تكتفي بfavicon-32.png
  // (يمكن إضافة توليد .ico باستخدام حزم إضافية إن لزم)
  return;
}

async function updateManifest() {
  try {
    const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
    manifest.icons = [
      // نضمن 192 و 512 على الأقل مع purpose maskable
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      // بقية المقاسات (اختيارية)
      { src: "icons/icon-384.png", sizes: "384x384", type: "image/png", purpose: "any" },
      { src: "icons/icon-256.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "icons/icon-128.png", sizes: "128x128", type: "image/png", purpose: "any" }
    ];
    // لون الثيم من الشعار
    manifest.theme_color = brandColor;
    await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('✓ manifest.webmanifest updated');
  } catch (e) {
    console.warn('! لم أستطع تحديث manifest.webmanifest تلقائيًا:', e.message);
  }
}

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`! ملف الشعار غير موجود: ${inputPath}`);
    process.exit(1);
  }
  await ensureDir(outDir);
  console.log(`⏳ توليد الأيقونات من: ${inputPath}`);
  for (const s of sizes) {
    await makeIcon(s);
    console.log(`  - icons/icon-${s}.png`);
  }
  await makeFavicon();
  await updateManifest();
  console.log('✓ انتهى توليد الأيقونات.');
  console.log('تذكير: حدّث meta theme-color في index.html إن رغبت بنفس اللون.');
}
main().catch(err => { console.error(err); process.exit(1); });