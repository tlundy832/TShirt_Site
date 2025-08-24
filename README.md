# AI Tee Studio

Turn any photo into a custom AI-generated t-shirt using artificial intelligence.

## Features

- 🎨 AI-powered image transformation with multiple styles
- 🔐 Google OAuth authentication
- 📷 Drag & drop photo upload
- 👕 Direct Printify integration for ordering
- 🎯 Modern, responsive UI with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- Google Cloud Console account
- Printify account (for t-shirt creation)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd TShirt_Site
npm install
```

### 2. Environment Variables Setup

Copy the example environment file and configure it:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your own values:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth.js:

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` in `.env.local`.

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add these URLs:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

### 5. Printify Setup (Optional)

If you want to enable t-shirt creation:

1. Create a [Printify](https://printify.com/) account
2. Get your API key from Printify dashboard
3. Add it to your `.env.local`:
   ```bash
   PRINTIFY_API_KEY=your-printify-api-key
   ```

### 6. OpenAI Setup (Optional)

For AI image generation:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env.local`:
   ```bash
   OPENAI_API_KEY=your-openai-api-key
   ```

## Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

### Environment Variables for Production

When deploying to production, you can use the same API keys, but **must update these settings**:

1. **Update NEXTAUTH_URL** to your production domain:
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. **Update Google OAuth settings** in Google Cloud Console:
   - Add your production domain to **Authorized JavaScript origins**: `https://yourdomain.com`
   - Add your production callback URL to **Authorized redirect URIs**: `https://yourdomain.com/api/auth/callback/google`
   - Keep your existing localhost URLs for development

3. **Security Best Practices**:
   - 🔐 Generate a new `NEXTAUTH_SECRET` for production (different from development)
   - 🌐 Consider using separate Google OAuth apps for dev/prod environments
   - 🔒 Use your hosting platform's secure environment variable storage

### Platform-Specific Setup

#### **Vercel** (Recommended)
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all your `.env.local` variables
   - Set `NEXTAUTH_URL=https://your-vercel-app.vercel.app`

#### **Netlify**
1. Connect your repo to Netlify
2. Go to Site Settings > Environment Variables
3. Add all your environment variables
4. Set `NEXTAUTH_URL=https://your-netlify-app.netlify.app`

#### **Railway/Digital Ocean**
1. Use their environment variable configuration
2. Ensure all secrets are properly set
3. Update `NEXTAUTH_URL` to your deployed domain

### Domain Configuration Checklist

✅ **Before deploying:**
- [ ] Update `NEXTAUTH_URL` in environment variables
- [ ] Add production domain to Google OAuth settings
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Test authentication flow on staging environment
- [ ] Verify all API endpoints work with production URLs

### Recommended Deployment Platforms

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Digital Ocean**

## Project Structure

```
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].ts     # NextAuth configuration
│   │   ├── create-shirt.ts          # AI image generation
│   │   └── create-printify.ts       # Printify integration
│   ├── auth/
│   │   └── signin.tsx               # Custom sign-in page
│   ├── _app.tsx                     # App wrapper with SessionProvider
│   └── index.tsx                    # Main application
├── styles/
│   └── globals.css                  # Global styles with Tailwind
├── lib/
│   └── printify.ts                  # Printify API utilities
└── types/
    └── next-auth.d.ts               # NextAuth type definitions
```

## Security Notes

- ⚠️ Never commit your `.env.local` file
- 🔐 Always use different secrets for development and production
- 🌐 Only add trusted domains to your Google OAuth settings
- 🔒 Keep your API keys secure and rotate them regularly

## Troubleshooting

### "OAuth client was not found" Error
- Check your Google Client ID and Secret are correct
- Verify the redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- Make sure the Google+ API is enabled

### "Invalid NEXTAUTH_SECRET" Error
- Generate a new secret using `openssl rand -base64 32`
- Make sure there are no extra spaces in your `.env.local`

### Authentication Not Working
- Clear your browser cookies and cache
- Check that all environment variables are set
- Restart the development server after changing `.env.local`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
