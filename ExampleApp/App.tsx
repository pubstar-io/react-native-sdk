import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Button,
  StyleSheet,
  Platform,
} from 'react-native';
import Pubstar, { NativeCustomConfig, PubstarAdView } from 'rtn-pubstar';

async function initRTNPubstar() {
  try {
    await Pubstar.initialization();
    console.log('[APP] Pubstar.initialization was successed');
  } catch (error) {
    console.error('[APP] Pubstar.initialization was failed with error', error);
  }
}

initRTNPubstar();

enum PubstarAdIdForIOS {
  BANNER = '1692/99228314092',
  NATIVE = '1692/99228314093',
  INTERSTITIAL = '1692/99228314089',
  OPEN = '1692/99228314090',
  REWARDED = '1692/99228314091',
}

enum PubstarAdIdForAndroid {
  BANNER = '1687/99228314074',
  NATIVE = '1687/99228314077',
  INTERSTITIAL = '1687/99228314068',
  OPEN = '1687/99228314075',
  REWARDED = '1687/99228314076',
}

const App = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 3000);
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
  },
});

export default App;
