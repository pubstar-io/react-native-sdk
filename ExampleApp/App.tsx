/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Button,
  StyleSheet,
} from 'react-native';
import Pubstar, { PubstarAdView } from 'rtn-pubstar';

async function initRTNPubstar() {
  console.log('initRTNPubstar called');
  try {
    await Pubstar.initialization();
    console.log('RTNPubstar initialized');
  } catch (error) {
    console.error('Error initializing RTNPubstar:', error);
  }
}

initRTNPubstar();

const App = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 3000);
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

  async function onShowLoadThenShow(adId: string) {
    await Pubstar.loadAd(adId, {
      onLoadError: errorCode => {
        console.error('[APP] Ad load error:', errorCode);
      },
      onLoaded: () => {
        console.log('[APP] Ad loaded successfully');
      },
    });
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
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} />

      <View style={styles.container}>
        {show && (
          <PubstarAdView
            adId="1256/99228313636"
            style={styles.ad}
            size="medium"
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
            adId="1256/99228313638"
            style={styles.ad}
            size="medium"
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
          onPress={() => onLoadAndShow('1256/99228313634')}
        />
        <Button
          title="Show Open Ad"
          onPress={() => onLoadAndShow('1256/99228313637')}
        />
        <Button
          title="Show Reward Ad"
          onPress={() => onLoadAndShow('1233/99228313584')}
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
