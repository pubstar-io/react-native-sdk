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
        when (this.size) {
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
        when (this.size) {
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

class PubstarAdHelper {
    private val viewPropsMap = mutableMapOf<View, AdProps>()

    fun props(view: View): AdProps {
        return viewPropsMap.getOrPut(view) { AdProps() }
    }

    private val pubStarAdController: PubStarAdController by lazy {
        PubStarAdManager.getAdController()
    }

    fun onlyLoadAndShowAdWhenAllPropsSet(view: FrameLayout) {
        val props = viewPropsMap[view] ?: return

        if (
            !props.adId.isNullOrEmpty() &&
            !props.size.isNullOrEmpty() &&
            !props.type.isNullOrEmpty() &&
            !props.isRendered
        ) {
            props.isRendered = true
            loadAndShowWhenReady(
                view.context,
                view,
                props
            )
        }
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

        when (data.type) {
            "banner" -> {
                loadAndShowBanner(
                    context = context,
                    view = view,
                    adId = data.adId!!,
                    size = data.getBannerSize(),
                    adLoaderListener = adNetLoaderListener,
                    adShowListener = adNetShowListener
                )
            }

            "native" -> {
                loadAndShowNative(
                    context = context,
                    view = view,
                    adId = data.adId!!,
                    size = data.getNativeSize(),
                    adLoaderListener = adNetLoaderListener,
                    adShowListener = adNetShowListener
                )
            }
        }
    }

    private fun loadAndShowBanner(
        context: Context,
        view: ViewGroup,
        adId: String,
        size: BannerAdRequest.AdTag,
        adLoaderListener: AdLoaderListener,
        adShowListener: AdShowedListener
    ) {
        val requestBanner = BannerAdRequest.Builder(context)
            .withView(view)
            .adLoaderListener(adLoaderListener)
            .tag(size)
            .adShowedListener(adShowListener)
            .build()

        pubStarAdController.loadAndShow(adId, requestBanner)
    }

    private fun loadAndShowNative(
        context: Context,
        view: ViewGroup,
        adId: String,
        size: NativeAdRequest.Type,
        adLoaderListener: AdLoaderListener,
        adShowListener: AdShowedListener
    ) {
        val requestNative = NativeAdRequest.Builder(context)
            .sizeType(size)
            .withView(view)
            .adLoaderListener(adLoaderListener)
            .adShowedListener(adShowListener)
            .build()

        pubStarAdController.loadAndShow(adId, requestNative)
    }

}

@ReactModule(name = PubstarAdViewManager.NAME)
class PubstarAdViewManager() :
    SimpleViewManager<FrameLayout>(),
    PubstarAdViewManagerInterface<FrameLayout> {
    private val helper = PubstarAdHelper()

    companion object {
        const val NAME = "PubstarAdView"
    }

    private val delegate: PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        PubstarAdViewManagerDelegate(this)

    override fun getDelegate(): PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        delegate

    override fun getName(): String = NAME

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        return FrameLayout(reactContext)
    }

    @ReactProp(name = "size")
    override fun setSize(view: FrameLayout?, value: String?) {
        if (view == null || value.isNullOrEmpty()) {
            return
        }

        helper.props(view).size = value
        view.post {
            helper.onlyLoadAndShowAdWhenAllPropsSet(view)
        }

        Log.d("PubstarAdViewManager", "set Size: $value")
    }

    @ReactProp(name = "adId")
    override fun setAdId(view: FrameLayout, value: String?) {
        if (value.isNullOrEmpty()) {
            return
        }


        helper.props(view).adId = value
        view.post {
            helper.onlyLoadAndShowAdWhenAllPropsSet(view)
        }

        Log.d("PubstarAdViewManager", "set adId: $value")
    }

    @ReactProp(name = "type")
    override fun setType(view: FrameLayout, value: String?) {
        if (value.isNullOrEmpty()) {
            return
        }


        helper.props(view).type = value
        view.post {
            helper.onlyLoadAndShowAdWhenAllPropsSet(view)
        }

        Log.d("PubstarAdViewManager", "set Type: $value")
    }
}