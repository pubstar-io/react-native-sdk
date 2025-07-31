package io.rtnpubstar

import android.content.Context
import android.util.Log
import android.view.View
import android.widget.FrameLayout
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.PubstarAdViewManagerDelegate
import com.facebook.react.viewmanagers.PubstarAdViewManagerInterface
import android.view.ViewGroup
import io.pubstar.mobile.ads.base.BannerAdRequest
import io.pubstar.mobile.ads.base.NativeAdRequest
import io.pubstar.mobile.ads.interfaces.AdLoaderListener
import io.pubstar.mobile.ads.interfaces.AdShowedListener
import io.pubstar.mobile.ads.interfaces.PubStarAdController
import io.pubstar.mobile.ads.model.ErrorCode
import io.pubstar.mobile.ads.model.RewardModel
import io.pubstar.mobile.ads.pub.PubStarAdManager

data class AdProps(
    var adId: String? = null,
    var size: String? = null,
    var type: String? = null,
    var isRendered: Boolean = false
) {
    fun getBannerSize(): BannerAdRequest.AdTag {
        when(this.size) {
            "small" -> {
                return BannerAdRequest.AdTag.Small
            }
            "medium" -> {
                return BannerAdRequest.AdTag.Medium
            }
            "large" -> {
                return BannerAdRequest.AdTag.Big
            }
        }

        return BannerAdRequest.AdTag.Small
    }

    fun getNativeSize(): NativeAdRequest.Type {
        when(this.size) {
            "small" -> {
                return NativeAdRequest.Type.Small
            }
            "medium" -> {
                return NativeAdRequest.Type.Medium
            }
            "large" -> {
                return NativeAdRequest.Type.Big
            }
        }

        return NativeAdRequest.Type.Small
    }

    fun reset() {
        adId = null
        size = null
        type = null
        isRendered = false
    }
}

@ReactModule(name = PubstarAdViewManager.NAME)
class PubstarAdViewManager() :
    SimpleViewManager<FrameLayout>(),
    PubstarAdViewManagerInterface<FrameLayout> {

    private val viewPropsMap = mutableMapOf<View, AdProps>()

    private fun props(view: View): AdProps {
        return viewPropsMap.getOrPut(view) { AdProps() }
    }

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

    private fun onlyLoadAndShowAdWhenAllPropsSet(view: FrameLayout) {
        val props = viewPropsMap[view] ?: return

        if (!props.adId.isNullOrEmpty() && !props.size.isNullOrEmpty() && !props.type.isNullOrEmpty() && !props.isRendered) {
            props.isRendered = true

            loadAndShowWhenReady(
                view.context,
                view,
                props
            )
        }
    }

    @ReactProp(name = "size")
    override fun setSize(view: FrameLayout?, value: String?) {
        if (view == null || value.isNullOrEmpty()) {
            return
        }

        props(view).size = value

        view.post {
            onlyLoadAndShowAdWhenAllPropsSet(view)
        }

        Log.d("PubstarAdViewManager", "set Size: $value")
    }

    @ReactProp(name = "adId")
    override fun setAdId(view: FrameLayout, value: String?) {
        if (value.isNullOrEmpty()) {
            return
        }

        props(view).adId = value

        Log.d("PubstarAdViewManager", "set adId: $value")


        view.post {
            onlyLoadAndShowAdWhenAllPropsSet(view)
        }
    }

    @ReactProp(name = "type")
    override fun setType(view: FrameLayout, value: String?) {
        if (value.isNullOrEmpty()) {
            return
        }

        props(view).type = value

        view.post {
            onlyLoadAndShowAdWhenAllPropsSet(view)
        }

        Log.d("PubstarAdViewManager", "set Type: $value")
    }

    private fun loadAndShowWhenReady(
        context: Context,
        view: ViewGroup,
        data: AdProps
    ) {
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

        if (data.type == "banner") {
            val requestBanner = BannerAdRequest.Builder(context)
                .withView(view)
                .adLoaderListener(adNetLoaderListener)
                .tag(data.getBannerSize())
                .adShowedListener(adNetShowListener)
                .build()

            pubStarAdController.loadAndShow(data.adId, requestBanner)
        } else if (data.type == "native") {
            val requestNative = NativeAdRequest.Builder(context)
                .sizeType(data.getNativeSize())
                .withView(view)
                .adLoaderListener(adNetLoaderListener)
                .adShowedListener(adNetShowListener)
                .build()

            pubStarAdController.loadAndShow(data.adId, requestNative)
        }
    }
}