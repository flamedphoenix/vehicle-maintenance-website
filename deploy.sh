#!/bin/bash

# =========================
# React Frontend Deployment
# =========================

# Exit on any error
set -e

# 1. Go to frontend directory
FRONTEND_DIR="$(pwd)/myapp-frontend"


if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Frontend directory not found: $FRONTEND_DIR"
  exit 1
fi
cd "$FRONTEND_DIR"

# 2. Install dependencies (optional if already installed)
echo "Installing frontend dependencies..."
npm install

# 3. Build React frontend
echo "Building React app..."
npm run build

# 4. Copy build files to Nginx web root
NGINX_ROOT="/var/www/myapp"
echo "Deploying build to $NGINX_ROOT..."
sudo rm -rf "$NGINX_ROOT"/*
sudo cp -r build/* "$NGINX_ROOT/"

# 5. Fix permissions
echo "Setting correct permissions..."
sudo chown -R www-data:www-data "$NGINX_ROOT"

# 6. Restart backend
echo "Restarting FastAPI backend..."
sudo systemctl restart myapp-backend
sudo journalctl -u myapp-backend -f -o short-iso

# 7. Reload Nginx to apply changes
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"
