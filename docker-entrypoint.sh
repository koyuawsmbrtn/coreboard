#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Coreboard application..."

echo "📊 Running database migrations..."
bunx prisma migrate deploy

echo "✅ Database migrations completed!"

echo "🌐 Starting application server..."
exec "$@"