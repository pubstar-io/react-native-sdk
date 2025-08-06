#!/bin/bash

set -e

echo "=== Clear Generated Code of iOS before ==="
rm -rf ../RTNPubstar/generated/

echo "=== Generating codegen artifacts for iOS ==="
cd ../ExampleApp
yarn add ../RTNPubstar
cd ..
node ExampleApp/node_modules/react-native/scripts/generate-codegen-artifacts.js \
  --targetPlatform ios \
  --path ExampleApp/ \
  --outputPath RTNPubstar/generated/

echo "=== DONE: Generated code for iOS ==="