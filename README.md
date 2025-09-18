# Wallet Menu Component

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://wallet-menu-demo-z99y.vercel.app/)


![wallet menu2](https://github.com/user-attachments/assets/4a4c3c07-5179-452a-9c4d-063007ca4133)


<br />

<details>
<summary>🇬🇧 English</summary>
<br>

This project is a draggable and animated bottom sheet component developed for React Native & Web. It is designed to work seamlessly in both mobile applications and websites.

### 🚀 Key Features

- **Platform Independent:** Works on both iOS & Android (React Native) and the Web.
- **Fluent Animations:** Smooth open/close and expansion animations running at 60 FPS, built with `react-native-reanimated` and `react-native-gesture-handler`.
- **Interactive Gestures:** The menu can be controlled by dragging from both the header and the content area.
- **Horizontal Scroll Support:** Horizontal `ScrollView`s, like the card list inside the menu, work without conflicting with the vertical menu gestures.
- **Dynamic Data:** The menu content can be easily customized via a `data` prop passed from outside.
- **Static Deployment Friendly:** Includes logic for runtime dimension calculation to ensure it works correctly on static hosting services like Vercel.

### 🛠️ Technologies Used

- [React](https://reactjs.org/) & [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (including Expo Router)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/) (for Deployment)

### 🔧 How to Use the Component?

Follow the steps below to integrate this component into your own project.

#### Step 1: Copy the Component Files

Copy the `src/components/WalletMenu` directory into your project's `components` directory.

#### Step 2: Install Required Packages

Ensure that the following packages are installed in your project for the component to work:

```bash
npm install @expo/vector-icons react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

#### Step 3: Usage in a Screen

It is crucial that the screen where you use the component is wrapped with `GestureHandlerRootView` for gestures to work correctly.

Below is a basic usage example:

```tsx
// src/screens/MyScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WalletMenu from '../components/WalletMenu'; // Path to the component you copied

// --- Data to be passed to the menu ---
const loyaltyCardsData = [
  { id: 1, name: 'Fambook Coffee & More', loyalty: { stamps: 3, maxStamps: 8 } },
  { id: 2, name: 'Paper Roasting Coffee', loyalty: { stamps: 7, maxStamps: 10 } },
  { id: 3, name: 'Kronotrop', loyalty: { stamps: 5, maxStamps: 9 } },
];

export default function MyScreen() {
  return (
    // 1. Wrap the outermost layer for gestures to work
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

        {/* 2. Call the component and pass the data via the 'data' prop */}
        <WalletMenu data={loyaltyCardsData} />
        
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  // ... your other styles
});
```

### Props API

#### `data`

An array of data used to render the loyalty cards inside the menu.

- **Type:** `LoyaltyCardData[]`
- **Required:** Yes

The structure of the `LoyaltyCardData` object should be as follows:

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

### 📦 Running the Demo Project Locally

To clone this demo repository and run it on your local machine:

```bash
# 1. Clone the repository
git clone https://github.com/rvoidex7/wallet-menu-demo.git

# 2. Navigate to the project directory
cd wallet-menu-demo

# 3. Install the packages
npm install

# 4. Start the development server (for Web)
npm run web
```

### 🌐 Deployment

This project is configured for deploying Expo for Web applications on Vercel. The `vercel.json` file and the `build` script in `package.json` automate the deployment by generating a static site output (in the `dist` folder).

</details>

<details>
<summary>🇹🇷 Türkçe</summary>
<br>

Bu proje, React Native & Web için geliştirilmiş, sürüklenebilir ve animasyonlu bir alt menü (bottom sheet) component'idir. Hem mobil uygulamalarda hem de web sitelerinde sorunsuz çalışacak şekilde tasarlanmıştır.

### 🚀 Temel Özellikler

- **Platform Bağımsız:** Hem iOS ve Android (React Native) hem de Web üzerinde çalışır.
- **Akıcı Animasyonlar:** `react-native-reanimated` ve `react-native-gesture-handler` kullanılarak 60 FPS'de çalışan akıcı açılıp kapanma ve genişleme animasyonları.
- **İnteraktif Jestler:** Menü, hem başlık (header) hem de içerik (content) alanından sürüklenerek kontrol edilebilir.
- **Yatay Kaydırma Desteği:** Menü içindeki kart listesi gibi yatay `ScrollView`'lar, dikey menü jestleriyle çakışmadan sorunsuz çalışır.
- **Dinamik Veri:** Menü içeriği, dışarıdan gönderilen bir `data` prop'u ile kolayca özelleştirilebilir.
- **Statik Dağıtım Uyumlu:** Vercel gibi statik site barındırma servislerinde doğru çalışması için "runtime"da boyut hesaplama mantığı içerir.

### 🛠️ Kullanılan Teknolojiler

- [React](https://reactjs.org/) & [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (Expo Router dahil)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/) (Dağıtım için)

### 🔧 Component Nasıl Kullanılır?

Bu component'i kendi projenize entegre etmek için aşağıdaki adımları izleyin.

#### Adım 1: Component Dosyalarını Kopyalayın

`src/components/WalletMenu` klasörünü kendi projenizin `components` klasörüne kopyalayın.

#### Adım 2: Gerekli Paketleri Yükleyin

Component'in çalışması için projenizde aşağıdaki paketlerin yüklü olduğundan emin olun:

```bash
npm install @expo/vector-icons react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

#### Adım 3: Ekranda Kullanımı

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

### props API

#### `data`

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

### 📦 Demo Projesini Yerel Olarak Çalıştırma

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

### 🌐 Dağıtım (Deployment)

Bu proje, Expo for Web uygulamalarını Vercel'de dağıtmak için yapılandırılmıştır. `vercel.json` dosyası ve `package.json` içindeki `build` script'i, statik site çıktısı (`dist` klasörü) oluşturarak dağıtımı otomatikleştirir.

</details>
