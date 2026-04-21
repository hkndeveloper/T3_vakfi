# T3 VAKFI - TOPLULUK YÖNETİM SİSTEMİ (v1.0)
## Teknik Tanıtım ve Durum Raporu

Bu belge, T3 Vakfı bünyesindeki toplulukların dijital ortamda merkezi bir strateji ile yönetilmesi, denetlenmesi ve veriye dayalı analiz edilmesi amacıyla geliştirilen platformun mevcut durumunu özetler.

---

### 1. SİSTEM GENEL BAKIŞI
Sistem; **Next.js 15+**, **React 19**, **Prisma ORM** ve **PostgreSQL** teknolojileri kullanılarak inşa edilmiştir. "Corporate Chic" tasarım diliyle hazırlanan arayüz, yüksek performanslı ve tam mobil uyumlu bir kullanıcı deneyimi sunar. Role Dayalı Erişim Kontrolü (RBAC) sayesinde her kullanıcı sadece kendi yetki alanı dahilindeki verilere erişebilir.

---

### 2. DİNAMİK VE OPERASYONEL ÖZELLİKLER (BACKEND BAĞLANTILI)
Şu anki sistemde aşağıdaki özellikler tamamen veritabanı bağlantılı ve fonksiyoneldir:

*   **Merkezi Kimlik Doğrulama (Auth):** NextAuth entegrasyonu ile güvenli giriş/çıkış ve oturum yönetimi.
*   **Analitik Dashboard:** Admin ve Başkan panellerindeki istatistikler (üye sayıları, etkinlik verimliliği, birim dağılımı vb.) Prisma üzerinden canlı verilerle beslenmektedir.
*   **Kurumsal Birim Yönetimi (CRUD):** Üniversite ve topluluk ekleme, listeleme ve filtreleme işlemleri tamamen dinamiktir.
*   **Operasyonel Onay Mekanizması:** 
    *   **Etkinlik Onayları:** Başkanların oluşturduğu etkinlikler admin paneline düşer, admin tarafından reddedilebilir veya onaylanabilir.
    *   **Rapor Denetimi:** Faaliyet raporlarının kurumsal hiyerarşide denetlenmesi ve revizyon süreci.
*   **Bildirim Merkezi:** Kullanıcı rollerine göre özelleştirilmiş, gerçek zamanlı (veritabanı tabanlı) bildirim listeleme ve "okundu" işaretleme sistemi.
*   **Profil Güncelleme:** Kullanıcıların akademik bilgilerini ve iletişim verilerini güncelleyebildiği dinamik form yapısı.
*   **Sistem Logları (Audit Trail):** Yapılan kritik işlemlerin (onay, ret, oluşturma) kim tarafından ve ne zaman yapıldığının takibi.

---

### 3. ROLLER VE SORUMLULUKLAR

| Rol | Yetki Alanı | Temel Görevler |
| :--- | :--- | :--- |
| **Süper Admin** | Tam Yetki | Üniversite/Topluluk kurulumu, kullanıcı rollerinin atanması, sistem genel denetimi ve onay süreçleri. |
| **Topluluk Başkanı** | Birim Yönetimi | Kendi topluluğu için etkinlik planlama, faaliyet raporu sunma, üye onayları ve birim içi istatistik takibi. |
| **Yönetim Ekibi** | Operasyonel Destek | Etkinliklerin organizasyonu, rapor hazırlama ve medya dosyalarının sisteme yüklenmesi. |
| **Üye** | Kişisel Kullanıcı | Duyuruları takip etme, etkinlik katılımı sağlama ve kişisel portfolyosunu yönetme. |

---

### 4. TEST HESAPLARI (VERİTABANI KAYITLI)

Sistemi her rolden test edebilmeniz için tanımlanmış güncel hesaplar:

1.  **SÜPER ADMİN**
    *   **E-Posta:** `admin@t3.org.tr`
    *   **Şifre:** `Admin12345!`
2.  **TOPLULUK BAŞKANI**
    *   **E-Posta:** `baskan@t3.org.tr`
    *   **Şifre:** `Baskan12345!`
3.  **YÖNETİM EKİBİ**
    *   **E-Posta:** `yonetim@t3.org.tr`
    *   **Şifre:** `Yonetim12345!`
4.  **ÜYE**
    *   **E-Posta:** `uye@t3.org.tr`
    *   **Şifre:** `Uye12345!`

*Not: Şifrelerde büyük/küçük harf ve ünlem işaretine dikkat ediniz.*

---

### 5. GELİŞTİRİLECEK / DİNAMİKLEŞTİRİLECEK KISIMLAR (BACKLOG)
Sistemin v2.0 aşamasında tamamlanması planlanan ve şu an geliştirme aşamasında olan kısımlar:

*   **Medya Yönetimi (Silme Fonksiyonu):** Şu an dosyalar yüklenebilmekte ve görüntülenebilmektedir. Dosya bazlı "kalıcı silme" butonu aksiyonu eklenecektir.
*   **Şifre Sıfırlama Servisi:** Arayüz hazırdır, ancak SMTP (mail gönderim) sunucusu entegrasyonu beklemektedir.
*   **Ayarlar Paneli:** Sistem genel ayarları (site teması, bakım modu vb.) veritabanı değişkenlerine bağlanacaktır.
*   **Gelişmiş Rapor Çıktıları:** İstatistik sayfalarındaki verilerin PDF veya Excel olarak dışa aktarılması özelliği eklenebilir.
