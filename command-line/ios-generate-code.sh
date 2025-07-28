#!/bin/bash

set -e

echo "=== Clear Generated Code of iOS before ==="
rm -rf ../react-native-pubstar/generated/

echo "=== Generating codegen artifacts for iOS ==="
cd ../ExampleApp
yarn add ../react-native-pubstar
cd ..
node ExampleApp/node_modules/react-native/scripts/generate-codegen-artifacts.js \
  --targetPlatform ios \
  --path ExampleApp/ \
  --outputPath react-native-pubstar/generated/

echo "=== DONE: Generated code for iOS ==="