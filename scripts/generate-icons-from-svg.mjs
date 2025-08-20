import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const [, , inputSvg = 'icons/maskable-icon.svg'] = process.argv;
const outDir = 'icons';
const sizes = [512, 384, 256, 192, 180, 128, 96, 72, 48, 32, 16];
const manifestPath = 'manifest.webmanifest';

async function ensureDir(d){ await fs.promises.mkdir(d, {recursive:true}); }

async function main(){
  if(!fs.existsSync(inputSvg)) {
    console.error('لم أجد SVG:', inputSvg);
    process.exit(1);
  }
  await ensureDir(outDir);
  console.log('⏳ تحويل SVG إلى PNG…');
  for(const s of sizes){
    const out = path.join(outDir, `icon-${s}.png`);
    await sharp(inputSvg).resize(s, s, {fit:'cover'}).png().toFile(out);
    console.log('  -', out);
  }
  console.log('⏳ إنشاء favicon.ico…');
  const icoBuf = await pngToIco([
    fs.readFileSync(path.join(outDir, 'icon-16.png')),
    fs.readFileSync(path.join(outDir, 'icon-32.png')),
    fs.readFileSync(path.join(outDir, 'icon-48.png'))
  ]);
  await fs.promises.writeFile(path.join(outDir, 'favicon.ico'), icoBuf);

  // تحديث manifest
  try{
    const m = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
    m.icons = [
      { src:"icons/icon-192.png", sizes:"192x192", type:"image/png", purpose:"any maskable" },
      { src:"icons/icon-512.png", sizes:"512x512", type:"image/png", purpose:"any maskable" },
      { src:"icons/icon-256.png", sizes:"256x256", type:"image/png" },
      { src:"icons/icon-128.png", sizes:"128x128", type:"image/png" }
    ];
    await fs.promises.writeFile(manifestPath, JSON.stringify(m, null, 2), 'utf8');
    console.log('✓ manifest.webmanifest updated');
  }catch(e){
    console.warn('! تعذّر تحديث manifest تلقائيًا:', e.message);
  }

  console.log('✓ اكتمل توليد الحزمة.');
}
main().catch(e=>{ console.error(e); process.exit(1); });