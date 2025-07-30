package io.rtnpubstar

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.widget.FrameLayout
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.PubstarAdViewManagerDelegate
import com.facebook.react.viewmanagers.PubstarAdViewManagerInterface
import androidx.appcompat.widget.AppCompatTextView
import android.graphics.Color
import android.view.Gravity

class CenteredText : AppCompatTextView {
    constructor(context: Context) : super(context) {
        configureComponent()
    }

    constructor(context: Context, attrs: AttributeSet?) : super(context, attrs) {
        configureComponent()
    }

    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr) {
        configureComponent()
    }

    private fun configureComponent() {
        setBackgroundColor(Color.RED)
        gravity = Gravity.CENTER_HORIZONTAL
    }
}

@ReactModule(name = PubstarAdViewManager.NAME)
class PubstarAdViewManager(context: ReactApplicationContext) :
    SimpleViewManager<FrameLayout>(),
    PubstarAdViewManagerInterface<FrameLayout> {

    companion object {
        const val NAME = "PubstarAdView"
    }

    private val delegate: PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        PubstarAdViewManagerDelegate(this)

    override fun getDelegate(): PubstarAdViewManagerDelegate<FrameLayout, PubstarAdViewManager> =
        delegate

    override fun getName(): String = NAME

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        Log.d("PubstarAdView", "Native View Created")

        val frame = FrameLayout(reactContext)
        return frame
    }

    @ReactProp(name = "adId")
    override fun setAdId(view: FrameLayout, value: String?) {
        Log.d("PubstarAdViewManager", "setAdId - adId: $value")
    }
}