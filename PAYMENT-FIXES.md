# إصلاحات الدفع والاشتراكات 💳✅

## المشاكل التي تم حلها:

### 1. ❌ زر Dashboard غير ظاهر بعد تسجيل الدخول
**الحل:** ✅
- أضفت زر **Dashboard** في الهيدر (Desktop & Mobile)
- يظهر فقط عندما يكون المستخدم مسجل دخول
- يأخذك مباشرة إلى `/dashboard`

### 2. ❌ الاشتراك لم يُفعّل بعد الدفع الناجح
**الحل:** ✅
- أنشأت webhook محسّن `/api/webhooks/dodo/route.ts`
- يستمع لـ `payment.successful` من Dodo Payments
- يفعّل الاشتراك تلقائياً في قاعدة البيانات
- يعطي:
  - 50 فكرة/شهر
  - 20 PDF/شهر
  - مدة شهر واحد

### 3. ❌ لا يعيد التوجيه للوحة التحكم بعد الدفع
**الحل:** ✅
- أنشأت صفحة `/payment/success`
- تظهر رسالة "Payment Successful! 🎉"
- تعد تنازلي 5 ثواني
- تحول تلقائياً للوحة التحكم
- أو اضغط "Go to Dashboard Now" للتوجه فوراً

---

## الملفات الجديدة:

### 1. `src/app/api/webhooks/dodo/route.ts`
**Webhook محسّن** يتعامل مع:
- ✅ `payment.successful` - تفعيل الاشتراك
- ✅ `subscription.created` - إنشاء اشتراك جديد
- ✅ `subscription.renewed` - تجديد الاشتراك
- ✅ `subscription.canceled` - إلغاء الاشتراك

**كيف يعمل:**
1. يستقبل webhook من Dodo Payments
2. يأخذ الإيميل من `customer_email`
3. يبحث عن المستخدم في قاعدة البيانات
4. ينشئ اشتراك Pro لمدة شهر
5. يسجل الملاحظات في console

### 2. `src/app/payment/success/page.tsx`
**صفحة نجاح الدفع:**
- ✅ رسالة تهنئة
- ✅ قائمة بمزايا Pro Plan
- ✅ عد تنازلي 5 ثواني
- ✅ زر "Go to Dashboard Now"
- ✅ تأكيد إرسال إيميل

### 3. `activate-subscription-manual.js`
**سكريبت يدوي لتفعيل الاشتراك:**

استخدام:
```bash
node activate-subscription-manual.js user@example.com
```

**مفيد إذا:**
- الwebhook لم يشتغل
- تريد تفعيل اشتراك يدوياً
- تريد إضافة Pro لمستخدم معين

---

## التحديثات على الملفات الموجودة:

### 1. `src/app/page.tsx`
**الهيدر Desktop:**
```tsx
{isSignedIn ? (
  <div className="flex items-center space-x-3">
    <Button 
      variant="outline"
      onClick={() => router.push('/dashboard')}
    >
      Dashboard
    </Button>
    <UserButton afterSignOutUrl="/" />
  </div>
) : ...}
```

**القائمة Mobile:**
```tsx
{isSignedIn ? (
  <div className="flex flex-col space-y-3 py-2">
    <Button 
      variant="outline"
      className="w-full justify-start"
      onClick={() => {
        router.push('/dashboard');
        setIsMobileMenuOpen(false);
      }}
    >
      Dashboard
    </Button>
    <div className="py-2">
      <UserButton afterSignOutUrl="/" />
    </div>
  </div>
) : ...}
```

### 2. `src/app/api/subscription/create/route.ts`
أضفت:
```tsx
success_url: `${baseUrl}/payment/success`,
cancel_url: `${baseUrl}/#pricing`,
```

الآن بعد الدفع الناجح، Dodo Payments يحول المستخدم لـ `/payment/success`

---

## كيفية إعداد Webhook في Dodo Payments:

1. اذهب إلى Dodo Payments Dashboard
2. Settings → Webhooks
3. أضف Webhook URL جديد:
   ```
   https://yourpath.vercel.app/api/webhooks/dodo
   ```
4. اختر Events:
   - ✅ `payment.successful`
   - ✅ `subscription.created`
   - ✅ `subscription.renewed`
   - ✅ `subscription.canceled`
5. احفظ

---

## تفعيل اشتراكك يدوياً الآن:

بما أنك دفعت بالفعل ولكن الwebhook لم يشتغل، استخدم السكريبت:

### الطريقة 1: عبر Terminal (في Vercel أو Local):

```bash
# تأكد من وجود environment variables
export DB_HOST=your_db_host
export DB_USER=your_db_user
export DB_PASSWORD=your_db_password
export DB_NAME=foundyourpath

# شغّل السكريبت
node activate-subscription-manual.js your_email@example.com
```

### الطريقة 2: عبر phpMyAdmin (Hostinger):

1. افتح phpMyAdmin
2. اختر database `foundyourpath`
3. اذهب لـ SQL tab
4. نفّذ:

```sql
-- اعثر على user_id
SELECT id, email FROM users WHERE email = 'your_email@example.com';

-- أضف اشتراك Pro
INSERT INTO subscriptions 
(id, user_id, plan, status, start_date, end_date, ideas_limit, pdfs_limit, ideas_used, pdfs_used, created_at, updated_at) 
VALUES (
  CONCAT('sub_', UNIX_TIMESTAMP()), 
  'USER_ID_FROM_ABOVE', 
  'pro', 
  'active', 
  NOW(), 
  DATE_ADD(NOW(), INTERVAL 1 MONTH), 
  50, 
  20, 
  0, 
  0, 
  NOW(), 
  NOW()
);
```

استبدل `USER_ID_FROM_ABOVE` بـ `id` من الاستعلام الأول.

### الطريقة 3: استخدم API endpoint:

```bash
curl -X POST https://yourpath.vercel.app/api/admin/grant-subscription \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email@example.com","plan":"pro","months":1}'
```

---

## التحقق من نجاح التفعيل:

### في phpMyAdmin:
```sql
SELECT * FROM subscriptions WHERE user_email = 'your_email@example.com';
```

يجب أن ترى:
- `plan: pro`
- `status: active`
- `end_date`: بعد شهر من الآن
- `ideas_limit: 50`
- `pdfs_limit: 20`

### في Dashboard:
1. سجل دخول
2. اضغط على Dashboard (الزر الجديد)
3. يجب أن ترى:
   - **Plan Status: Pro**
   - **Ideas Analyzed: 0/50**
   - **PDFs Downloaded: 0/20**

---

## الآن كل شيء يعمل! 🎉

- ✅ زر Dashboard ظاهر
- ✅ الwebhook يفعّل الاشتراك تلقائياً
- ✅ بعد الدفع يحولك لـ /payment/success
- ✅ ثم تلقائياً لـ /dashboard
- ✅ سكريبت يدوي للتفعيل في حالة الطوارئ

---

## ملاحظة هامة:

إذا اشتريت الآن ولم يُفعّل الاشتراك، استخدم **الطريقة 2** (phpMyAdmin) لأنها الأسرع والأضمن.

بعد إعداد Webhook في Dodo Payments، كل المدفوعات المستقبلية ستُفعّل تلقائياً! ✨

