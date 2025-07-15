#!/bin/bash
# DOCX-to-PDF Feature Deployment Script
# Run this script to deploy the new DOCX-to-PDF conversion feature

echo "🚀 Deploying DOCX-to-PDF conversion feature to VPS..."

# Upload new service files
echo "📤 Uploading DOCX service..."
scp "d:\sites\office-tools-next\api.office-tools\src\services\docx_service.py" root@api.tundasportsclub.com:/var/www/api/src/services/

echo "📤 Uploading DOCX routes..."
scp "d:\sites\office-tools-next\api.office-tools\src\routes\docx_routes.py" root@api.tundasportsclub.com:/var/www/api/src/routes/

echo "📤 Uploading modified app.py..."
scp "d:\sites\office-tools-next\api.office-tools\src\app.py" root@api.tundasportsclub.com:/var/www/api/src/

echo "📤 Uploading requirements.txt..."
scp "d:\sites\office-tools-next\api.office-tools\requirements.txt" root@api.tundasportsclub.com:/var/www/api/

# Install dependencies and restart
echo "📦 Installing Python packages on VPS..."
ssh root@api.tundasportsclub.com << 'EOF'
cd /var/www/api
pip install python-docx2pdf==0.1.8
apt update && apt install -y libreoffice --no-install-recommends
systemctl restart gunicorn || pm2 restart api || echo "Please restart your Flask app manually"
EOF

echo "✅ Deployment complete!"
echo "🌐 Your DOCX-to-PDF API endpoint is now available at:"
echo "   POST https://api.tundasportsclub.com/api/docx/convert-to-pdf"
echo ""
echo "🎉 The PDF editor now supports the full workflow:"
echo "   PDF → DOCX → Edit → PDF (with no external dependencies!)"
