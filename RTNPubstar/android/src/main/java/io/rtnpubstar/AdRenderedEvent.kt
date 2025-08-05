package io.rtnpubstar

import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTModernEventEmitter

class AdLoadedEvent(
    surfaceId: Int,
    viewTag: Int
) : Event<AdLoadedEvent>(surfaceId, viewTag) {
    override fun getEventName(): String = "onLoaded"

    override fun canCoalesce(): Boolean = false

    override fun dispatchModern(rctEventEmitter: RCTModernEventEmitter) {
        rctEventEmitter.receiveEvent(
            surfaceId,
            viewTag,
            eventName,
            null
        )
    }
}

class AdEvent(
    private val name: String,
    surfaceId: Int,
    viewTag: Int,
) : Event<AdLoadedEvent>(surfaceId, viewTag) {
    override fun getEventName(): String = this.name

    override fun canCoalesce(): Boolean = false

    override fun dispatchModern(rctEventEmitter: RCTModernEventEmitter) {
        rctEventEmitter.receiveEvent(
            surfaceId,
            viewTag,
            eventName,
            null
        )
    }
}