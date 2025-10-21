# إعطاء اشتراك بريميوم مجاني

## الخطوات:

### 1. إنشاء جدول subscriptions في قاعدة البيانات

قم بتنفيذ ملف `database-subscriptions.sql` في phpMyAdmin أو MySQL:

```bash
mysql -u your_username -p your_database < database-subscriptions.sql
```

أو افتح phpMyAdmin وانسخ محتوى الملف وقم بتنفيذه.

### 2. إعطاء الاشتراك عبر SQL مباشرة

قم بتنفيذ هذا الأمر SQL في phpMyAdmin:

```sql
INSERT INTO subscriptions (
  id, 
  user_email, 
  plan, 
  status, 
  ideas_limit, 
  pdfs_limit, 
  ideas_used, 
  pdfs_used, 
  start_date, 
  end_date, 
  payment_provider
) VALUES 
(UUID(), 'loifortunss@gmail.com', 'pro', 'active', 50, 20, 0, 0, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'manual'),
(UUID(), 'nasrosardouk@gmail.com', 'pro', 'active', 50, 20, 0, 0, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'manual')
ON DUPLICATE KEY UPDATE
  plan = 'pro',
  status = 'active',
  ideas_limit = 50,
  pdfs_limit = 20,
  end_date = DATE_ADD(NOW(), INTERVAL 1 MONTH),
  updated_at = NOW();
```

### 3. إعطاء الاشتراك عبر API (بعد رفع الملفات)

بعد رفع الملفات إلى الخادم، يمكنك استخدام:

**عبر cURL:**

```bash
curl -X POST https://foundyourpath.vercel.app/api/admin/grant-subscription \
  -H "Content-Type: application/json" \
  -d '{"email": "loifortunss@gmail.com", "plan": "pro", "months": 1}'

curl -X POST https://foundyourpath.vercel.app/api/admin/grant-subscription \
  -H "Content-Type: application/json" \
  -d '{"email": "nasrosardouk@gmail.com", "plan": "pro", "months": 1}'
```

**عبر Node.js Script:**

```bash
node grant-premium.js
```

### 4. التحقق من الاشتراك

يمكنك التحقق من الاشتراك عبر:

```sql
SELECT * FROM subscriptions WHERE user_email IN ('loifortunss@gmail.com', 'nasrosardouk@gmail.com');
```

## ما تم تضمينه:

### الحسابات التي حصلت على Premium:
1. ✅ **loifortunss@gmail.com** (Night King)
2. ✅ **nasrosardouk@gmail.com** (nasro yousfi)

### مدة الاشتراك:
- **1 شهر مجاني** من تاريخ التفعيل

### مزايا Pro Plan:
- ✅ 50 تحليل فكرة شهرياً
- ✅ 20 تحميل PDF شهرياً
- ✅ دعم ذو أولوية
- ✅ ميزات متقدمة
- ✅ تعاون الفريق

## ملاحظات:

1. سيتم إعادة تعيين الحدود تلقائياً في بداية كل شهر
2. يمكن تمديد الاشتراك بتنفيذ نفس الأوامر مع تاريخ انتهاء جديد
3. النظام يتحقق تلقائياً من انتهاء الاشتراك ويرجع للخطة المجانية
4. يتم حفظ استخدام الأفكار و PDFs لتتبع الحصص

## لإضافة المزيد من المستخدمين:

قم بتعديل ملف `grant-premium.js` وأضف الإيميلات الجديدة:

```javascript
const emails = [
  'loifortunss@gmail.com',
  'nasrosardouk@gmail.com',
  'new_user@example.com'  // أضف هنا
];
```

أو نفذ SQL مباشرة مع الإيميل الجديد.

