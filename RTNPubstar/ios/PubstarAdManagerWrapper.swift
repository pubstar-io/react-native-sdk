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
    private static var _context: UIViewController? =
        PubStarUtils.getHostingViewController()

    private init() {

    }

    public static func initPubstar(
        onDone: @escaping () -> Void,
        onError: @escaping (ErrorCode) -> Void
    ) {
        guard let context = _context else {
            onError(ErrorCode.NO_INIT)
            return
        }

        PubStarAdManager.gatherConsent(
            from: context,
            listener: ConsentGatheringCompleteHandler(onComplete: { error in
                PubStarAdManager.getInstance()
                    .setIsDebug(isDebug: true)
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
