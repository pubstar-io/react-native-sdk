# rtn-pubstar

PubStar All in One Platform provides every type of publisher with multiple ad formats: Video Instream, Outstream, Display Banner, Sticky Banners, Interstitial,

Native Ad, Reward Ad, Audio Ad, Open Ad for Apps… You can maximize your ad revenue with any of them. All types of ads are responsive for all devices.

You can set the frequency cap of ad requests to bring good user experience for your websites and apps.

## TOC

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API](#api)
- [Release Notes](#release-notes)
- [ID Test Ad](#id-test-ad)
- [Support](#support)

## Requirements

- React Native >= 0.68 (React Natvie must support New Architecture)
- iOS >= 13.0

## Installation

Using npm:

```shell
npm install --save rtn-pubstar
```

or using yarn:

```shell
yarn add rtn-pubstar
```

## Configuration

### iOS

#### 1. Configure Pod.
1. Navigate to your iOS project directory.

2. Install the dependencies using pod install.

```bash
pod install
```

3. Open your project in Xcode with the .xcworkspace file.

#### 2. Update your Info.plist

Update your app's Info.plist file to add two keys:

A GADApplicationIdentifier key with a string value of your AdMob app ID [found in the AdMob UI](https://support.google.com/admob/answer/7356431).

```xml
<key>GADApplicationIdentifier</key>
<string>Your AdMob app ID</string>
<key>NSUserTrackingUsageDescription</key>
<string>We use your data to show personalized ads and improve your experience.</string>
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Android

#### 1. Configure Maven Repositories
Open your project-level build.gradle or settings.gradle and add:
```gradle
repositories {
  mavenCentral()
  maven { url = uri("https://artifactory.appodeal.com/appodeal") }  <--- add this
}
```

#### 2. Add Pubstar Key to AndroidManifest.
Open `AndroidManifest.xml` and add inside `<application>`:

```bash
<meta-data
  android:name="io.pubstar.key"
  android:value="pub-app-id-XXXX" />
```
Replace pub-app-id-XXXX with your actual [Pubstar App ID](https://pubstar.io/).  

## Usage

```js
import Pubstar, { PubstarAdView } from 'rtn-pubstar';
```

## API

The example app in this repository shows an example usage of every single API, consult the example app if you have questions, and if you think you see a problem make sure you can reproduce it using the example app before reporting it, thank you.

| Method                                                              | Return Type         |
| ------------------------------------------------------------------- | ------------------- |
| [initialization()](#initialization)                                 | `Promise<void>`     |
| [loadAd()](#loadad)                                                 | `Promise<void>`     |
| [showAd()](#showad)                                                 | `Promise<void>`     |
| [loadAndShow()](#loadandshow)                                       | `Promise<void>`     |
| [PubstarAdView](#pubstaradview)                                     | `React component`   |

### initialization()

Initialization Pubstar SDK.

```js
Pubstar.initialization();
```

### loadAd(adId, callbackEvent)

Load Pubstar ads by adId to application.

#### Event

ShowListener

| Callback                             | Function                                                   |
| ------------------------------------ | ---------------------------------------------------------- |
| `onLoadError`                        | call when load ad failed. return object type `ErrorCode`   |
| `onLoaded`                           | call when ad loaded                                        |

#### Example

```js
Pubstar.loadAd(adId, {
    onLoadError: errorCode => {
        console.error('Ad load error:', errorCode);
    },
    onLoaded: () => {
        console.log('Ad loaded');
    },
})
```

### showAd(adId, callbackEvent)

Show ad had loaded before.

#### Event

ShowListener

| Callback                | Function                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| `onAdHide`              | call when ad hidden by press close button. return object type `ErrorCode`      |
| `onAdShowed`            | call when ad showed                                                            |
| `onShowError`           | call when show ad failed. return object type `ErrorCode`                       |

#### Example

```js
Pubstar.showAd(adId, {
    onAdHide: reward => {
        console.log('Ad hidden', reward);
    },
    onAdShowed: () => {
        console.log('Ad showed');
    },
    onShowError: errorCode => {
        console.error('Ad show error:', errorCode);
    },
});

```

### loadAndShow(adId, callbackEvent)

Load ad then show ad in one.

#### Event

LoadAndShowListener

| Callback                | Function                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| `onLoadError`           | call when load ad failed. return object type `ErrorCode`                       |
| `onLoaded`              | call when ad loaded                                                            |
| `onAdHide`              | call when ad hidden by press close button. return object type `RewardModel`    |
| `onAdShowed`            | call when ad showed                                                            |
| `onShowError`           | call when show ad failed. return object type `ErrorCode`                       |

#### Example

```js
Pubstar.loadAndShowAd(adId, {
    onLoadError: errorCode => {
        console.error('Ad load error:', errorCode);
    },
    onLoaded: () => {
        console.log('Ad loaded');
    },
    onAdHide: reward => {
        console.log('Ad hidden', reward);
    },
    onAdShowed: () => {
        console.log('Ad showed');
    },
    onShowError: errorCode => {
        console.error('Ad show error:', errorCode);
    },
});

```

### PubstarAdView

Load ad then show ad, using for Banner ad and Native ad.

#### API

| Props                   | Function                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| `adId`                  | id of Banner or Native ad                                                      |
| `size`                  | size of ad View. (`small`, `medium`, `large`)                                  |
| `type`                  | kind of ad View. (`banner`, `native`)                                          |
| `onLoaded`              | call when ad loaded                                                            |
| `onLoadedError`         | call when load ad failed. return object type `ErrorCode`                       |
| `onShowed`              | call when ad showed                                                            |
| `onHide`                | call when ad closed return object type `RewardModel`                           |
| `onShowedError`         | call when show ad failed. return object type `ErrorCode`                       |

#### Example

```jsx
<PubstarAdView
    adId="1233/99228313580"
    style={styles.ad}
    size="medium"
    type="banner"
    onLoaded={() => {
        console.log('Banner ad loaded');
    }}
    onLoadedError={(errorCode) => console.log('Banner ad load error', errorCode)}
    onShowed={() => {
        console.log('Banner ad showed');
    }}
    onHide={() => console.log('Banner ad hidden')}
    onShowedError={(errorCode) => console.log('Banner ad showed error:', errorCode)}
/>
```

## Release Notes

See the [CHANGELOG.md](https://github.com/pubstar-io/react-native-sdk.git/main/CHANGELOG.md).

## ID Test AD

```python
App ID : pub-app-id-1233
Banner Id : 1233/99228313580
Native ID : 1233/99228313581
Interstitial ID : 1233/99228313582
Open ID : 1233/99228313583
Rewarded ID : 1233/99228313584
Video ID : 1233/99228313585
```

## Support
Email: developer@tqcsolution.com

Raise an issue on GitHub for bugs or feature requests.

## License

Pubstar is released under the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).

License agreement is available at [LICENSE](LICENSE).