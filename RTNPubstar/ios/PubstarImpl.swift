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

    @objc public func loadAndShow() {
        PubstarAdManagerWrapper.loadAndShowAd(
            adId: "1233/99228313582",
            onLoadedError: { errorCode in
                print("onLoadedError callled: \(errorCode)")
            },
            onLoaded: {
                print("onLoaded called")
            },
            onHide: { reward in
                print("onHide called")
            },
            onShowed: {
                print("onShowed called")
            },
            onShowedError: { errorCode in
                print("onShowedError called: \(errorCode)")
            },
        )
    }

    @objc public func loadAndShow(
        adId: String
    ) {
        PubstarAdManagerWrapper.loadAndShowAd(
            adId: adId,
            onLoadedError: { errorCode in
                print("onLoadedError callled: \(errorCode)")
            },
            onLoaded: {
                print("onLoaded called")
            },
            onHide: { reward in
                print("onHide called")
            },
            onShowed: {
                print("onShowed called")
            },
            onShowedError: { errorCode in
                print("onShowedError called: \(errorCode)")
            },
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
                print("onLoadedError callled: \(errorCode)")
                onLoadedError(errorCode.rawValue)
            },
            onLoaded: {
                print("onLoaded called")
                onLoaded()
            },
            onHide: { reward in
                print("onHide called")
                onHide()
            },
            onShowed: {
                print("onShowed called")
                onShowed()
            },
            onShowedError: { errorCode in
                print("onShowedError called: \(errorCode)")
                onShowedError(errorCode.rawValue)
            },
        )
    }

}
