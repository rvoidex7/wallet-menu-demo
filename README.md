# Wallet Menu Component

Bu proje, React Native & Web için geliştirilmiş, sürüklenebilir ve animasyonlu bir alt menü (bottom sheet) component'idir. Hem mobil uygulamalarda hem de web sitelerinde sorunsuz çalışacak şekilde tasarlanmıştır.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://wallet-menu-demo-z99y.vercel.app/)

## Hızlı Bakış

![Wallet Menu Demo GIF](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTFmMzVjMDI2YmMzZDIyYjQ4ZDYxYzg5ZGE5Y2EwYjliNTM2Y2QyZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2DD4aE5w4aY085nLq/giphy.gif)

*Not: Yukarıdaki GIF, component'in temel işlevselliğini göstermektedir.*

## 🚀 Temel Özellikler

- **Platform Bağımsız:** Hem iOS ve Android (React Native) hem de Web üzerinde çalışır.
- **Akıcı Animasyonlar:** `react-native-reanimated` ve `react-native-gesture-handler` kullanılarak 60 FPS'de çalışan akıcı açılıp kapanma ve genişleme animasyonları.
- **İnteraktif Jestler:** Menü, hem başlık (header) hem de içerik (content) alanından sürüklenerek kontrol edilebilir.
- **Yatay Kaydırma Desteği:** Menü içindeki kart listesi gibi yatay `ScrollView`'lar, dikey menü jestleriyle çakışmadan sorunsuz çalışır.
- **Dinamik Veri:** Menü içeriği, dışarıdan gönderilen bir `data` prop'u ile kolayca özelleştirilebilir.
- **Statik Dağıtım Uyumlu:** Vercel gibi statik site barındırma servislerinde doğru çalışması için "runtime"da boyut hesaplama mantığı içerir.

## 🛠️ Kullanılan Teknolojiler

- [React](https://reactjs.org/) & [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (Expo Router dahil)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/) (Dağıtım için)

## 🔧 Component Nasıl Kullanılır?

Bu component'i kendi projenize entegre etmek için aşağıdaki adımları izleyin.

### Adım 1: Component Dosyalarını Kopyalayın

`src/components/WalletMenu` klasörünü kendi projenizin `components` klasörüne kopyalayın.

### Adım 2: Gerekli Paketleri Yükleyin

Component'in çalışması için projenizde aşağıdaki paketlerin yüklü olduğundan emin olun:

```bash
npm install @expo/vector-icons react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

### Adım 3: Ekranda Kullanımı

Component'i kullanacağınız ekranın, jestlerin çalışması için `GestureHandlerRootView` ile sarmalanmış olması kritik öneme sahiptir.

Aşağıda temel bir kullanım örneği verilmiştir:

```tsx
// src/screens/MyScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WalletMenu from '../components/WalletMenu'; // Kopyaladığınız component'in yolu

// --- Menüye gönderilecek veri ---
const loyaltyCardsData = [
  { id: 1, name: 'Fambook Coffee & More', loyalty: { stamps: 3, maxStamps: 8 } },
  { id: 2, name: 'Paper Roasting Coffee', loyalty: { stamps: 7, maxStamps: 10 } },
  { id: 3, name: 'Kronotrop', loyalty: { stamps: 5, maxStamps: 9 } },
];

export default function MyScreen() {
  return (
    // 1. Jestlerin çalışması için en dış katmanı sarmalayın
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://.../background.jpg' }}
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Wallet Menu Demo</Text>
            </View>
        </SafeAreaView>

        {/* 2. Component'i çağırın ve veriyi 'data' prop'u ile gönderin */}
        <WalletMenu data={loyaltyCardsData} />
        
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  // ... diğer stilleriniz
});

```

## props API

### `data`

Menü içindeki sadakat kartlarını render etmek için kullanılan veri dizisi.

- **Tip:** `LoyaltyCardData[]`
- **Gerekli:** Evet

`LoyaltyCardData` objesinin yapısı şu şekilde olmalıdır:

```typescript
type LoyaltyCardData = {
  id: number | string;
  name: string;
  loyalty: {
    stamps: number;
    maxStamps: number;
  };
};
```

## 📦 Demo Projesini Yerel Olarak Çalıştırma

Bu demo repoyu klonlayıp yerel makinenizde çalıştırmak için:

```bash
# 1. Repoyu klonlayın
git clone https://github.com/rvoidex7/wallet-menu-demo.git

# 2. Proje dizinine gidin
cd wallet-menu-demo

# 3. Paketleri yükleyin
npm install

# 4. Geliştirme sunucusunu başlatın (Web için)
npm run web
```

## 🌐 Dağıtım (Deployment)

Bu proje, Expo for Web uygulamalarını Vercel'de dağıtmak için yapılandırılmıştır. `vercel.json` dosyası ve `package.json` içindeki `build` script'i, statik site çıktısı (`dist` klasörü) oluşturarak dağıtımı otomatikleştirir.
