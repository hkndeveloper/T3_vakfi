# T3 VAKFI - TOPLULUK YÖNETİM SİSTEMİ (v1.0)
## Teknik Tanıtım ve Fonksiyonel Durum Raporu

Bu belge, T3 Vakfı bünyesindeki toplulukların dijital ortamda merkezi bir strateji ile yönetilmesi, denetlenmesi ve veriye dayalı analiz edilmesi amacıyla geliştirilen platformun detaylı yeteneklerini ve teknik altyapısını özetler.

---

### 1. TEKNİK MİMARİ VE DİNAMİK YAPI
Sistem, modern web standartlarının en güncel sürümleri olan **Next.js 15+** ve **React 19** üzerine inşa edilmiştir. Statik yapılar yerine tamamen veriye dayalı (Data-Driven) bir mimari benimsenmiştir.

#### **Dinamik İşleyiş Detayları:**
*   **Gerçek Zamanlı Veri Sorgulama:** Arama çubukları ve filtreleme mekanizmaları `URL SearchParams` teknolojisini kullanır. Bu sayede kullanıcı arama yaptığında veritabanı sorgusu sunucu tarafında anlık olarak koşturulur ve sayfa yenilenmeden sonuçlar güncellenir.
*   **Tip Güvenli Form Yönetimi:** Tüm veri girişleri `Server Actions` ve React 19'un yeni `useActionState` kancası ile yönetilir. Bu, form gönderilirken kullanıcının sayfada donmasını engeller ve işlem sonucunda (başarı veya hata) anlık "Toast" bildirimleri sağlar.
*   **Merkezi Yetki Kontrolü (Middleware):** Kullanıcının sayfaya erişip erişemeyeceği daha sayfa yüklenmeden sunucu katmanında kontrol edilir. Yetkisiz erişimler otomatik olarak engellenir ve yönlendirilir.
*   **Dinamik Dashboard Analitiği:** Prisma ORM aracılığıyla PostgreSQL veritabanından çekilen canlı veriler; üye dağılımı, birim performansları ve operasyonel takvimi otomatik olarak görselleştirir.

---

### 2. DETAYLI ROL VE YETKİ MATRİSİ

#### **A. Süper Admin (Sistem Direktörü)**
*   **Birim Kurulumu:** Yeni üniversite ve toplulukların kurumsal kimlik bilgilerini sisteme tanımlama.
*   **Üst Düzey Denetim:** Başkanlar tarafından gönderilen tüm etkinlik ve raporları inceleme. "Revizyon Notu" bırakarak reddetme veya onaylama yetkisi.
*   **Ekosistem Analizi:** Vakıf genelindeki tüm toplulukların büyüme metriklerini ve faaliyet yoğunluklarını tek bir ekrandan izleme.
*   **Kullanıcı & Rol Yönetimi:** Sisteme kayıtlı herkesin rolünü değiştirme, aktiflik durumunu (soft-delete) yönetme ve yetkilerini denetleme.

#### **B. Topluluk Başkanı (Birim Yöneticisi)**
*   **Operasyon Planlama:** Birim adına yapılacak faaliyetleri "Etkinlik Formu" ile sistem onayına sunma.
*   **Kurumsal Belgelendirme:** Tamamlanan faaliyetler için detaylı rapor yazımı, katılımcı sayısı girişi ve medya kanıtlarının (fotoğraflar, belgeler) sisteme işlenmesi.
*   **Birim İstatistikleri:** Kendi topluluğunun üye artışını ve etkinlik geçmişini analiz etme.
*   **Üye Yönetimi:** Topluluğa katılmak isteyen kullanıcıların listelenmesi ve takibi.

#### **C. Yönetim Ekibi (Operasyon Destek)**
*   **İçerik Hazırlığı:** Etkinlik taslaklarını oluşturma ve medya galerisine içerik yükleme.
*   **Rapor Yazımı:** Faaliyetlerin kurumsal standartlarda özetlenerek sisteme girişini sağlama.

#### **D. Üye (Katılımcı)**
*   **Duyuru Takibi:** Vakıf ve topluluk tarafından yayınlanan önemli bildirimlerden anında haberdar olma.
*   **Etkinlik Ajandası:** Topluluğun onaylanmış etkinliklerini görüntüleme ve katılım durumunu takip etme.
*   **Dijital Kimlik:** Profil sayfası üzerinden akademik bilgilerini, yetkinliklerini ve iletişim verilerini güncel tutma.

---

### 3. DİNAMİK BİLDİRİM SİSTEMİ
Sistem, hiyerarşik onay akışını destekleyen akıllı bir bildirim merkezine sahiptir:
*   Bir etkinlik onaylandığında veya reddedildiğinde başkana anlık bildirim gider.
*   Rapor revizyon talepleri ilgili birime otomatik iletilir.
*   Bildirimler okundu olarak işaretlenebilir ve kullanıcının rolüne göre doğru yönetim paneline yönlendirilir.

---

### 4. TEST HESAPLARI (GÜNCEL)

| Rol | E-Posta | Şifre |
| :--- | :--- | :--- |
| **Süper Admin** | `admin@t3.org.tr` | `Admin12345!` |
| **Başkan** | `baskan@t3.org.tr` | `Baskan12345!` |
| **Yönetim** | `yonetim@t3.org.tr` | `Yonetim12345!` |
| **Üye** | `uye@t3.org.tr` | `Uye12345!` |

---

### 5. GELECEK GELİŞTİRMELER (BACKLOG)
*   **Medya Arşivi Silme:** Yüklenen görsellerin tek tıkla sistemden kalıcı olarak temizlenmesi.
*   **Gelişmiş Filtreleme:** Üye listelerinde daha karmaşık (birden fazla parametreye dayalı) sorgulama yetenekleri.
*   **SMTP Entegrasyonu:** Şifre sıfırlama ve sistem uyarılarının e-posta olarak gönderilmesi.
