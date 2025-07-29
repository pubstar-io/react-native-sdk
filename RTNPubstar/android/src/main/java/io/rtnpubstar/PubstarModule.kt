package io.rtnpubstar

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import io.pubstar.NativeRTNPubstarSpec
import io.pubstar.mobile.ads.interfaces.AdLoaderListener
import io.pubstar.mobile.ads.interfaces.AdShowedListener
import io.pubstar.mobile.ads.interfaces.InitAdListener
import io.pubstar.mobile.ads.interfaces.PubStarAdController
import io.pubstar.mobile.ads.model.ErrorCode
import io.pubstar.mobile.ads.model.RewardModel
import io.pubstar.mobile.ads.pub.PubStarAdManager

class PubstarModule(reactContext: ReactApplicationContext) : NativeRTNPubstarSpec(reactContext) {
    private val pubStarAdController: PubStarAdController by lazy {
        PubStarAdManager.getAdController()
    }

  override fun getName() = NAME

  override fun add(a: Double, b: Double, promise: Promise) {
    promise.resolve(a + b)
  }

  override fun init(promise: Promise) {
    PubStarAdManager.getInstance()
      .setInitAdListener(object : InitAdListener {
          override fun onDone() {
              Log.d("Pubstar", "Init success")
              promise.resolve(null)
          }

          override fun onError(code: ErrorCode) {
              Log.d("Pubstar", "Init error")
              promise.reject("INIT_FAILED", code.name)
          }
      })
      .init(reactApplicationContext)
  }


  override fun loadAndShow(adId: String, promise: Promise) {
      pubStarAdController.loadAndShow(
          reactApplicationContext,
          adId,
          null,
          object : AdLoaderListener {
              override fun onError(code: ErrorCode) {
                  Log.d("Pubstar", "Loaded error")
              }

              override fun onLoaded() {
                  Log.d("Pubstar", "Loaded success")
              }
          },
          object : AdShowedListener {
              override fun onAdHide(any: RewardModel?) {
                  Log.d("Pubstar", "Ad be hide")
              }

              override fun onAdShowed() {
                  Log.d("Pubstar", "Ad showed")
              }

              override fun onError(code: ErrorCode) {
                  Log.d("Pubstar", "Ad showe error")
              }
          }
      )
  }

  companion object {
    const val NAME = "RTNPubstar"
  }
}
