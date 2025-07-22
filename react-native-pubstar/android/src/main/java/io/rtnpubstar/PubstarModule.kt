package io.rtnpubstar

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import io.rtnpubstar.NativeRTNPubstarSpec

class PubstarModule(reactContext: ReactApplicationContext) : NativeRTNPubstarSpec(reactContext) {

  override fun getName() = NAME

  override fun add(a: Double, b: Double, promise: Promise) {
    promise.resolve(a + b)
  }

  companion object {
    const val NAME = "RTNPubstar"
  }
}