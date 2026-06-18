import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Button,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import Pubstar, {
  NativeCustomConfig,
  PubstarAdView,
} from 'rtn-pubstar';

enum PubstarAdIdForIOS {
  BANNER = '1277/99228313841',
  NATIVE = '1277/99228313830',
  INTERSTITIAL = '1277/99228313850',
  OPEN = '1277/99228313844',
  REWARDED = '1692/99228314091',
  VIDEO = '1687/99228314138',
}

enum PubstarAdIdForAndroid {
  BANNER = '1264/99228313741',
  NATIVE = '1264/99228313724',
  INTERSTITIAL = '1264/99228313740',
  OPEN = '1264/99228313722',
  REWARDED = '1687/99228314076',
  VIDEO = '1692/99228314139',
}

async function initRTNPubstar() {
  try {
    await Pubstar.initialization();
    console.log('[APP] Pubstar.initialization was successed');
  } catch (error) {
    console.error('[APP] Pubstar.initialization was failed with error', error);
  }
}

initRTNPubstar();

const App = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 4000);
  }, []);

  const PubstarAdId = useMemo(() => {
    if (Platform.OS === 'ios') {
      return PubstarAdIdForIOS;
    }

    return PubstarAdIdForAndroid;
  }, []);

  async function onLoadAndShow(adId: string) {
    Pubstar.loadAndShowAd(adId, {
      onLoadError: errorCode => {
        console.error('[APP] Ad load error:', errorCode);
      },
      onLoaded: () => {
        console.log('[APP] Ad loaded successfully');
      },
      onAdHide: reward => {
        console.log('[APP] Ad hidden React', reward);
      },
      onAdShowed: () => {
        console.log('[APP] Ad showed React');
      },
      onShowError: errorCode => {
        console.error('[APP] Ad show error React:', errorCode);
      },
    });
  }

  function onShowLoadThenShow(adId: string) {
    Pubstar.loadAd(adId, {
      onLoadError: errorCode => {
        console.error('[APP] Ad load error:', errorCode);
      },
      onLoaded: () => {
        console.log('[APP] Ad loaded successfully');
        Pubstar.showAd(adId, {
          onAdHide: reward => {
            console.log('[APP] Ad hidden React', reward);
          },
          onAdShowed: () => {
            console.log('[APP] Ad showed React');
          },
          onShowError: errorCode => {
            console.error('[APP] Ad show error React:', errorCode);
          },
        });
      },
    });
  }

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} />

      <ScrollView>
        <View style={styles.container}>
          {show && (
            <PubstarAdView
              adId={PubstarAdId.BANNER}
              style={styles.ad}
              size="small"
              type="banner"
              onLoaded={() => {
                console.log('[APP] Banner ad loaded');
              }}
              onLoadedError={() => console.log('[APP] Banner ad load error')}
              onShowed={() => {
                console.log('[APP] Banner ad showed');
              }}
              onHide={() => console.log('[APP] Banner ad hidden')}
              onShowedError={() => console.log('[APP] Banner ad showed error')}
            />
          )}
          {show && (
            <PubstarAdView
              adId={PubstarAdId.NATIVE}
              style={styles.ad}
              size="medium"
              customConfig={customConfig}
              type="native"
              onLoaded={() => console.log('[APP] Native ad loaded')}
              onLoadedError={() => console.log('[APP] Native ad load error')}
              onShowed={() => console.log('[APP] Native ad showed')}
              onHide={() => console.log('[APP] Native ad hidden')}
              onShowedError={() => console.log('[APP] Native ad showed error')}
            />
          )}
          {show && (
            <PubstarAdView
              adId={PubstarAdId.VIDEO}
              style={styles.ad}
              size="medium"
              customConfig={customConfig}
              type="videoOutStream"
              media="https://storage.googleapis.com/gvabox/media/samples/stock.mp4"
              onLoaded={() => console.log('[APP] Video ad loaded')}
              onLoadedError={() => console.log('[APP] Video ad load error')}
              onShowed={() => console.log('[APP] Video ad showed')}
              onHide={() => console.log('[APP] Video ad hidden')}
              onShowedError={() => console.log('[APP] Video ad showed error')}
            />
          )}
          <Button
            title="Show Interstitial Ad"
            onPress={() => onLoadAndShow(PubstarAdId.INTERSTITIAL)}
          />
          <Button
            title="Show Open Ad"
            onPress={() => onLoadAndShow(PubstarAdId.OPEN)}
          />
          <Button
            title="Show Reward Ad"
            onPress={() => onLoadAndShow(PubstarAdId.REWARDED)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  ad: {
    backgroundColor: 'lightblue',
    height: 200,
  },
});

export default App;
