/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Pubstar, {PubstarAdView} from 'rtn-pubstar';

async function initRTNPubstar() {
  try {
    await Pubstar.initialization();
    console.log('RTNPubstar initialized');
  } catch (error) {
    console.error('Error initializing RTNPubstar:', error);
  }
}

initRTNPubstar();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'dark-content'} />

      <View style={styles.container}>
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
}

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
