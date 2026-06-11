# FoolProofDoctor — Complete Setup & Deployment Guide

## Overview

This guide walks you through every step to go from these files to a live site at `foolproofdoctor.com` with a fully working admin panel at `foolproofdoctor.com/admin`.

---

## Step 1 — Firebase Setup

### 1.1 Enable Authentication

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select your project: **foolproofdoctor**
3. In the left sidebar: **Build → Authentication → Get started**
4. Click **Sign-in method** tab
5. Enable **Email/Password** — click it, toggle on, Save
6. Enable **Google** — click it, toggle on, add your support email, Save

### 1.2 Create your Admin Account

Since there is no public registration on the site, you must create your admin account manually:

1. In Firebase Console: **Authentication → Users → Add user**
2. Enter your email and a strong password
3. Click **Add user**
4. That's it — this is the only account that can log in to `/admin`

> If you use Gmail, you can also just click "Continue with Google" on the login screen — Firebase will recognise your Google account automatically.

### 1.3 Set up Firestore Database

1. In Firebase Console: **Build → Firestore Database → Create database**
2. Choose **Production mode** (we will apply the security rules next)
3. Pick your region (choose closest to your users — `us-central1` or `europe-west1`)
4. Click **Enable**

### 1.4 Apply Firestore Security Rules

1. In Firestore: click the **Rules** tab
2. Delete everything in the editor
3. Open `admin/firestore.rules` from this project
4. Copy the entire contents and paste into the Firebase Rules editor
5. Click **Publish**

These rules ensure:
- Website visitors can **submit forms** (create submissions) but cannot read or delete them
- Only logged-in admins can **read and update** submissions
- Only logged-in admins can **read and write** site settings/content

### 1.5 Create Firestore Indexes (optional but recommended)

1. In Firestore: click **Indexes → Composite → Add index**
2. Collection: `submissions`
3. Fields: `createdAt` Descending
4. Click **Create**

---

## Step 2 — EmailJS Setup

### 2.1 Create the Email Template

1. Log in at [emailjs.com](https://emailjs.com)
2. Go to **Email Templates → Create New Template**
3. Set Template ID to: `foolproofdoctor`
4. In the **Content** tab, click **\</\> Code editor**
5. Open `templates/emailjs-confirmation.html` from this project
6. Copy the **entire HTML** and paste it into the EmailJS code editor
7. Click **Save**

### 2.2 Template Variables Used

The template uses these variables (automatically sent by the form):

| Variable | Value |
|---|---|
| `{{to_name}}` | Client's full name |
| `{{to_email}}` | Client's email address |
| `{{service_name}}` | The service they selected |
| `{{first_name}}` | Client's first name |
| `{{reply_to}}` | Your reply-to email |

### 2.3 Verify your Service ID

1. In EmailJS: **Email Services**
2. Make sure your service ID is: `foolproofdoctor`
3. If it's different, update the `serviceId` value in `/js/forms.js`

---

## Step 3 — GitHub Setup

### 3.1 Create a GitHub repository

1. Go to [github.com](https://github.com) → **New repository**
2. Name it: `foolproofdoctor` (or any name you prefer)
3. Set it to **Private** (recommended — keeps your code secure)
4. Do NOT initialise with README
5. Click **Create repository**

### 3.2 Push your files

Open a terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial deploy — FoolProofDoctor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/foolproofdoctor.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 4 — Vercel Deployment

### 4.1 Import your project

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Connect your GitHub account if not already done
3. Find and select your `foolproofdoctor` repository
4. Click **Import**

### 4.2 Configure build settings

Vercel will auto-detect this as a static site. Confirm:
- **Framework Preset:** Other
- **Root Directory:** `./` (leave as default)
- **Build Command:** leave empty
- **Output Directory:** leave empty

Click **Deploy**.

### 4.3 Your site is live

Vercel will give you a URL like `foolproofdoctor.vercel.app`. Test everything works there before connecting your domain.

---

## Step 5 — Connect Your Domain

### 5.1 Add domain in Vercel

1. In your Vercel project: **Settings → Domains**
2. Type: `foolproofdoctor.com` → **Add**
3. Also add: `www.foolproofdoctor.com`

### 5.2 Update DNS records

In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

**For the root domain (`foolproofdoctor.com`):**
```
Type:  A
Name:  @
Value: 76.76.21.21
```

**For www:**
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
```

DNS changes can take up to 48 hours but usually happen within 1 hour.

### 5.3 Update Firebase Authorized Domains

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain**
3. Add: `foolproofdoctor.com`
4. Add: `www.foolproofdoctor.com`

This allows Firebase Auth (login) to work on your custom domain.

---

## Step 6 — Update Sitemap & Robots

Once your domain is live, the sitemap and robots.txt are already correct — they reference `foolproofdoctor.com`.

Submit your sitemap to Google:
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property: `https://foolproofdoctor.com`
3. Submit sitemap URL: `https://foolproofdoctor.com/sitemap.xml`

---

## Step 7 — How to Use the Admin Panel

### Accessing Admin
- URL: `foolproofdoctor.com/admin`
- Login with the Firebase account you created in Step 1.2
- Or click "Continue with Google" if your Google account is authorised

### Dashboard
- See total submissions, new leads, confirmed clients, and this week's activity
- Click any row to open the submission detail modal
- Status breakdown shows counts per status type

### Submissions
- Full table of all form submissions
- Filter by status (New, Pending, In Progress, Consultation Booked, Confirmed, Cancelled)
- Search by name or email
- Click any row to open the detail modal
- Update status and add internal admin notes in the modal

### Content Editor
- Edit every piece of text on the site: hero, about, testimonial, CTA, footer, SEO
- Changes save to Firestore and appear on the live site immediately on next page load
- Use the left nav to jump between sections

### Service Pages
- Edit each service individually: card title, description, video URL, page title, form text, SEO
- Paste a YouTube, Vimeo, or direct video URL — it auto-detects the type
- Changes save instantly to Firestore

### Branding & Logo
- Switch between text logo and image logo
- For image logo: paste any image URL (from Shopify, WordPress, Cloudinary, etc.)
- Adjust logo size with CSS width value (e.g. `160px`, `12rem`)
- Change accent gold color — updates the entire site's color scheme
- All changes save to Firestore

---

## File Structure Reference

```
foolproofdoctor/
├── index.html                    ← Public site (all pages)
├── favicon.svg                   ← Gold "F" favicon
├── og-image.svg                  ← Social share image
├── sitemap.xml                   ← SEO sitemap
├── robots.txt                    ← SEO + AI bot blocking
├── vercel.json                   ← Routing + security headers
├── 404.html                      ← Custom error page
│
├── js/
│   ├── firebase-config.js        ← Firebase init + all DB helpers
│   ├── content-defaults.js       ← All default site content
│   └── forms.js                  ← Formspree + EmailJS integration
│
├── css/
│   ├── main.css                  ← Public site styles
│   └── admin.css                 ← Admin panel styles
│
├── admin/
│   ├── index.html                ← Admin panel shell
│   ├── firestore.rules           ← Firestore security rules
│   └── js/
│       ├── admin-auth.js         ← Firebase Auth handlers
│       ├── admin-ui.js           ← Shared UI helpers
│       ├── admin-dashboard.js    ← Dashboard + submissions
│       ├── admin-content.js      ← Content editor
│       ├── admin-services.js     ← Service pages editor
│       └── admin-settings.js     ← Branding + logo editor
│
└── templates/
    └── emailjs-confirmation.html ← Paste into EmailJS template editor
```

---

## Troubleshooting

**Login not working on custom domain?**
→ Make sure `foolproofdoctor.com` is added to Firebase Authorized Domains (Step 5.3)

**Form submissions not saving to Firestore?**
→ Check Firestore Rules are published correctly (Step 1.4)
→ Check browser console for errors

**Emails not sending?**
→ Verify EmailJS Service ID and Template ID match `foolproofdoctor` exactly
→ Check EmailJS dashboard for failed sends

**Content changes not showing on site?**
→ The site loads content from Firestore on each page load — do a hard refresh (Ctrl+Shift+R)
→ If Firestore is unreachable, the site falls back to built-in defaults

**404 on service pages after deploying?**
→ Confirm `vercel.json` is in the root of your repository
→ Redeploy from Vercel dashboard

**Admin panel shows blank / won't load?**
→ Check browser console for module import errors
→ Confirm all JS files exist in the correct paths

---

## Security Notes

- The admin panel has `noindex, nofollow` headers so search engines will never index it
- Firebase Auth means no one can access the CMS without a valid Firebase account
- Firestore rules prevent any public read of submissions or admin content
- All security headers are set in `vercel.json` (XSS protection, frame deny, etc.)
- The private key in EmailJS (`DsgGm3w2jQKrarXa_my1G`) is server-side only — never exposed to the browser
