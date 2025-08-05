package io.rtnpubstar

import android.view.View
import android.widget.FrameLayout
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.PubstarAdViewManagerDelegate
import com.facebook.react.viewmanagers.PubstarAdViewManagerInterface
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper

@ReactModule(name = PubstarAdViewManager.NAME)
class PubstarAdViewManager() :
    SimpleViewManager<FrameLayout>(),
    PubstarAdViewManagerInterface<FrameLayout> {
    private val pubstarHandle = PubstarAdHandler()

    companion object {
        const val NAME = "PubstarAdView"
    }

    private val delegate: PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        PubstarAdViewManagerDelegate(this)

    override fun getDelegate(): PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        delegate

    override fun getName(): String = NAME

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        val view = FrameLayout(reactContext)

        return view
    }

    private fun sendOnLoadedEvent(view: View) {
        val reactContext = (view.context as? ReactContext) ?: return
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(
            reactContext,
            view.id
        )
        val surfaceId = UIManagerHelper.getSurfaceId(view)

        eventDispatcher?.dispatchEvent(
            AdEvent(
                name = "onLoaded",
                surfaceId = surfaceId,
                viewTag = view.id
            )
        )
    }

    private fun setOnLoadedError(view: View) {
        val reactContext = (view.context as? ReactContext) ?: return
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(
            reactContext,
            view.id
        )
        val surfaceId = UIManagerHelper.getSurfaceId(view)

        eventDispatcher?.dispatchEvent(
            AdEvent(
                name = "onLoadedError",
                surfaceId = surfaceId,
                viewTag = view.id
            )
        )
    }

    private fun setOnHide(view: View) {
        val reactContext = (view.context as? ReactContext) ?: return
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(
            reactContext,
            view.id
        )
        val surfaceId = UIManagerHelper.getSurfaceId(view)

        eventDispatcher?.dispatchEvent(
            AdEvent(
                name = "onHide",
                surfaceId = surfaceId,
                viewTag = view.id
            )
        )
    }

    private fun setOnShowed(view: View) {
        val reactContext = (view.context as? ReactContext) ?: return
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(
            reactContext,
            view.id
        )
        val surfaceId = UIManagerHelper.getSurfaceId(view)

        eventDispatcher?.dispatchEvent(
            AdEvent(
                name = "onShowed",
                surfaceId = surfaceId,
                viewTag = view.id
            )
        )
    }

    private fun setOnShowedError(view: View) {
        val reactContext = (view.context as? ReactContext) ?: return
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(
            reactContext,
            view.id
        )
        val surfaceId = UIManagerHelper.getSurfaceId(view)

        eventDispatcher?.dispatchEvent(
            AdEvent(
                name = "onShowedError",
                surfaceId = surfaceId,
                viewTag = view.id
            )
        )
    }

    @ReactProp(name = "size")
    override fun setSize(view: FrameLayout?, value: String?) {
        if (view == null || value.isNullOrEmpty()) {
            return
        }

        pubstarHandle.props(view).size = value
        view.post {
            pubstarHandle.onlyLoadAndShowAdWhenAllPropsSet(
                view = view,
                onLoaded = {
                    sendOnLoadedEvent(view)
                },
                onLoadedError = {
                    setOnLoadedError(view)
                },
                onShowed = {
                    setOnShowed(view)
                },
                onHide = { reward ->
                    setOnHide(view)
                },
                onShowedError = { errorCode ->
                    setOnShowedError(view)
                }
            )
        }
    }

    @ReactProp(name = "adId")
    override fun setAdId(view: FrameLayout, value: String?) {
        if (value.isNullOrEmpty()) {
            return
        }


        pubstarHandle.props(view).adId = value
        view.post {
            pubstarHandle.onlyLoadAndShowAdWhenAllPropsSet(
                view = view,
                onLoaded = {
                    sendOnLoadedEvent(view)
                },
                onLoadedError = {
                    setOnLoadedError(view)
                },
                onShowed = {
                    setOnShowed(view)
                },
                onHide = { reward ->
                    setOnHide(view)
                },
                onShowedError = { errorCode ->
                    setOnShowedError(view)
                }
            )
        }
    }

    @ReactProp(name = "type")
    override fun setType(view: FrameLayout, value: String?) {
        if (value.isNullOrEmpty()) {
            return
        }


        pubstarHandle.props(view).type = value
        view.post {
            pubstarHandle.onlyLoadAndShowAdWhenAllPropsSet(
                view = view,
                onLoaded = {
                    sendOnLoadedEvent(view)
                },
                onLoadedError = {
                    setOnLoadedError(view)
                },
                onShowed = {
                    setOnShowed(view)
                },
                onHide = { reward ->
                    setOnHide(view)
                },
                onShowedError = { errorCode ->
                    setOnShowedError(view)
                }
            )
        }
    }
}