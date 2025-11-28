package io.rtnpubstar

import android.content.Context
import android.view.View
import android.widget.FrameLayout
import android.view.ViewGroup
import io.pubstar.mobile.core.base.BannerAdRequest
import io.pubstar.mobile.core.base.NativeAdRequest
import io.pubstar.mobile.core.interfaces.AdLoaderListener
import io.pubstar.mobile.core.interfaces.AdShowedListener
import io.pubstar.mobile.core.interfaces.PubStarAdController
import io.pubstar.mobile.core.models.ErrorCode
import io.pubstar.mobile.core.models.RewardModel
import io.pubstar.mobile.core.api.PubStarAdManager

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
