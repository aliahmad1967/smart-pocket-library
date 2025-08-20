# المكتبة التفاعلية الذكية – كتب الجيب
تطبيق ويب ثابت (Static) يعمل محليًا 100% بقاعدة بيانات localStorage. يدعم إدارة الكتب (إضافة/تعديل/حذف) والملاحظات والقراءة والملخص الصوتي (تجريبي)، مع ثيم فاتح/داكن.

## كيف أشغّله محليًا؟
- الطريقة الأسرع: افتح الملف index.html بالنقر المزدوج (سيعمل كل شيء، لكن الـ Service Worker لن يعمل من file://).
- تشغيل كـ PWA محليًا:
  - Python: `python -m http.server 5173` ثم افتح http://localhost:5173
  - Node (serve): `npx serve .` ثم افتح الرابط الذي يعطيه الأمر.
  - Node (http-server): `npx http-server -p 5173`

## النشر على نطاق
- GitHub Pages:
  1) أنشئ مستودع جديد وارفَع ملفات المشروع في الجذر.
  2) من Settings > Pages اختر المصدر "Deploy from a branch" والفرع main والمجلد root.
  3) بعد النشر سيظهر رابط الموقع. لتفعيل PWA يجب أن يكون https (Pages يدعم https تلقائيًا).
  4) (اختياري) أضف ملف `CNAME` يحتوي اسم النطاق المخصص إن أردت.

- Netlify:
  1) اسحب وأفلِت مجلد المشروع في Netlify (Drag & Drop) أو وصّل مستودع Git.
  2) لا يوجد Build Command (فارغ) و Publish directory هو الجذر.
  3) اربط نطاقًا مخصصًا من Domain settings.

- Vercel:
  1) Import Project واختر المستودع.
  2) لا يوجد Build Command (Static) وسيُنشر تلقائيًا.
  3) اربط نطاقًا من Settings > Domains.

- نطاق مخصص (DNS):
  - إذا كان عبر GitHub Pages: أضف سجل CNAME يشير إلى `username.github.io`.
  - إذا كان عبر Netlify/Vercel: اتّبع تعليمات مزود الخدمة لإضافة CNAME/A.
  - انتظر انتشار الـ DNS ثم فعّل HTTPS من لوحة التحكم.

## الأيقونات (PWA)
ضع ملفين PNG في مجلد `icons/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
يمكنك توليدهما سريعًا عبر أي أداة (Favicon Generator) أو تصميم بسيط.

## قاعدة البيانات
- كل شيء محفوظ في `localStorage` تحت المفتاح `smartPocketLibDB`.
- من "ملفي" يمكنك تصدير/استيراد قاعدة البيانات كملف JSON.
- يوجد محرّر لإضافة/تعديل/حذف الكتب، ومجمّع ملاحظات.

## ملاحظات
- يعمل دون إنترنت بعد أول تحميل عبر HTTPS (بفضل Service Worker).
- إن غيّرت أي ملف، زِد رقم النسخة في `sw.js` داخل `CACHE_NAME` لتحديث الكاش للمستخدمين."# smart-pocket-library" 
