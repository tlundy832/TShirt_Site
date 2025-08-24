#!/bin/bash

echo "🚀 AI Tee Studio Setup Script"
echo "=============================="

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Backup created as .env.local.backup"
    cp .env.local .env.local.backup
fi

# Copy example file
echo "📝 Creating .env.local from example..."
cp .env.local.example .env.local

# Generate NextAuth secret
echo "🔐 Generating NextAuth secret..."
if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 32)
    # Replace the secret in .env.local
    sed -i.bak "s/generate-a-secure-secret-here/$SECRET/" .env.local
    rm .env.local.bak
    echo "✅ NextAuth secret generated and added to .env.local"
else
    echo "⚠️  OpenSSL not found. Please manually generate a secret using:"
    echo "   openssl rand -base64 32"
    echo "   And add it to .env.local as NEXTAUTH_SECRET"
fi

echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local and add your Google OAuth credentials"
echo "2. Set up Google OAuth in Google Cloud Console:"
echo "   - Go to https://console.cloud.google.com/"
echo "   - Create OAuth 2.0 credentials"
echo "   - Add redirect URI: http://localhost:3000/api/auth/callback/google"
echo "3. Run 'npm install' to install dependencies"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "📖 For detailed instructions, see README.md"
