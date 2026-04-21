package io.rtnpubstar

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.widget.FrameLayout
import android.view.ViewGroup
import com.facebook.react.bridge.ReadableMap
import io.pubstar.mobile.core.base.BannerAdRequest
import io.pubstar.mobile.core.base.NativeAdRequest
import io.pubstar.mobile.core.interfaces.AdLoaderListener
import io.pubstar.mobile.core.interfaces.AdShowedListener
import io.pubstar.mobile.core.interfaces.PubStarAdController
import io.pubstar.mobile.core.models.ErrorCode
import io.pubstar.mobile.core.models.RewardModel
import io.pubstar.mobile.core.api.PubStarAdManager
import io.pubstar.mobile.core.base.NativeAdViewBinder
import kotlin.String

data class NativeCustomConfig(
    val layoutName: String,
    val advertiserTextViewId: String? = null,
    val iconImageViewId: String? = null,
    val titleTextViewId: String? = null,
    val mediaContentViewGroupId: String? = null,
    val bodyTextViewId: String? = null,
    val callToActionButtonId: String? = null,
    val loadingViewId: String? = null,
    val ctaColorHex: String? = null,
) {
    companion object {
        fun fromMap(raw: Map<*, *>?): NativeCustomConfig? {
            if (raw == null) return null
            val layoutName = raw["layoutName"] as? String ?: return null
            if (layoutName.trim().isEmpty()) return null

            return NativeCustomConfig(
                layoutName = layoutName,
                advertiserTextViewId = raw["advertiserTextViewId"] as? String,
                iconImageViewId = raw["iconImageViewId"] as? String,
                titleTextViewId = raw["titleTextViewId"] as? String,
                mediaContentViewGroupId = raw["mediaContentViewGroupId"] as? String,
                bodyTextViewId = raw["bodyTextViewId"] as? String,
                callToActionButtonId = raw["callToActionButtonId"] as? String,
                loadingViewId = raw["loadingViewName"] as? String,
                ctaColorHex = raw["ctaColorHex"] as? String,
            )
        }
    }
}

class PubstarAdHandler {
    private val viewPropsMap = mutableMapOf<View, AdProps>()

    fun props(view: View): AdProps {
        return viewPropsMap.getOrPut(view) { AdProps() }
    }

    private val pubStarAdController: PubStarAdController by lazy {
        PubStarAdManager.getAdController()
    }

    fun onlyLoadAndShowAdWhenAllPropsSet(
        view: FrameLayout,
        onLoaded: () -> Unit,
        onLoadedError: (ErrorCode) -> Unit,
        onShowed: () -> Unit,
        onHide: (RewardModel?) -> Unit,
        onShowedError: (ErrorCode) -> Unit
    ) {
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
                props,
                onLoaded = {
                    onLoaded()
                },
                onLoadedError = { errorCode ->
                    onLoadedError(errorCode)
                },
                onShowed = {
                    onShowed()
                },
                onHide = { reward ->
                    onHide(reward)
                },
                onShowedError = { errorCode ->
                    onShowedError(errorCode)
                }
            )
        }
    }

    private fun loadAndShowWhenReady(
        context: Context,
        view: ViewGroup,
        data: AdProps,
        onLoaded: () -> Unit,
        onLoadedError: (ErrorCode) -> Unit,
        onShowed: () -> Unit,
        onHide: (RewardModel?) -> Unit,
        onShowedError: (ErrorCode) -> Unit
    ) {
        val adNetShowListener = object : AdShowedListener {
            override fun onAdShowed() {
                onShowed()
            }

            override fun onAdHide(any: RewardModel?) {
                onHide(any)
            }

            override fun onError(code: ErrorCode) {
                onShowedError(code)
            }
        }

        val adNetLoaderListener = object : AdLoaderListener {
            override fun onLoaded() {
                onLoaded()
            }

            override fun onError(code: ErrorCode) {
                onLoadedError(code)
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
                    adShowListener = adNetShowListener,
                    customConfig = data.customConfig
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
        adShowListener: AdShowedListener,
        customConfig: ReadableMap?
    ) {
        val config = NativeCustomConfig.fromMap(customConfig?.toHashMap())
        val binder = buildNativeAdViewBinder(context, config)

        val requestNative = NativeAdRequest.Builder(context)
//            .sizeType(size)
            .sizeType(NativeAdRequest.Type.Custom)
            .withView(view)
            .withNativeAdViewBinderCustom(binder)
            .adLoaderListener(adLoaderListener)
            .adShowedListener(adShowListener)
            .build()

        pubStarAdController.loadAndShow(adId, requestNative)
    }

    private fun buildNativeAdViewBinder(
        context: Context,
        config: NativeCustomConfig?
    ): NativeAdViewBinder? {
        if (config == null) return null
        val inflater = LayoutInflater.from(context)
        val layoutId = resolveResId(context, config.layoutName, "layout")
        if (layoutId == 0) return null

        val loadingView = resolveOptionalView(context, inflater, config.loadingViewId)
        val builder = NativeAdViewBinder.Builder(layoutId)

        resolveResId(context, config.advertiserTextViewId, "id").takeIf { it != 0 }?.let {
            builder.setAdvertiserTextViewId(it)
        }
        resolveResId(context, config.iconImageViewId, "id").takeIf { it != 0 }?.let {
            builder.setIconImageViewId(it)
        }
        resolveResId(context, config.titleTextViewId, "id").takeIf { it != 0 }?.let {
            builder.setTitleTextViewId(it)
        }
        resolveResId(context, config.mediaContentViewGroupId, "id").takeIf { it != 0 }?.let {
            builder.setMediaContentViewGroupId(it)
        }
        resolveResId(context, config.bodyTextViewId, "id").takeIf { it != 0 }?.let {
            builder.setBodyTextViewId(it)
        }
        resolveResId(context, config.callToActionButtonId, "id").takeIf { it != 0 }?.let {
            builder.setCallToActionButtonId(it)
        }
        if (loadingView != null) {
            builder.setLoadingView(loadingView)
        }

        return builder.build()
    }

    private fun resolveOptionalView(
        context: Context,
        inflater: LayoutInflater,
        viewName: String?
    ): View? {
        if (viewName.isNullOrBlank()) return null
        val id = resolveResId(context, viewName, "layout")
        if (id == 0) return null
        val rootView = inflater.inflate(id, null, false)
        return rootView
    }

    private fun resolveResId(context: Context, name: String?, type: String): Int {
        if (name.isNullOrBlank()) return 0
        return context.resources.getIdentifier(name, type, context.packageName)
    }
}
