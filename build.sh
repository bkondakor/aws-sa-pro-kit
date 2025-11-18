#!/bin/bash
# Build script to convert Obsidian markdown files to HTML for GitHub Pages

set -e  # Exit on error

echo "🔨 Building AWS SA Pro Kit website..."
echo ""

# Check for Python dependencies
echo "📦 Installing dependencies..."
pip install -q pyyaml markdown 2>/dev/null || pip install pyyaml markdown

# Convert markdown files to HTML
echo "📝 Converting markdown files to HTML..."
python3 convert-markdown.py

# Build navigation pages
echo "🗺️  Building navigation pages..."
python3 build-navigation.py

echo ""
echo "✅ Build complete!"
echo ""
echo "📂 Generated files in:"
echo "   - study/          (Main study materials)"
echo "   - study/domain-*/ (Domain-specific content)"
echo ""
echo "To test locally, run: python3 -m http.server 8000"
echo "Then visit: http://localhost:8000"
