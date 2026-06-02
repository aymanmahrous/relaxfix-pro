# نشر RelaxFix PRO على Render - دليل كامل

## ✅ ما تم إنجازه

- ✅ المشروع مبني وجاهز للإنتاج
- ✅ Dockerfile جاهز
- ✅ متغيرات البيئة معدة
- ✅ GitHub repository محدث
- ✅ جميع الاختبارات تمر بنجاح

## 🚀 خطوات النشر على Render

### الخطوة 1: إنشاء حساب Render

1. اذهب إلى https://render.com
2. اضغط "Sign up"
3. سجل الدخول بـ GitHub

### الخطوة 2: إنشاء Web Service

1. في لوحة التحكم، اضغط "New +"
2. اختر "Web Service"
3. اختر "relaxfix-pro" من المستودعات
4. اضغط "Connect"

### الخطوة 3: إعدادات الخدمة

**Name:** `relaxfix-pro`

**Environment:** `Docker`

**Region:** `Singapore` (أو الأقرب إليك)

**Branch:** `main`

### الخطوة 4: متغيرات البيئة

اضغط "Advanced" وأضف هذه المتغيرات:

```env
DATABASE_URL=postgresql://postgres:relaxfix2026@aazhniddjvhuimlxxjfd.supabase.co:5432/postgres
VITE_APP_ID=relaxfix-pro-2026
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=owner-relaxfix-2026
OWNER_NAME=RelaxFix PRO
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=forge_key_server_relaxfix_2026
VITE_FRONTEND_FORGE_API_KEY=forge_key_frontend_relaxfix_2026
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
JWT_SECRET=relaxfix_jwt_secret_key_2026_production_secure_key_12345
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=relaxfix-pro-2026
VITE_APP_TITLE=RelaxFix PRO
NODE_ENV=production
```

### الخطوة 5: إعدادات الموارد

- **Plan:** Starter ($7/month) أو Standard ($25/month)
- **Auto-deploy:** تفعيل (لتحديث تلقائي عند كل push)

### الخطوة 6: النشر

اضغط "Create Web Service" وانتظر البناء والنشر (5-10 دقائق)

## 📊 بعد النشر

### الحصول على الرابط

بعد النشر بنجاح، ستحصل على رابط مثل:
```
https://relaxfix-pro.onrender.com
```

### اختبار الموقع

1. افتح الرابط في المتصفح
2. تحقق من صفحة الهبوط
3. اختبر التنقل بين الصفحات
4. تحقق من وحدة التحكم (F12) من الأخطاء

## 🔗 إضافة نطاق مخصص

### 1. شراء نطاق

- اذهب إلى GoDaddy أو Namecheap
- ابحث عن `relaxfix.ae` أو نطاق آخر
- اشتر النطاق

### 2. ربط النطاق بـ Render

1. في Render، اذهب إلى Service Settings
2. اختر "Custom Domains"
3. أضف نطاقك (مثل `relaxfix.ae`)
4. انسخ DNS records

### 3. تحديث DNS

1. اذهب إلى لوحة التحكم لدى مسجل النطاق
2. أضف CNAME record:
   - Name: `www` (أو `@` للنطاق الجذري)
   - Value: `relaxfix-pro.onrender.com`
3. انتظر التفعيل (24-48 ساعة)

## 🔐 الأمان

### تحديث المتغيرات الحساسة

**لا تستخدم القيم المؤقتة في الإنتاج!**

استبدل هذه المتغيرات بقيم حقيقية:
- `JWT_SECRET` - استخدم قيمة عشوائية قوية
- `BUILT_IN_FORGE_API_KEY` - احصل عليها من Manus
- `VITE_FRONTEND_FORGE_API_KEY` - احصل عليها من Manus
- `DATABASE_URL` - تأكد من أنها آمنة

### تفعيل HTTPS

Render يفعل HTTPS تلقائياً. تحقق من:
1. الرابط يبدأ بـ `https://`
2. شهادة SSL صحيحة

## 📈 المراقبة

### عرض السجلات

1. في Render، اذهب إلى "Logs"
2. شاهد سجلات البناء والتشغيل
3. ابحث عن الأخطاء

### التحقق من الحالة

1. اذهب إلى "Metrics"
2. راقب CPU و Memory
3. تحقق من Uptime

## 🔄 التحديثات

### نشر تحديثات جديدة

```bash
# 1. عدّل الكود محلياً
# 2. اختبره
# 3. ارفعه إلى GitHub
git add .
git commit -m "Update feature"
git push github main

# 4. Render سينشر تلقائياً!
```

## 🆘 استكشاف الأخطاء

### الموقع لا يعمل

1. تحقق من السجلات في Render
2. تأكد من متغيرات البيئة
3. تحقق من اتصال قاعدة البيانات

### بطء الأداء

1. قم بالترقية إلى خطة أعلى
2. أضف مزيد من الموارد
3. استخدم CDN

### مشاكل قاعدة البيانات

1. تحقق من DATABASE_URL
2. تأكد من أن Supabase يعمل
3. قم بتشغيل الهجرات يدويًا

## 📞 الدعم

- Render Support: https://support.render.com
- Supabase Support: https://supabase.com/support
- GitHub: https://github.com/aymanmahrous/relaxfix-pro

## ✅ قائمة التحقق النهائية

- [ ] تم إنشاء حساب Render
- [ ] تم ربط GitHub
- [ ] تم إنشاء Web Service
- [ ] تم إضافة متغيرات البيئة
- [ ] تم النشر بنجاح
- [ ] الموقع يعمل على الرابط
- [ ] تم اختبار الصفحات
- [ ] تم إضافة نطاق مخصص (اختياري)
- [ ] تم تفعيل HTTPS
- [ ] تم اختبار جميع الميزات

---

**تم! موقعك الآن مباشر على الإنترنت! 🎉**
