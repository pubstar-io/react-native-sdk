/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { use, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Button,
  StyleSheet,
} from 'react-native';
import RTNPubstar from 'rtn-pubstar/js/NativeRTNPubstar';
import Pubstar from 'rtn-pubstar/js/Pubstar';
import PubstarAdView from 'rtn-pubstar/js/PubstarAdView';

async function initRTNPubstar() {
  try {
    await RTNPubstar?.init();
    console.log('RTNPubstar initialized');
  } catch (error) {
    console.error('Error initializing RTNPubstar:', error);
  }
}

initRTNPubstar();

const App = () => {
  const [height, setHeight] = useState(100);

  useEffect(() => {
    setTimeout(() => {
      setHeight(101);
    }, 2000);
  }, []);

  async function onButtonClick(adId: string) {
    Pubstar.loadAndShowAd(
      adId,
      {
        onError: errorCode => {
          console.error('Ad load error:', errorCode);
        },
        onLoaded: () => {
          console.log('Ad loaded successfully');
        },
      },
      {
        onAdHide: reward => {
          console.log('Ad hidden', reward);
        },
        onAdShowed: () => {
          console.log('Ad showed');
        },
        onError: errorCode => {
          console.error('Ad show error:', errorCode);
        },
      },
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} />

      <View style={styles.container}>
        <PubstarAdView
          adId="1233/99228313580"
          style={{ width: '100%', height: height, backgroundColor: 'lightgray' }}
          size="small"
          type="banner"
          onAdRendered={() => console.log('Banner ad rendered')}
          onLoaded={() => console.log('Banner ad loaded')}
        />
        <PubstarAdView
          adId="1233/99228313581"
          style={{ width: '100%', height: height, backgroundColor: 'lightgray' }}
          size="small"
          type="native"
          onAdRendered={() => console.log('Native ad rendered')}
          onLoaded={() => console.log('Native ad loaded')}
        />
        <Button
          title="Show Interstitial Ad"
          onPress={() => onButtonClick('1233/99228313582')}
        />
        <Button
          title="Show Open Ad"
          onPress={() => onButtonClick('1233/99228313583')}
        />
        <Button
          title="Show Reward Ad"
          onPress={() => onButtonClick('1233/99228313584')}
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
});

export default App;
