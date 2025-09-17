import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, ScrollView, Dimensions, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// --- Dimensions and Constants ---
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 80;
const CLOSED_SHEET_WIDTH = 256;
const OPEN_SHEET_WIDTH = SCREEN_WIDTH > 400 ? 380 : SCREEN_WIDTH - 40;
const CLOSED_POSITION = 0;

// --- Mock Data ---
const coffeeShops = [
  { id: 1, name: 'Fambook Coffee & More', loyalty: { stamps: 3, maxStamps: 8 } },
  { id: 2, name: 'Paper Roasting Coffee', loyalty: { stamps: 7, maxStamps: 10 } },
  { id: 3, name: 'Kronotrop', loyalty: { stamps: 5, maxStamps: 9 } },
];

// --- Main App Screen ---
export default function App() {
  const insets = useSafeAreaInsets();

  const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;
  const OPEN_POSITION = -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT;

  const dragY = useRef(new Animated.Value(CLOSED_POSITION)).current;
  const lastDragY = useRef(CLOSED_POSITION);

  const onGestureEvent = Animated.event([{ nativeEvent: { translationY: dragY } }], { useNativeDriver: false });

  const animateToPosition = (toValue) => {
    lastDragY.current = toValue;
    Animated.spring(dragY, { toValue: toValue, useNativeDriver: false, friction: 8 }).start();
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      dragY.setOffset(lastDragY.current);
      dragY.setValue(0);
    } else if (event.nativeEvent.state === State.END) {
      dragY.flattenOffset();
      const { translationY, velocityY } = event.nativeEvent;
      const dragAmount = lastDragY.current + translationY;

      // Hızlıca yukarı kaydırıldıysa AÇ
      if (velocityY < -1000) {
        animateToPosition(OPEN_POSITION);
        return;
      }
      
      // Yavaşça yarıdan fazla kaydırıldıysa AÇ
      if (dragAmount < OPEN_POSITION / 2) {
        animateToPosition(OPEN_POSITION);
      } 
      // Değilse KAPAT
      else {
        animateToPosition(CLOSED_POSITION);
      }
    }
  };

  const translateY = dragY;

  const animatedWidth = translateY.interpolate({
    inputRange: [OPEN_POSITION, CLOSED_POSITION],
    outputRange: [OPEN_SHEET_WIDTH, CLOSED_SHEET_WIDTH],
    extrapolate: 'clamp',
  });

  const animatedMarginLeft = translateY.interpolate({
    inputRange: [OPEN_POSITION, CLOSED_POSITION],
    outputRange: [-(OPEN_SHEET_WIDTH / 2), -(CLOSED_SHEET_WIDTH / 2)],
    extrapolate: 'clamp',
  });

  const backdropOpacity = translateY.interpolate({
    inputRange: [OPEN_POSITION, CLOSED_POSITION],
    outputRange: [0.5, 0],
    extrapolate: 'clamp'
  });

  const backdropPointerEvents = lastDragY.current === OPEN_POSITION ? 'auto' : 'none';

  const handleHeaderTap = () => {
    if (lastDragY.current === OPEN_POSITION) {
      animateToPosition(CLOSED_POSITION);
    } else {
      animateToPosition(OPEN_POSITION);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1551734316-27e4a1a56f77?q=80&w=1974&auto=format&fit=crop' }}
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.infoText}>Aşağıdaki Cüzdan Menüsünü Yukarı Kaydırın</Text>
            </View>
        </SafeAreaView>

        <Animated.View 
            style={[styles.backdrop, { opacity: backdropOpacity }]} 
            pointerEvents={backdropPointerEvents}
        >
            <TouchableWithoutFeedback onPress={() => animateToPosition(CLOSED_POSITION)}>
                <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View style={[ styles.sheet, {
            height: SHEET_MAX_HEIGHT,
            top: SCREEN_HEIGHT - SHEET_MIN_HEIGHT - insets.bottom,
            width: animatedWidth,
            marginLeft: animatedMarginLeft,
            transform: [{ translateY }]
        }]}>
            <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                <TouchableOpacity activeOpacity={0.9} onPress={handleHeaderTap}>
                    <View style={styles.sheetHeader}>
                        <View style={styles.walletBarLines}><View style={styles.walletBarLine} /><View style={styles.walletBarLine} /></View>
                        <Text style={styles.walletBarText}>Cüzdan</Text>
                    </View>
                </TouchableOpacity>
            </PanGestureHandler>
            
            <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange} activeOffsetY={[-20, 20]} failOffsetX={[-25, 25]}>
                <View style={styles.sheetContentContainer}>
                    <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false} style={styles.loyaltyCardsContainer}>
                        {coffeeShops.map(shop => (
                            <TouchableOpacity key={shop.id} style={[styles.loyaltyCard, {width: CLOSED_SHEET_WIDTH - 32}]}>
                                <Text style={styles.loyaltyCardShopName}>{shop.name}</Text>
                                <View style={styles.stampsContainer}>{ [...Array(shop.loyalty.maxStamps)].map((_, i) => ( <View key={i} style={[styles.stamp, i < shop.loyalty.stamps ? styles.stampFilled : {}]} /> )) }</View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.qrCodeSection}>
                        <Text style={styles.qrCodeTitle}>QR Kodum</Text>
                        <View style={styles.qrCodeContainer}><Ionicons name="qr-code" size={100} color="#634832" /></View>
                    </View>
                </View>
            </PanGestureHandler>
        </Animated.View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181b' },
  infoText: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,1)', zIndex: 5 },
  sheet: { position: 'absolute', left: '50%', backgroundColor: '#634832', borderTopLeftRadius: 16, borderTopRightRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 20, zIndex: 10 },
  sheetHeader: { height: SHEET_MIN_HEIGHT, width: '100%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 },
  walletBarText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  walletBarLines: { marginTop: 8 },
  walletBarLine: { width: 96, height: 4, backgroundColor: 'rgba(252, 211, 77, 0.3)', borderRadius: 2, marginBottom: 4 },
  sheetContentContainer: { flex: 1, alignItems: 'center', width: '100%', paddingTop: 10, overflow: 'hidden' },
  loyaltyCardsContainer: { flexGrow: 0, maxHeight: 180, width: '100%', paddingHorizontal: 16 },
  loyaltyCard: { backgroundColor: '#4a3728', borderRadius: 16, padding: 16, height: 160, justifyContent: 'space-between', marginRight: 10 },
  loyaltyCardShopName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  stampsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  stamp: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(252, 211, 77, 0.2)', borderWidth: 1, borderColor: 'rgba(252, 211, 77, 0.4)', margin: 3 },
  stampFilled: { backgroundColor: '#fcd4d' },
  qrCodeSection: { flex: 1, width: '100%', alignItems: 'center', marginTop: 24 },
  qrCodeTitle: { fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 12 },
  qrCodeContainer: { width: 140, aspectRatio: 1, backgroundColor: 'white', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }
});
