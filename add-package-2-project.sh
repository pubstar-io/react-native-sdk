#!/bin/bash

set -e

echo "=== Add the NPM package to ExampleApp ==="
cd ExampleApp
yarn add ../react-native-pubstar

echo "=== Install the new dependencies in iOS Example ==="
cd ios
RCT_NEW_ARCH_ENABLED=1 bundle exec pod install