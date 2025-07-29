/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { use } from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Text, Button } from 'react-native';
import RTNPubstar from 'rtn-pubstar/js/NativeRTNPubstar';

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
  const [result, setResult] = useState<number | null>(null);

  // useEffect(() => {
  //   initRTNPubstar();
  // }, []);

  async function onButtonClick() {
    RTNPubstar?.loadAndShow('1233/99228313584');
    
    const value = await RTNPubstar?.add(3, 7);
    console.log('Result:', value);
    setResult(value ?? null);
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <Text style={{ marginLeft: 20, marginTop: 20 }}>
        3+7={result ?? '??'}
      </Text>
      <Button title="Compute" onPress={onButtonClick} />
    </SafeAreaView>
  );
};

export default App;
