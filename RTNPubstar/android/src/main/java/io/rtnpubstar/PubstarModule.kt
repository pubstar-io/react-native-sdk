package io.rtnpubstar

import com.facebook.react.bridge.Callback
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

  override fun initialization(promise: Promise) {
    PubStarAdManager.getInstance()
      .setInitAdListener(object : InitAdListener {
          override fun onDone() {
              promise.resolve(null)
          }

          override fun onError(code: ErrorCode) {
              promise.reject("INIT_FAILED", code.name)
          }
      })
      .init(reactApplicationContext)
  }

    override fun loadAd(adId: String?, onError: Callback?, onLoaded: Callback?) {
        pubStarAdController.load(
            reactApplicationContext,
            adId,
            object: AdLoaderListener {
                override fun onError(code: ErrorCode) {
                    if (onError != null) {
                        onError(code)
                    }
                }

                override fun onLoaded() {
                    if (onLoaded != null) {
                        onLoaded()
                    }
                }

            }
        )
    }

    override fun showAd(adId: String?, onHide: Callback?, onShowed: Callback?, onError: Callback?) {
        pubStarAdController.show(
            reactApplicationContext,
            adId,
            null,
            object: AdShowedListener {
                override fun onAdHide(any: RewardModel?) {
                    if (onHide != null) {
                        onHide(any)
                    }
                }

                override fun onAdShowed() {
                    if (onShowed != null) {
                        onShowed()
                    }
                }

                override fun onError(code: ErrorCode) {
                    if (onError != null) {
                        onError()
                    }
                }
            }
        )
    }

    override fun loadAndShow(
      adId: String,
      onLoadError: Callback,
      onLoaded: Callback,
      onAdHide: Callback,
      onAdShowed: Callback,
      onShowError: Callback
  ) {
      pubStarAdController.loadAndShow(
          reactApplicationContext,
          adId,
          null,
          object : AdLoaderListener {
              override fun onError(code: ErrorCode) {
                  onLoadError.invoke(code.name)
              }

              override fun onLoaded() {
                  onLoaded.invoke("onLoaded")
              }
          },
          object : AdShowedListener {
              override fun onAdHide(any: RewardModel?) {
                  val rewardMap = rewardToMap(any)
                  onAdHide.invoke(rewardMap)
              }

              override fun onAdShowed() {
                  onAdShowed.invoke()
              }

              override fun onError(code: ErrorCode) {
                  onShowError.invoke(code.name)
              }
          }
      )
  }

  companion object {
    const val NAME = "RTNPubstar"
  }
}