import Foundation
import Pubstar

@objc public class PubstarImpl: NSObject {
    @objc public func initialization(
        onDone: @escaping () -> Void,
        onError: @escaping (Int) -> Void
    ) {
        PubstarAdManagerWrapper.initPubstar(
            onDone: {
                onDone()
            },
            onError: { errorCode in
                onError(errorCode.rawValue)
            }
        )
    }

    @objc public func loadAd(
        adId: String,
        onLoaded: @escaping () -> Void,
        onError: @escaping (Int) -> Void
    ) {
        PubstarAdManagerWrapper.loadAd(
            adId: adId,
            onLoaded: {
                onLoaded()
            },
            onError: { errorCode in
                onError(errorCode.rawValue)
            }
        )
    }

    @objc public func showAd(
        adId: String,
        onHide: @escaping () -> Void,
        onShowed: @escaping () -> Void,
        onError: @escaping (Int) -> Void
    ) {
        PubstarAdManagerWrapper
            .showAd(
                adId: adId,
                onHide: { reward in
                    onHide()
                },
                onShowed: {
                    onShowed()
                },
                onError: { errorCode in
                    onError(errorCode.rawValue)
                }
            )
    }

    @objc public func loadAndShow(
        adId: String,
        onLoadedError: @escaping (Int) -> Void,
        onLoaded: @escaping () -> Void,
        onHide: @escaping () -> Void,
        onShowed: @escaping () -> Void,
        onShowedError: @escaping (Int) -> Void
    ) {
        PubstarAdManagerWrapper.loadAndShowAd(
            adId: adId,
            onLoadedError: { errorCode in
                onLoadedError(errorCode.rawValue)
            },
            onLoaded: {
                onLoaded()
            },
            onHide: { reward in
                onHide()
            },
            onShowed: {
                onShowed()
            },
            onShowedError: { errorCode in
                onShowedError(errorCode.rawValue)
            },
        )
    }

}
