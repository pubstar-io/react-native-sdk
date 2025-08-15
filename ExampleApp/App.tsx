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
import Pubstar from 'rtn-pubstar/js/Pubstar';
import PubstarAdView from 'rtn-pubstar/js/PubstarAdView';

async function initRTNPubstar() {
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
        console.error('Ad load error:', errorCode);
      },
      onLoaded: () => {
        console.log('Ad loaded successfully');
      },
      onAdHide: reward => {
        console.log('Ad hidden React', reward);
      },
      onAdShowed: () => {
        console.log('Ad showed React');
      },
      onShowError: errorCode => {
        console.error('Ad show error React:', errorCode);
      },
    });
  }

  async function onShowLoadThenShow(adId: string) {
    await Pubstar.loadAd(adId, {
      onLoadError: errorCode => {
        console.error('REACT NATIVE: Ad load error:', errorCode);
      },
      onLoaded: () => {
        console.log('REACT NATIVE: Ad loaded successfully');
      },
    });
    Pubstar.showAd(adId, {
      onAdHide: reward => {
        console.log('REACT NATIVE: Ad hidden React', reward);
      },
      onAdShowed: () => {
        console.log('REACT NATIVE: Ad showed React');
      },
      onShowError: errorCode => {
        console.error('REACT NATIVE: Ad show error React:', errorCode);
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} />

      <View style={styles.container}>
        {show && (
          <PubstarAdView
            adId="1233/99228313580"
            style={styles.ad}
            size="medium"
            type="banner"
            onLoaded={() => {
              console.log('Banner ad loaded');
            }}
            onLoadedError={() => console.log('Banner ad load error')}
            onShowed={() => {
              console.log('Banner ad showed');
            }}
            onHide={() => console.log('Banner ad hidden')}
            onShowedError={() => console.log('Banner ad showed error')}
          />
        )}
        {show && (
          <PubstarAdView
            adId="1233/99228313581"
            style={styles.ad}
            size="medium"
            type="native"
            onLoaded={() => console.log('Native ad loaded')}
            onLoadedError={() => console.log('Native ad load error')}
            onShowed={() => console.log('Native ad showed')}
            onHide={() => console.log('Native ad hidden')}
            onShowedError={() => console.log('Native ad showed error')}
          />
        )}
        <Button
          title="Show Interstitial Ad"
          onPress={() => onShowLoadThenShow('1233/99228313582')}
        />
        <Button
          title="Show Open Ad"
          onPress={() => onLoadAndShow('1233/99228313583')}
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
    padding: 16,
    gap: 16,
  },
  ad: {
    backgroundColor: 'lightblue',
  },
});

export default App;