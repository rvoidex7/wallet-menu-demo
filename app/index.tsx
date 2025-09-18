import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import WalletMenu from '../components/WalletMenu';

// --- Mock Data ---
const coffeeShopsData = [
  { id: 1, name: 'Fambook Coffee & More', loyalty: { stamps: 3, maxStamps: 8 } },
  { id: 2, name: 'Paper Roasting Coffee', loyalty: { stamps: 7, maxStamps: 10 } },
  { id: 3, name: 'Kronotrop', loyalty: { stamps: 5, maxStamps: 9 } },
  { id: 4, name: 'Amelie\'s Garden', loyalty: { stamps: 8, maxStamps: 10 } },
  { id: 5, name: 'Rispetto Coffee Co.', loyalty: { stamps: 2, maxStamps: 8 } },
];

// --- Main App Screen ---
export default function IndexPage() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1551734316-27e4a1a56f77?q=80&w=1974&auto=format&fit=crop' }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Scroll up menu</Text>
            </View>
        </SafeAreaView>

        <WalletMenu data={coffeeShopsData} />
        
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'rgba(255, 184, 92, 0.5)' 
  },
  safeArea: {
    flex: 1,
  },
  infoContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  infoText: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    padding: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 10 
  },
});
