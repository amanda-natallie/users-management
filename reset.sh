#!/bin/bash

echo "🧹 Cleaning up build and dependency folders..."

# Find and remove coverage folders
echo "Finding coverage folders..."
find . -type d -name "coverage" -exec rm -rf {} +

# Find and remove dist folders
echo "Finding dist folders..."
find . -type d -name "dist" -exec rm -rf {} +

# Find and remove node_modules folders
echo "Finding node_modules folders..."
find . -type d -name "node_modules" -exec rm -rf {} +


echo "✨ Clean up complete!" 