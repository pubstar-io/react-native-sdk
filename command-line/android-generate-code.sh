#!/bin/bash

set -e

echo "=== Add the NPM package to ExampleApp ==="
cd ../ExampleApp
yarn add ../RTNPubstar

echo "=== Generating codegen artifacts for Android ==="
cd ../ExampleApp/android
./gradlew generateCodegenArtifactsFromSchema

echo "=== DONE: Generated code for Android ==="