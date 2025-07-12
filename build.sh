#!/bin/bash
# Build script for Tailwind CSS and Jekyll

echo "Building Tailwind CSS..."
npx tailwindcss -i ./assets/input.css -o ./assets/tailwind.css --minify

echo "Building Jekyll site..."
bundle exec jekyll build

echo "Build complete!"
