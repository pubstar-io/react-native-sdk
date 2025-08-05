package io.rtnpubstar

import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTModernEventEmitter

class AdRenderedEvent(
    surfaceId: Int,
     viewTag: Int
) : Event<AdRenderedEvent>(surfaceId, viewTag) {

    override fun getEventName(): String = "onAdRendered"

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