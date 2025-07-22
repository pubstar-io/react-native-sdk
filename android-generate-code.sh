#!/bin/bash

set -e

echo "=== Generating codegen artifacts for Android ==="
cd ExampleApp/android
./gradlew generateCodegenArtifactsFromSchema