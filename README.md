# 🐎 Horse Racing Game (At Yarışı Simülasyonu)

Vue.js 3 ve Vuex kullanılarak geliştirilmiş, gerçek zamanlı ve tur bazlı bir at yarışı simülasyon projesi. Bu uygulama, rastgele oluşturulan yarış programlarını, atların kondisyonlarına göre hesaplanan gerçekçi yarış performanslarını ve detaylı sonuç analizlerini içerir.

![Vue Version](https://img.shields.io/badge/vue-3.x-4FC08D?style=flat-square&logo=vue.js)
![State Management](https://img.shields.io/badge/vuex-4.x-blue?style=flat-square)
![Testing](https://img.shields.io/badge/jest-passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)

## 🚀 Özellikler

-   **Dinamik Program Oluşturma:** 20 atlık havuzdan rastgele seçim yapılarak, farklı mesafelerde (1200m - 2200m) 6 turluk turnuva programı oluşturulur.
-   **Gerçek Zamanlı Yarış Animasyonu:** Atların hareketleri, CSS transition ve JavaScript interval mantığıyla anlık olarak simüle edilir.
-   **Gelişmiş Algoritma:** Yarış sonucu sadece şansa bağlı değildir; atın **kondisyonu (condition)** ve **pist mesafesi** hesaba katılarak bir hız algoritması çalıştırılır.
-   **Detaylı Sonuç Tablosu:**
    -   Her tur sonunda 1.'den 10.'ya kadar tam sıralama listesi.
    -   İlk 3 derece için özel renkli (Altın, Gümüş, Bronz) gösterim.
    -   Bitiş süreleri (saniye cinsinden).
-   **Responsive & Modern UI:**
    -   CSS Grid ve Flexbox mimarisi.
    -   Arka planda tam ekran görsel, üzerinde okunaklı beyaz paneller.
-   **Test Kapsamı:**
    -   **Unit Test:** Jest ve Vue Test Utils ile bileşen ve store testleri.
    -   **E2E Test:** Cypress ile kullanıcı senaryosu testleri.

## 🛠 Kullanılan Teknolojiler

-   **Frontend:** Vue.js 3 (Options API)
-   **State Management:** Vuex 4
-   **Stil:** Özel CSS3 (Scoped), CSS Grid, Flexbox
-   **Test:** Jest, Vue Test Utils, Cypress
-   **Araçlar:** Vue CLI, Babel

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için terminali açıp aşağıdaki adımları izleyin:

### 1. Projeyi Klonlayın
git clone [https://github.com/alifpercin/horse-racing.git](https://github.com/alifpercin/horse-racing.git)
cd horse-racing

### 2. Gerekli Paketleri Yükleyin

npm install

### 3. Projeyi Uygulamayı Başlatın

npm run serve

Tarayıcınızda http://localhost:8080 adresine giderek uygulamayı görüntüleyebilirsiniz.

###Testleri Çalıştırma

Unit Testler için:
npm run test:unit

E2E Testler için:
npm run test:e2e

