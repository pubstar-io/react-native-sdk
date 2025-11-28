# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2025-11-28

### Changed
- **Reduced overall SDK size**  
  - Optimized internal architecture to significantly reduce the plugin size on both Android and iOS.
- **Faster initialization performance (`init()`)**  
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

