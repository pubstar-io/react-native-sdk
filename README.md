## PubStar SDK

PubStar Mobile Ads SDK is a comprehensive monetization solution that enables developers to seamlessly integrate high-performance ad formats into mobile applications across multiple platforms:

- [iOS](https://pub-star.gitbook.io/docs/ios-sdk/integration)
- [Android](https://pub-star.gitbook.io/docs/android-sdk/integration)
- [React Native](https://pub-star.gitbook.io/docs/react-native-sdk/integration)
- [Flutter](https://pub-star.gitbook.io/docs/flutter-sdk/integration)
- [Unity](https://pub-star.gitbook.io/docs/unity-sdk/integration)

The SDK provides a unified and flexible API for loading, displaying, and managing ads while ensuring a non-intrusive and optimized user experience.

> **Current version:** `1.6.0`

### Supported Ad Formats

PubStar supports the following ad formats:

- Banner Ads
- Native Ads
- Interstitial Ads
- App Open Ads
- Rewarded Ad
- Video Ads (IMA)

All formats are responsive and optimized for performance and revenue maximization.

## Requirements

- React Native >= **0.68** (must support the New Architecture)
- iOS >= **13.0**
- Android `minSdk` >= **23**
- A **PubStar App ID** from the PubStar Dashboard (format `pub-app-id-XXXX`)

## Installation

Using npm:

```shell
npm install --save rtn-pubstar
```

or using yarn:

```shell
yarn add rtn-pubstar
```

Add your PubStar App ID:

- **Android** — in `AndroidManifest.xml`, inside `<application>`:

```xml
<meta-data
  android:name="io.pubstar.key"
  android:value="pub-app-id-XXXX" />
```

- **iOS** — in `Info.plist`:

```xml
<key>io.pubstar.key</key>
<string>pub-app-id-XXXX</string>
```

> Replace `pub-app-id-XXXX` with your real App ID (for example `pub-app-id-1233`). Do not ship production builds with a placeholder value.

## Usage

### Init SDK

Initialization must be called once before loading or showing ads.

```js
import Pubstar from 'rtn-pubstar';

try {
    await Pubstar.initialization();
    // ready to load and show ads
} catch (error) {
    // init error
}
```

### Load AD

```js
Pubstar.loadAd(adId, {
    onLoaded: () => { /* ad loaded */ },
    onLoadError: errorCode => { /* ad load error */ },
});
```

### Show AD

```js
Pubstar.showAd(adId, {
    onAdShowed: () => { /* ad showed */ },
    onAdHide: reward => { /* ad hidden, optional reward */ },
    onShowError: errorCode => { /* error */ },
});
```

### Load And Show AD

```js
Pubstar.loadAndShowAd(adId, {
    onLoaded: () => { /* ad loaded */ },
    onLoadError: errorCode => { /* ad load error */ },
    onAdShowed: () => { /* ad showed */ },
    onAdHide: reward => { /* ad hidden, optional reward */ },
    onShowError: errorCode => { /* error */ },
});
```

### Banner & Native

Use `PubstarAdView` for view-based formats (`banner`, `native`):

```jsx
import { PubstarAdView } from 'rtn-pubstar';

<PubstarAdView
    adId={adId}
    style={styles.ad}
    size="medium" // small, medium, large
    type="native" // banner or native
    onLoaded={() => { /* ad loaded */ }}
    onLoadedError={errorCode => { /* ad load error */ }}
    onShowed={() => { /* ad showed */ }}
    onHide={reward => { /* ad hidden, optional reward */ }}
    onShowedError={errorCode => { /* show error */ }}
/>
```

### Custom Native — your own layout

Beyond the preset sizes, you can render a native ad with **your own layout**. Design the layout natively (Android XML / iOS view), then map your view IDs to the ad fields with a `NativeCustomConfig` and pass it via `customConfig`.

```jsx
import { Platform } from 'react-native';
import { PubstarAdView, NativeCustomConfig } from 'rtn-pubstar';

const customConfig = useMemo(() => {
    if (Platform.OS === 'android') {
        return new NativeCustomConfig.Builder('pubstar_applovin_native_big')
            .setAdvertiserTextViewId('ad_advertiser')
            .setIconImageViewId('ad_logo')
            .setTitleTextViewId('ad_headline')
            .setMediaContentViewGroupId('ad_media')
            .setBodyTextViewId('ad_body')
            .setCallToActionButtonId('ad_call_to_action')
            .setLoadingViewName('pubstar_shimmer_native_big')
            .setCtaColorHex('#FFFFFF')
            .build();
    }

    // iOS
    return new NativeCustomConfig.Builder('AppAdmobNativeCustom')
        .setAdvertiserTextViewId('1')
        .setIconImageViewId('2')
        .setTitleTextViewId('3')
        .setMediaContentViewGroupId('4')
        .setBodyTextViewId('5')
        .setCallToActionButtonId('6')
        .setLoadingViewName('AppShimmerBanner')
        .build();
}, []);

<PubstarAdView
    adId={adId}
    style={styles.ad}
    type="native"
    customConfig={customConfig}
    onLoaded={() => { /* ad loaded */ }}
    onLoadedError={errorCode => { /* ad load error */ }}
    onShowed={() => { /* ad showed */ }}
    onHide={reward => { /* ad hidden */ }}
    onShowedError={errorCode => { /* show error */ }}
/>
```

> The view IDs/layout names refer to **native resources** in your host app. When `customConfig` is provided, the `size` prop is ignored — the ad fills your custom layout.

### Video (IMA)

Render a video (IMA) ad with `PubstarAdView` using a video `type` (`videoInStream` / `videoOutStream`) and a `media` URL:

```jsx
import { PubstarAdView } from 'rtn-pubstar';

<PubstarAdView
    adId={adId}
    style={styles.ad}
    size="medium"
    type="videoOutStream" // videoOutStream or videoInStream
    media="https://storage.googleapis.com/gvabox/media/samples/stock.mp4"
    onLoaded={() => { /* ad loaded */ }}
    onLoadedError={errorCode => { /* ad load error */ }}
    onShowed={() => { /* ad showed */ }}
    onHide={reward => { /* ad hidden */ }}
    onShowedError={errorCode => { /* show error */ }}
/>
```

- `videoOutStream`: a standalone video ad placed in your layout.
- `videoInStream`: the ad plays inside your own video content stream.

> A dedicated `PubstarAdVideoView` component is also available (same props, `type="video"`).

## ID Test AD

Pair these with App ID `pub-app-id-1233`. Replace them with production placement keys before shipping.

```text
App ID          : pub-app-id-1233
Banner ID       : 1233/99228313580
Native ID       : 1233/99228313581
Interstitial ID : 1233/99228313582
Open ID         : 1233/99228313583
Rewarded ID     : 1233/99228313584
Video ID        : 1233/99228313585
```

### Documentation

[**Guides**](https://pub-star.gitbook.io/docs/)

### Support

[Support](https://pub-star.gitbook.io/docs/support)

## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
