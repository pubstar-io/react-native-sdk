//
//  PubstarAdManagerWrapper.swift
//  rtn_pubstar
//
//  Created by Mobile  on 10/6/25.
//

import AVFoundation
import Pubstar

@available(iOS 13.0, *)
public final class PubstarAdManagerWrapper {
    private static let _pubStarAdManager = PubStarAdManager.getInstance()
    private static let _pubStarAdController = PubStarAdManager.getAdController()
    private static var _cachedContext: UIViewController?

    /// Resolved lazily and retried until found. The old `static var _context =
    /// PubStarUtils.getHostingViewController()` ran its initializer exactly once, on
    /// first access — which is `Pubstar.initialization()`, usually called from JS on
    /// mount. In a Release build the embedded bundle runs before the scene is
    /// foreground-active, the lookup returns nil, and `_context` then stayed nil for
    /// the life of the process: init rejected with NO_INIT (-7) and every load/show
    /// returned silently. Must be read on the main thread.
    private static var _context: UIViewController? {
        if _cachedContext == nil {
            _cachedContext = PubStarUtils.getHostingViewController()
        }
        return _cachedContext
    }

    private init() {

    }

    public static func initPubstar(
        onDone: @escaping () -> Void,
        onError: @escaping (ErrorCode) -> Void
    ) {
        // React Native invokes module methods on a background queue; the scene and
        // window lookup behind `_context` is UIKit and has to run on main.
        guard Thread.isMainThread else {
            DispatchQueue.main.async { initPubstar(onDone: onDone, onError: onError) }
            return
        }
        guard let context = _context else {
            // No foreground-active scene yet. Wait for one instead of failing for good.
            waitForActiveScene {
                if _context != nil {
                    initPubstar(onDone: onDone, onError: onError)
                } else {
                    onError(ErrorCode.NO_INIT)
                }
            }
            return
        }

        PubStarAdManager.gatherConsent(
            from: context,
            listener: ConsentGatheringCompleteHandler(onComplete: { error in
                PubStarAdManager.getInstance()
                    // isDebug = true khiến SDK bỏ qua `io.pubstar.key` trong Info.plist
                    // và dùng App ID debug dựng sẵn -> lệch với ad unit của app.
                    .setIsDebug(isDebug: false)
                    .setInitAdListener(
                        InitAdListenerHandler(
                            onDone: {
                                onDone()
                            },
                            onError: { errorCode in
                                onError(errorCode)
                            }
                        )
                    )
                    .initAd()
            })
        )
    }

    /// Calls `then` once a scene is foreground-active, or after 20 s at the latest.
    private static func waitForActiveScene(_ then: @escaping () -> Void) {
        var token: NSObjectProtocol?
        var finished = false
        let finish = {
            guard !finished else { return }
            finished = true
            if let token = token { NotificationCenter.default.removeObserver(token) }
            then()
        }
        token = NotificationCenter.default.addObserver(
            forName: UIScene.didActivateNotification, object: nil, queue: .main
        ) { _ in finish() }
        // The scene may have activated between the failed lookup and registering the
        // observer; that notification would never arrive.
        DispatchQueue.main.async {
            if PubStarUtils.getHostingViewController() != nil { finish() }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 20) { finish() }
    }

    public static func loadAd(
        adId: String,
        onLoaded: @escaping () -> Void,
        onError: @escaping (ErrorCode) -> Void
    ) {
        if _context == nil {
            return
        }

        let adNetLoaderListener: AdLoaderListener = AdLoaderHandler {
            onLoaded()
        } onError: { errorCode in
            onError(errorCode)
        }

        _pubStarAdController.load(
            context: _context!,
            key: adId,
            adLoaderListener: adNetLoaderListener
        )
    }

    public static func showAd(
        adId: String,
        view: UIView? = nil,
        onHide: @escaping (RewardModel?) -> Void,
        onShowed: @escaping () -> Void,
        onError: @escaping (ErrorCode) -> Void
    ) {
        if _context == nil {
            return
        }

        let adShowedListener: AdShowedListener = AdShowedHandler {
            onShowed()
        } onHide: { state in
            onHide(state)
        } onError: { errorCode in
            onError(errorCode)
        }

        _pubStarAdController.show(
            context: _context!,
            key: adId,
            view: view,
            adShowedListener: adShowedListener
        )
    }

    public static func loadAndShowAd(
        adId: String,
        view: UIView? = nil,
        onLoadedError: @escaping (ErrorCode) -> Void,
        onLoaded: @escaping () -> Void,
        onHide: @escaping (RewardModel?) -> Void,
        onShowed: @escaping () -> Void,
        onShowedError: @escaping (ErrorCode) -> Void
    ) {
        if _context == nil {
            return
        }

        let adNetLoaderListener: AdLoaderListener = AdLoaderHandler {
            onLoaded()
        } onError: { code in
            onLoadedError(code)
        }

        let adNetShowListener: AdShowedListener = AdShowedHandler {
            onShowed()
        } onHide: { state in
            onHide(state)
        } onError: { errorCode in
            onShowedError(errorCode)
        }

        _pubStarAdController
            .loadAndShow(
                context: _context!,
                key: adId,
                view: view,
                adLoaderListener: adNetLoaderListener,
                adShowedListener: adNetShowListener
            )
    }

    public static func loadAndShowNativeAd(
        adId: String,
        view: UIView? = nil,
        size: NativeAdRequest.TypeSize,
        isAllowLoadNext: Bool = true,
        onLoaderError: @escaping (ErrorCode) -> Void,
        onLoaded: @escaping () -> Void,
        onHide: @escaping (RewardModel?) -> Void,
        onShowed: @escaping () -> Void,
        onShowedError: @escaping (ErrorCode) -> Void,
        customConfig: NativeAdViewBinder? = nil
    ) {
        if _context == nil {
            return
        }

        let adNetLoaderListener: AdLoaderListener = AdLoaderHandler {
            onLoaded()
        } onError: { code in
            onLoaderError(code)
        }

        let adNetShowListener: AdShowedListener = AdShowedHandler {
            onShowed()
        } onHide: { state in
            onHide(state)
        } onError: { errorCode in
            onShowedError(errorCode)
        }

        var adRequest: NativeAdRequest

        if customConfig != nil {
            let customNativeAd = NativeAdViewBinder.Builder(
                layoutId: customConfig!.layoutId
            )
            .apply(config: customConfig!)
            .build()

            adRequest = NativeAdRequest.Builder(context: _context!)
                .isAllowLoadNext(isAllowLoadNext)
                .withView(view)
                .withNativeAdViewBinderCustom(customNativeAd)
                .sizeType(.Custom)
                .adLoaderListener(adNetLoaderListener)
                .adShowedListener(adNetShowListener)
                .build()
        } else {
            adRequest = NativeAdRequest.Builder(context: _context!)
                .isAllowLoadNext(isAllowLoadNext)
                .withView(view)
                .sizeType(size)
                .adLoaderListener(adNetLoaderListener)
                .adShowedListener(adNetShowListener)
                .build()
        }

        _pubStarAdController
            .loadAndShow(
                key: adId,
                adRequest: adRequest
            )
    }

    public static func loadAndShowBannerAd(
        adId: String,
        view: UIView? = nil,
        tag: BannerAdRequest.AdTag,
        isAllowLoadNext: Bool = true,
        onLoaderError: @escaping (ErrorCode) -> Void,
        onLoaded: @escaping () -> Void,
        onHide: @escaping (RewardModel?) -> Void,
        onShowed: @escaping () -> Void,
        onShowedError: @escaping (ErrorCode) -> Void
    ) {
        if _context == nil {
            return
        }

        let adNetLoaderListener: AdLoaderListener = AdLoaderHandler {
            onLoaded()
        } onError: { code in
            onLoaderError(code)
        }

        let adNetShowListener: AdShowedListener = AdShowedHandler {
            onShowed()
        } onHide: { state in
            onHide(state)
        } onError: { errorCode in
            onShowedError(errorCode)
        }

        let request = BannerAdRequest.Builder(context: _context!)
            .isAllowLoadNext(isAllowLoadNext)
            .withView(view)
            .tag(tag)
            .adLoaderListener(adNetLoaderListener)
            .adShowedListener(adNetShowListener)
            .build()

        _pubStarAdController
            .loadAndShow(
                key: adId,
                adRequest: request
            )
    }

    public static func loadAndShowVideoAd(
        adId: String,
        view: UIView? = nil,
        tag: BannerAdRequest.AdTag,
        type: String,
        media: String? = nil,
        isAllowLoadNext: Bool = true,
        onLoaderError: @escaping (ErrorCode) -> Void,
        onLoaded: @escaping () -> Void,
        onHide: @escaping (RewardModel?) -> Void,
        onShowed: @escaping () -> Void,
        onShowedError: @escaping (ErrorCode) -> Void

    ) {
        let adNetLoaderListener: AdLoaderListener = AdLoaderHandler {
            onLoaded()
        } onError: { code in
            onLoaderError(code)
        }

        let adNetShowListener: AdShowedListener = AdShowedHandler {
            onShowed()
        } onHide: { state in
            onHide(state)
        } onError: { errorCode in
            onShowedError(errorCode)
        }

        guard let view = view, let context = _context else {
            return
        }

        switch type {
        case "videoInStream":
            guard let mediaContent = media else {
                onLoaderError(ErrorCode.NO_VIEW_TO_ATTACH)
                return
            }
            
            let inStream = InStreamIMA(
                urlString: mediaContent,
                view: view,
                context: context,
                loadListener: adNetLoaderListener,
                showListener: adNetShowListener
            )
            inStream.tringer(
                pubStarController: _pubStarAdController,
                adId: adId
            )
            break
        case "videoOutStream":
            let outStream = OutStreamIMA(
                view: view,
                context: context,
                loadListener: adNetLoaderListener,
                showListener: adNetShowListener
            )
            outStream.tringer(
                pubStarController: _pubStarAdController,
                adId: adId
            )
            break
        default:
            break
        }
    }
}

class InStreamIMA {
    private var urlPath: String
    private var view: UIView
    private var context: UIViewController
    private var adNetLoaderListener: AdLoaderListener
    private var adNetShowListener: AdShowedListener

    init(
        urlString: String,
        view: UIView,
        context: UIViewController,
        loadListener: AdLoaderListener,
        showListener: AdShowedListener
    ) {
        self.urlPath = urlString
        self.view = view
        self.context = context
        self.adNetLoaderListener = loadListener
        self.adNetShowListener = showListener
    }

    func tringer(pubStarController: PubStarAdController, adId: String) {
        DispatchQueue.main.async {
            guard let player = self.createPlayerVideo() else {
                self.adNetLoaderListener.onError(code: ErrorCode.SHOW_ERROR)
                return
            }

            let _ = self.createVideoView(
                containerVideo: self.view,
                player: player
            )

            player.play()

            let request = IMARequest.Builder(context: self.context)
                .isAllowCache(true)
                .withView(self.view)
                .withMedia(player)
                .withType(.inStream)
                .adLoaderListener(self.adNetLoaderListener)
                .adShowedListener(self.adNetShowListener)
                .build()

            pubStarController
                .loadAndShow(
                    key: adId,
                    adRequest: request
                )
        }
    }

    private func createPlayerVideo() -> AVPlayer? {
        guard
            let url = URL(
                string: urlPath
            )
        else {
            return nil
        }

        let player = AVPlayer(url: url)
        player.isMuted = true
        player.actionAtItemEnd = .none

        return player
    }

    private func createVideoView(
        containerVideo: UIView,
        player: AVPlayer
    ) -> UIView {
        let playerLayer: AVPlayerLayer = AVPlayerLayer(player: player)
        playerLayer.frame = containerVideo.bounds
        playerLayer.videoGravity = .resizeAspect

        containerVideo.layer.sublayers?.forEach {
            $0.removeFromSuperlayer()
        }

        containerVideo.layer.insertSublayer(playerLayer, at: 0)

        return containerVideo
    }
}

class OutStreamIMA {
    private var view: UIView
    private var context: UIViewController
    private var adNetLoaderListener: AdLoaderListener
    private var adNetShowListener: AdShowedListener

    init(
        view: UIView,
        context: UIViewController,
        loadListener: AdLoaderListener,
        showListener: AdShowedListener
    ) {
        self.view = view
        self.context = context
        self.adNetLoaderListener = loadListener
        self.adNetShowListener = showListener
    }

    func tringer(pubStarController: PubStarAdController, adId: String) {
        let request = IMARequest.Builder(context: self.context)
            .isAllowCache(true)
            .withView(self.view)
            .withType(.outStream)
            .withSize(.medium)
            .adLoaderListener(self.adNetLoaderListener)
            .adShowedListener(self.adNetShowListener)
            .build()

        pubStarController
            .loadAndShow(
                key: adId,
                adRequest: request
            )
    }
}
