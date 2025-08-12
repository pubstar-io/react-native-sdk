package io.rtnpubstar

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import io.pubstar.NativeRTNPubstarSpec
import io.pubstar.mobile.ads.interfaces.AdLoaderListener
import io.pubstar.mobile.ads.interfaces.AdShowedListener
import io.pubstar.mobile.ads.interfaces.InitAdListener
import io.pubstar.mobile.ads.interfaces.PubStarAdController
import io.pubstar.mobile.ads.model.ErrorCode
import io.pubstar.mobile.ads.model.RewardModel
import io.pubstar.mobile.ads.pub.PubStarAdManager

fun rewardModelToWritableMap(reward: RewardModel?): WritableMap {
    val map = Arguments.createMap()
    if (reward != null) {
        map.putString("type", reward.type)
        map.putInt("amount", reward.amount)
    } else {
        map.putString("type", "")
        map.putInt("amount", 0)
    }
    return map
}

class PubstarModule(reactContext: ReactApplicationContext) : NativeRTNPubstarSpec(reactContext) {
    private val pubStarAdController: PubStarAdController by lazy {
        PubStarAdManager.getAdController()
    }

  override fun getName() = NAME

  override fun initialization(promise: Promise) {
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

    override fun loadAd(adId: String?, onError: Callback?, onLoaded: Callback?) {
        pubStarAdController.load(
            reactApplicationContext,
            adId,
            object: AdLoaderListener {
                override fun onError(code: ErrorCode) {
                    onError(code)
                }

                override fun onLoaded() {
                    onLoaded()
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
                    onAdHide(any)
                }

                override fun onAdShowed() {
                    onAdShowed()
                }

                override fun onError(code: ErrorCode) {
                    onError(code)
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
                  val rewardMap = rewardModelToWritableMap(any)
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
