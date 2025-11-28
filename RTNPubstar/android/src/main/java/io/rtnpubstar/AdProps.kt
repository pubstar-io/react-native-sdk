package io.rtnpubstar

import io.pubstar.mobile.core.base.NativeAdRequest
import io.pubstar.mobile.core.base.BannerAdRequest

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