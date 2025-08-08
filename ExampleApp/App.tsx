/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState } from 'react';
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
    await RTNPubstar?.initialization();
    console.log('RTNPubstar initialized');
  } catch (error) {
    console.error('Error initializing RTNPubstar:', error);
  }
}

initRTNPubstar();

const App = () => {
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

  async function onLoadThenShow() {
    await Pubstar.loadAd('1233/99228313582');
    await Pubstar.showAd('1233/99228313582');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} />

      <View style={styles.container}>
        <PubstarAdView
          adId="1233/99228313580"
          style={styles.ad}
          size="small"
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
        <Button
          title="Show Interstitial Ad"
          // onPress={() => onButtonClick('1233/99228313582')}
          onPress={onLoadThenShow}
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
  ad: {
    backgroundColor: 'lightblue',
  },
});

export default App;
