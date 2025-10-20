#!/bin/bash

# Ajouter le PATH pour npm et node
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "Running Pulse dev"
cd Pulse || exit 1
npm run tauri dev
