# 📧 Email Configuration Guide

## Overview
Your Black & Gold eCommerce website now sends automatic email notifications for:
1. **Order Confirmation** - Sent to customer when order is placed
2. **New Order Alert** - Sent to admin when new order is received
3. **Order Status Update** - Sent to customer when order status changes

---

## 🔧 Gmail Setup (Recommended for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** on the left
3. Under "Signing in to Google", click **2-Step Verification**
4. Turn on 2-Step Verification

### Step 2: Generate App Password
1. After enabling 2FA, go back to **Security**
2. Under "Signing in to Google", click **App passwords**
3. In the "App" dropdown, select **Mail**
4. In the "Device" dropdown, select **Other**
5. Enter "Black & Gold eCommerce" as the name
6. Click **Generate**
7. **Copy the 16-character password** (save it somewhere safe!)

### Step 3: Update `.env` File

Open `backend/.env` and update:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Your 16-char app password (no spaces)
ADMIN_EMAIL=admin@blackgold.com
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Remove spaces from the app password
- Use the full 16-character password
- Don't use your regular Gmail password!

---

## 📬 Alternative Email Providers

### Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password
```

### Custom SMTP (e.g., SendGrid, Mailgun)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

For custom SMTP, update `emailService.js`:

```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};
```

---

## 🧪 Testing Emails

### Test Order Flow:
1. **Login as a user**: http://localhost:5173/login
   - Email: `user@blackgold.com`
   - Password: `user123`

2. **Add products to cart** and complete checkout

3. **Check email inbox** for order confirmation

4. **Login as admin**: http://localhost:5173/admin/dashboard
   - Email: `admin@blackgold.com`
   - Password: `admin123`

5. **Check admin email** for new order notification

6. **Update order status** in admin panel

7. **Check user email** for status update

---

## 📧 Email Templates

### Customer Emails:
- **Order Confirmation**: Professional design with order details, items table, shipping address
- **Status Update**: Clean update with new status badge

### Admin Emails:
- **New Order Alert**: Urgent notification with customer info, order items, quick actions

All emails feature:
- Black & Gold branding
- Responsive design
- Professional styling
- Order details and totals

---

## ⚠️ Troubleshooting

### Emails not sending?

**Check these:**
1. ✅ Is `EMAIL_USER` your full Gmail address?
2. ✅ Is `EMAIL_PASS` the 16-character app password (not regular password)?
3. ✅ Is 2-Factor Authentication enabled on your Google account?
4. ✅ Check backend console for error messages

**Common errors:**
```
Error: Invalid login
→ Check your app password is correct (no spaces)

Error: Connection timeout
→ Check your internet connection

Error: Authentication required
→ Make sure 2FA is enabled and you're using app password
```

### Using Gmail in Production?

For production, consider:
- **SendGrid**: Free tier available (100 emails/day)
- **Mailgun**: Free tier available (5,000 emails/month)
- **AWS SES**: Pay-as-you-go (very cheap)

---

## 📊 Email Features

| Feature | Status |
|---------|--------|
| Order Confirmation to Customer | ✅ Working |
| New Order Alert to Admin | ✅ Working |
| Status Update to Customer | ✅ Working |
| HTML Email Templates | ✅ Professional |
| Black & Gold Branding | ✅ Consistent |
| Responsive Design | ✅ Mobile-friendly |
| Error Handling | ✅ Non-blocking |

---

## 🎨 Customization

To customize email templates, edit:
```
backend/src/utils/emailService.js
```

You can modify:
- Colors (currently Black #0A0A0A and Gold #C9A54D)
- Logo/branding
- Email content and layout
- Add tracking links
- Add unsubscribe option

---

**Need help?** Check the backend console for email send status:
```
✅ Order confirmation email sent to: customer@email.com
✅ New order notification sent to admin: admin@blackgold.com
```
