
import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Animated, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// --- Dimensions and Constants ---
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 80;
const CLOSED_SHEET_WIDTH = 256;
const OPEN_SHEET_WIDTH = SCREEN_WIDTH - 40;
const CLOSED_POSITION = 0;

// --- Mock Data & Components ---
type CoffeeShop = { id: number; name: string; coordinate: { latitude: number; longitude: number; }; loyalty: { stamps: number; maxStamps: number; }; };
const coffeeShops: CoffeeShop[] = [
  {
    id: 1,
    name: 'Fambook Coffee & More',
    coordinate: { latitude: 39.8986, longitude: 32.8256 },
    loyalty: { stamps: 3, maxStamps: 8 },
  },
  {
    id: 2,
    name: 'Paper Roasting Coffee & Chocolate',
    coordinate: { latitude: 39.9167, longitude: 32.8222 },
    loyalty: { stamps: 7, maxStamps: 10 },
  },
  {
    id: 3,
    name: 'Kronotrop',
    coordinate: { latitude: 39.9056, longitude: 32.8631 },
    loyalty: { stamps: 5, maxStamps: 9 },
  },
  {
    id: 4,
    name: 'Amelie\'s Garden',
    coordinate: { latitude: 39.8924, longitude: 32.8596 },
    loyalty: { stamps: 8, maxStamps: 10 },
  },
  {
    id: 5,
    name: 'Rispetto Coffee Co.',
    coordinate: { latitude: 39.8821, longitude: 32.6953 },
    loyalty: { stamps: 2, maxStamps: 8 },
  },
];
const UserIcon = () => <Text style={styles.iconText}>U</Text>;
const SettingsIcon = () => <Text style={styles.iconText}>S</Text>;
const CoffeeBeanIcon = () => <Text style={styles.iconText}>☕️</Text>;
const TicketIcon = () => <Text>🎟️</Text>;
const PercentIcon = () => <Text>%</Text>;
const BinocularsIcon = () => <Text>🔭</Text>;

const FloatingMenu: React.FC<{ onMenuItemClick: (type: string) => void }> = ({ onMenuItemClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const animation = React.useRef(new Animated.Value(0)).current;
    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, { toValue, friction: 5, useNativeDriver: true }).start();
        setIsOpen(!isOpen);
    };
    const firstX = animation.interpolate({ inputRange: [0, 1], outputRange: [0, -65] });
    const firstY = animation.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
    const secondY = animation.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
    const thirdX = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 65] });
    const thirdY = animation.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
    const rotation = animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });
    const opacity = animation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1]});
    return (
        <View style={styles.floatingMenuContainer}>
            <Animated.View style={[styles.floatingButtonWrapper, { opacity, transform: [{ translateX: firstX }, { translateY: firstY }] }]}><TouchableOpacity style={styles.floatingButton} onPress={() => onMenuItemClick('events')}><TicketIcon /></TouchableOpacity></Animated.View>
            <Animated.View style={[styles.floatingButtonWrapper, { opacity, transform: [{ translateY: secondY }] }]}><TouchableOpacity style={styles.floatingButton} onPress={() => onMenuItemClick('campaigns')}><PercentIcon /></TouchableOpacity></Animated.View>
            <Animated.View style={[styles.floatingButtonWrapper, { opacity, transform: [{ translateX: thirdX }, { translateY: thirdY }] }]}><TouchableOpacity style={styles.floatingButton} onPress={() => onMenuItemClick('tasks')}><BinocularsIcon /></TouchableOpacity></Animated.View>
            <TouchableOpacity onPress={toggleMenu} style={styles.floatingButtonMain}><Animated.View style={{transform: [{rotate: rotation}]}}><CoffeeBeanIcon /></Animated.View></TouchableOpacity>
        </View>
    );
};

const BaseSheet: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}><TouchableOpacity style={styles.sheetBackdrop} onPress={onClose} activeOpacity={1} /><View style={styles.sheetContainer}>{children}</View></Modal>;
};

// --- Main App Screen ---
export default function IndexScreen() {
  const insets = useSafeAreaInsets();

  const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;
  const OPEN_POSITION = -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT;

  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  
  const dragY = useRef(new Animated.Value(CLOSED_POSITION)).current;
  const lastDragY = useRef(CLOSED_POSITION);
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    { useNativeDriver: false }
  );
  
  const animateToPosition = (toValue: number) => {
    lastDragY.current = toValue;
    Animated.spring(dragY, {
        toValue: toValue,
        useNativeDriver: false,
        friction: 8,
    }).start();
  }

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
        dragY.setOffset(lastDragY.current);
        dragY.setValue(0);
    }
    else if (event.nativeEvent.state === State.END) {
        const { translationY, velocityY } = event.nativeEvent;
        dragY.flattenOffset();
        const finalPosition = lastDragY.current + translationY;
        const projectedPosition = finalPosition + 0.2 * velocityY;
      
        if (projectedPosition < OPEN_POSITION / 2 || velocityY < -500) {
            animateToPosition(OPEN_POSITION);
        } else {
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
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const backdropPointerEvents = lastDragY.current === OPEN_POSITION ? 'auto' : 'none';

  const handleHeaderTap = () => {
      if (lastDragY.current === OPEN_POSITION) {
          animateToPosition(CLOSED_POSITION);
      } else {
          animateToPosition(OPEN_POSITION);
      }
  }

  const handleSelectShop = useCallback((shop: CoffeeShop) => {
    animateToPosition(CLOSED_POSITION);
    setTimeout(() => setSelectedShop(shop), 300);
  }, []);

  const handleCloseShopSheet = useCallback(() => setSelectedShop(null), []);
  const handleFloatingMenuItemClick = (type: string) => setActiveSheet(type);
  const handleCloseActiveSheet = () => setActiveSheet(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={{ latitude: 39.905, longitude: 32.83, latitudeDelta: 0.06, longitudeDelta: 0.06 }}>
            {coffeeShops.map((shop) => ( <Marker key={shop.id} coordinate={shop.coordinate} title={shop.name} onPress={() => handleSelectShop(shop)} /> ))}
        </MapView>
        
        <Animated.View 
            style={[styles.backdrop, { opacity: backdropOpacity }]} 
            pointerEvents={backdropPointerEvents}
        >
            <TouchableWithoutFeedback onPress={() => animateToPosition(CLOSED_POSITION)}>
                <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
        </Animated.View>

        <SafeAreaView style={styles.header}><TouchableOpacity style={styles.iconButton}><UserIcon /></TouchableOpacity><TouchableOpacity style={styles.iconButton}><SettingsIcon /></TouchableOpacity></SafeAreaView>
        
        <FloatingMenu onMenuItemClick={handleFloatingMenuItemClick} />
        <BaseSheet isOpen={!!selectedShop} onClose={handleCloseShopSheet}>{selectedShop && ( <><Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>{selectedShop.name}</Text><Text style={styles.sheetSubtitle}>Stamps: {selectedShop.loyalty.stamps} / {selectedShop.loyalty.maxStamps}</Text></> )}</BaseSheet>

        <Animated.View style={[ styles.sheet, { 
            height: SHEET_MAX_HEIGHT,
            top: SCREEN_HEIGHT - SHEET_MIN_HEIGHT - insets.bottom+48,
            width: animatedWidth, 
            marginLeft: animatedMarginLeft, 
            transform: [{ translateY }] 
        } ]}>
            <PanGestureHandler 
                onGestureEvent={onGestureEvent} 
                onHandlerStateChange={onHandlerStateChange}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={handleHeaderTap}>
                    <View style={styles.sheetHeader}><View style={styles.walletBarLines}><View style={styles.walletBarLine} /><View style={styles.walletBarLine} /></View><Text style={styles.walletBarText}>Cüzdan</Text></View>
                </TouchableOpacity>
            </PanGestureHandler>
            
            <PanGestureHandler
                onGestureEvent={onGestureEvent} 
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetY={[-20, 20]}
                failOffsetX={[-25, 25]}
            >
                <View style={styles.sheetContentContainer}>
                    <ScrollView bounces={false} horizontal showsHorizontalScrollIndicator={false} style={styles.loyaltyCardsContainer}>
                        {coffeeShops.map(shop => (
                            <TouchableOpacity key={shop.id} style={[styles.loyaltyCard, {width: CLOSED_SHEET_WIDTH - 32}]} onPress={() => handleSelectShop(shop)}>
                                <Text style={styles.loyaltyCardShopName}>{shop.name}</Text>
                                <View style={styles.stampsContainer}>{ [...Array(shop.loyalty.maxStamps)].map((_, i) => ( <View key={i} style={[styles.stamp, i < shop.loyalty.stamps ? styles.stampFilled : {}]} /> )) }</View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.qrCodeSection}><Text style={styles.qrCodeTitle}>QR Kodum</Text><View style={styles.qrCodeContainer}><Ionicons name="qr-code" size={100} color="#634832" /></View></View>
                </View>
            </PanGestureHandler>
        </Animated.View>

        <BaseSheet isOpen={!!activeSheet} onClose={handleCloseActiveSheet}>{activeSheet && ( <><Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>{activeSheet.charAt(0).toUpperCase() + activeSheet.slice(1)}</Text><Text style={styles.sheetSubtitle}>Bu özellik yakında sizlerle!</Text></> )}</BaseSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181b' },
  map: { ...StyleSheet.absoluteFillObject },
  backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 5,
  },
  header: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(39, 39, 42, 0.8)', justifyContent: 'center', alignItems: 'center' },
  iconText: { color: 'white', fontSize: 20 },
  floatingMenuContainer: { position: 'absolute', bottom: 100, left: '50%', marginLeft: -40, width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  floatingButtonWrapper: { position: 'absolute' },
  floatingButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  floatingButtonMain: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 6, zIndex: 1 },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  sheetContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', backgroundColor: '#1f2937', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10 },
  sheetSubtitle: { fontSize: 18, color: '#9ca3af', marginBottom: 24 },
  sheet: {
    position: 'absolute',
    left: '50%',
    backgroundColor: '#634832',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 20,
    zIndex: 10,
  },
  sheetHeader: { height: SHEET_MIN_HEIGHT, width: '100%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 0 },
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
  qrCodeContainer: { 
    width: 140, 
    aspectRatio: 1,
    backgroundColor: 'white', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 24 
  }
});
