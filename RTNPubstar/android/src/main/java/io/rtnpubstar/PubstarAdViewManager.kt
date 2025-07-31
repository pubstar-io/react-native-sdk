package io.rtnpubstar

import android.content.Context
import android.util.Log
import android.widget.FrameLayout
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.PubstarAdViewManagerDelegate
import com.facebook.react.viewmanagers.PubstarAdViewManagerInterface
import android.view.ViewGroup
import io.pubstar.mobile.ads.base.BannerAdRequest
import io.pubstar.mobile.ads.interfaces.AdLoaderListener
import io.pubstar.mobile.ads.interfaces.AdShowedListener
import io.pubstar.mobile.ads.interfaces.PubStarAdController
import io.pubstar.mobile.ads.model.ErrorCode
import io.pubstar.mobile.ads.model.RewardModel
import io.pubstar.mobile.ads.pub.PubStarAdManager

@ReactModule(name = PubstarAdViewManager.NAME)
class PubstarAdViewManager() :
    SimpleViewManager<FrameLayout>(),
    PubstarAdViewManagerInterface<FrameLayout> {

    companion object {
        const val NAME = "PubstarAdView"
    }

    private val pubStarAdController: PubStarAdController by lazy {
        PubStarAdManager.getAdController()
    }

    private val delegate: PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        PubstarAdViewManagerDelegate(this)

    override fun getDelegate(): PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        delegate

    override fun getName(): String = NAME

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        return FrameLayout(reactContext)
    }

    @ReactProp(name = "adId")
    override fun setAdId(view: FrameLayout, value: String?) {
        if(value.isNullOrEmpty()) {
            return
        }

        view.post {
            loadAndShowWhenReady(value, view.context, view)
        }
    }

    private fun loadAndShowWhenReady(adId: String, context: Context, view: ViewGroup) {
        val adNetShowListener = object : AdShowedListener {
            override fun onAdShowed() {
                Log.d("PubstarAdViewManager", "ad showed")
            }

            override fun onAdHide(any: RewardModel?) {
                Log.d("PubstarAdViewManager", "ad hidden")
            }

            override fun onError(code: ErrorCode) {
                Log.e("PubstarAdViewManager", "ad load error: ${code.name}")
            }

        }

        val adNetLoaderListener = object : AdLoaderListener {
            override fun onLoaded() {
                Log.d("PubstarAdViewManager", "ad loaded")
            }

            override fun onError(code: ErrorCode) {
                Log.e("PubstarAdViewManager", "ad load error: ${code.name}")
            }
        }

        val requestBanner = BannerAdRequest.Builder(context)
            .withView(view)
            .adLoaderListener(adNetLoaderListener)
            .tag(BannerAdRequest.AdTag.Medium)
            .adShowedListener(adNetShowListener)
            .build()

        pubStarAdController.loadAndShow(adId, requestBanner)
    }
}