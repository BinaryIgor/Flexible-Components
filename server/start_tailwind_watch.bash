#!/bin/bash
set -e

echo "Watching changes and generating css..."
npx tailwindcss -i ./style.css -o ./dist/style.css --watch