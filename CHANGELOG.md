# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [1.6.2] - 2026-09-24

- Bumped the native SDKs to `1.6.2` (iOS `Pubstar ~> 1.6.2`, Android `io.pubstar.mobile:ads:1.6.2`), which brings the reporting work from that release: `app_crash` / `app_session` on their own endpoint, a `screen` dimension on every metric, the `load_time` metric, `display_time` measuring time-to-show for full-screen formats, and one `impression` per `sdk_request` per placement.
- **iOS behaviour change:** a missing `io.pubstar.key` in `Info.plist` now fails at initialization instead of silently falling back to the built-in debug App ID. An app that was misconfigured this way used to keep running while every report it sent landed on the debug app; it will now stop at init. This matches what Android has always done.
- README: no longer suggests the test App ID `pub-app-id-1233` as an example of a real App ID, and states that the key is required.
- **Fixed iOS initialization failing with `-7` (`NO_INIT`) in Release builds.** The bridge looked up the host view controller once, on the first call, from React Native's background module queue. When `initialization()` ran on mount — before the scene was foreground-active — the lookup returned nil and stayed nil for the life of the app, so init rejected and every load/show returned silently. The lookup now runs on the main thread, is retried until found, and waits for the scene to become active instead of failing. Affects 1.6.1 and earlier.

### [1.6.1] - 2026-06-09

- Fixed iOS initialization ignoring the app's `io.pubstar.key` from `Info.plist`. The iOS bridge forced `setIsDebug(true)`, which made the native SDK initialize with the built-in debug App ID instead of the publisher's real App ID, so the init config never matched the app's ad unit IDs.

### [1.6.0-1] - 2026-06-18

- Fixed Android banner/native ads not appearing in the view despite successful load/show (manual measure+layout pass for imperatively-added ad views).
- README now synced from the repo root automatically on publish, so the npm page stays up to date.

### [1.6.0] - 2026-06-18

- **Custom Native** — render native ads with your own layout via `NativeCustomConfig` (`customConfig` on `PubstarAdView`).
- **Video (IMA)** — `PubstarAdView` with video `type` (`videoInStream` / `videoOutStream`) and a `media` URL; dedicated `PubstarAdVideoView` component also available.
- Updated README with full Usage guide (Init / Load / Show / LoadAndShow, Banner & Native, Custom Native, Video IMA) aligned with the Android and iOS SDKs.

### [1.5.0] - 2026-01-25

- **OpenRTB (ORTB) Bidding Adapter**
  - Added a dedicated ORTB Adapter that supports ad auctioning based on the IAB OpenRTB 2.6 specification:
    https://github.com/InteractiveAdvertisingBureau/openrtb2.x

  - Supported ad formats:
    - Banner

    - Interstitial

    - Rewarded

  - ORTB bidding is handled entirely inside the SDK via the adapter layer, without requiring any additional client-side configuration.

- Summary
  - All bidding logic is encapsulated inside the SDK and driven by server configuration.

    This release significantly reduces integration complexity while enabling advanced auction-based advertising workflows.

## [1.2.2] - 2025-12-22

### Changed
- Version 1.2.2 release

### Notes
- **Prebid Mediation**
  - Added mediation support between Prebid and Google AdMob, AppLovin MAX, and Google Ad Manager (GAM).
  - Enables Prebid demand to compete in the mediation stack for supported formats without additional integration work.
  - Configuration is handled at the Pubstar level so existing placements can be upgraded to Prebid Mediation with minimal changes.

## [1.3.1] - 2025-11-28

### Changed
- **Reduced overall SDK size**  
  - Optimized internal architecture to significantly reduce the plugin size on both Android and iOS.
- **Faster initialization performance (`initialization()`)**  
  - Improved startup flow and asynchronous handling, resulting in faster SDK initialization.
- **Improved ad loading speed**  
  - Enhanced the ad loading pipeline, reducing latency and increasing load stability.
- **Enhanced modularity for future ad network integrations**  
  - Refactored core structure to make it easier to extend and integrate additional ad networks in upcoming versions.

### Notes
- No API changes are required when upgrading to 1.3.1.
- Recommended update for better performance and long-term support.

## [1.1.8] - 2025-05-25
### Added
- **React Native SDK (New Architecture)** compatible with RN **>= 0.68**.
- **Platform support**
  - **iOS >= 13.0**
  - **Android** (Gradle repository + manifest key configuration)
- **Initialization API**
  - `Pubstar.initialization()`
- **Ad Loading/Showing APIs**
  - `Pubstar.loadAd(adId, { onLoadError, onLoaded })`
  - `Pubstar.showAd(adId, { onAdHide, onAdShowed, onShowError })`
  - `Pubstar.loadAndShowAd(adId, { onLoadError, onLoaded, onAdHide, onAdShowed, onShowError })`
- **UI Component**
  - `<PubstarAdView />` for Banner & Native ads with props:
    - `adId`, `size` (`small` | `medium` | `large`), `type` (`banner` | `native`)
    - Callbacks: `onLoaded`, `onLoadedError`, `onShowed`, `onHide`, `onShowedError`
- **Documentation**
  - Installation via `npm`/`yarn`
  - iOS setup (Info.plist: `GADApplicationIdentifier`, `NSUserTrackingUsageDescription`, ATS)
  - Android setup (Appodeal repo; `io.pubstar.key` `<meta-data>` in `AndroidManifest.xml`)
  - Example usage snippets for all APIs and `<PubstarAdView />`
  - Test Ad IDs block for quick validation
  - Support & License information

### Notes
- **Breaking/Requirement**: React Native **New Architecture** is required.
- **Info.plist** must include a valid **AdMob App ID**.
- **Android** must include the `io.pubstar.key` application meta-data and add the Appodeal Maven repository.

