package io.rtnpubstar

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTModernEventEmitter
import io.pubstar.mobile.ads.model.ErrorCode
import io.pubstar.mobile.ads.model.RewardModel

fun errorCodeToMap(errorCode: ErrorCode): WritableMap {
    val map = Arguments.createMap()
    map.putString("name", errorCode.name)
    map.putInt("code", errorCode.code)

    return map
}

fun rewardToMap(reward: RewardModel?): WritableMap {
    val map = Arguments.createMap()

    if (reward == null) {
        return map
    }

    map.putString("type", reward.type)
    map.putInt("amount", reward.amount)

    return map
}

class AdEvent(
    private val name: String,
    surfaceId: Int,
    viewTag: Int,
    private val payload: WritableMap? = null
) : Event<AdEvent>(surfaceId, viewTag) {
    override fun getEventName(): String = this.name

    override fun canCoalesce(): Boolean = false

    override fun dispatchModern(rctEventEmitter: RCTModernEventEmitter) {
        rctEventEmitter.receiveEvent(
            surfaceId,
            viewTag,
            eventName,
            payload
        )
    }
}