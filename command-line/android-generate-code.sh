#!/bin/bash

set -e

echo "=== Generating codegen artifacts for Android ==="
cd ../ExampleApp/android
./gradlew generateCodegenArtifactsFromSchema

echo "=== DONE: Generated code for Android ==="