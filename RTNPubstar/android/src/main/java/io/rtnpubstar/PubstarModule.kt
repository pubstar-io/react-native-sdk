package io.rtnpubstar

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import io.pubstar.NativeRTNPubstarSpec
import io.pubstar.mobile.ads.interfaces.InitAdListener
import io.pubstar.mobile.ads.model.ErrorCode
import io.pubstar.mobile.ads.pub.PubStarAdManager

class PubstarModule(reactContext: ReactApplicationContext) : NativeRTNPubstarSpec(reactContext) {

  override fun getName() = NAME

  override fun add(a: Double, b: Double, promise: Promise) {
    promise.resolve(a + b)
  }

  override fun init(promise: Promise) {
    Log.d("PubStar", "SDK running init!")

    PubStarAdManager.getInstance()
      .setInitAdListener(object : InitAdListener {
          override fun onDone() {
              Log.d("PubStar", "SDK initialized successfully!")
              promise.resolve(null)
          }

          override fun onError(code: ErrorCode) {
              Log.d("PubStar", "SDK initialization error: $code")
              promise.reject("INIT_FAILED", code.name)
          }
      })
      .init(reactApplicationContext)
  }

  companion object {
    const val NAME = "RTNPubstar"
  }
}
