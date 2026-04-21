# T3 Yönetim Sistemi - Test Kimlik Bilgileri

**Tarih:** 21 Nisan 2026  
**Amaç:** Sistem testleri için kullanılacak test hesapları

---

## Test Hesapları

### 1. Süper Admin (Admin Panel)

**E-posta:** `admin@t3.org.tr`  
**Şifre:** `Admin12345!`  
**Panel:** `/admin`  
**Yetkiler:** Tüm sistem yönetim yetkileri

**Erişebileceği Sayfalar:**
- Dashboard
- Üniversiteler (liste + detay)
- Topluluklar (liste + detay)
- Kullanıcılar (liste + detay)
- Roller ve Yetkiler
- Etkinlik Onayları
- Rapor Onayları
- Medya & Belgeler
- Duyurular
- İstatistikler
- Sistem Logları
- Ayarlar
- Katılım İzleme

---

### 2. Topluluk Başkanı (Başkan Panel)

**E-posta:** `baskan@t3.org.tr`  
**Şifre:** `Baskan12345!`  
**Panel:** `/baskan`  
**Topluluk:** T3 YTU Teknoloji Topluluğu  
**Üniversite:** Yıldız Teknik Üniversitesi

**Erişebileceği Sayfalar:**
- Dashboard
- Topluluğum
- Üyeler
- Etkinlikler (liste + detay)
- Katılım
- Raporlar (liste + detay)
- Görseller & Belgeler
- Duyurular
- İstatistikler

---

### 3. Kayıtlı Üye (Üye Panel)

**Not:** Seed dosyasında üye kullanıcısı bulunmamaktadır. Test için üye hesabı oluşturmanız gerekebilir.

**Üye Hesabı Oluşturma Adımları:**

1. Admin paneline giriş yapın (`admin@t3.org.tr` / `Admin12345!`)
2. `/admin/kullanicilar` sayfasına gidin
3. "Yeni Kullanıcı Ekle" butonuna tıklayın
4. Üye bilgilerini girin:
   - Ad Soyad: Test Üye
   - E-posta: uye@t3.org.tr
   - Şifre: Uye12345!
   - Üniversite: Yıldız Teknik Üniversitesi
   - Bölüm: Bilgisayar Mühendisliği
   - Sınıf: 3
5. Rol olarak "Üye" seçin
6. Topluluk olarak "T3 YTU" seçin
7. Kaydedin

**Oluşturulan Üye Bilgileri:**
**E-posta:** `uye@t3.org.tr`  
**Şifre:** `Uye12345!`  
**Panel:** `/uye`

**Erişebileceği Sayfalar:**
- Dashboard
- Profilim
- Etkinliklerim
- Katılım Durumlarım
- Duyurular

---

## Hızlı Test Adımları

### Admin Panel Testi
1. Giriş sayfasına gidin: `/giris`
2. E-posta: `admin@t3.org.tr`
3. Şifre: `Admin12345!`
4. Giriş yap butonuna tıklayın
5. Otomatik olarak `/admin` paneline yönlendirileceksiniz

### Başkan Panel Testi
1. Giriş sayfasına gidin: `/giris`
2. E-posta: `baskan@t3.org.tr`
3. Şifre: `Baskan12345!`
4. Giriş yap butonuna tıklayın
5. Otomatik olarak `/baskan` paneline yönlendirileceksiniz

### Üye Panel Testi
1. Önce admin panelinden üye hesabı oluşturun (yukarıdaki adımları takip edin)
2. Giriş sayfasına gidin: `/giris`
3. E-posta: `uye@t3.org.tr`
4. Şifre: `Uye12345!`
5. Giriş yap butonuna tıklayın
6. Otomatik olarak `/uye` paneline yönlendirileceksiniz

---

## Önemli Notlar

- Tüm şifreler seed dosyasında tanımlanmıştır
- Şifreler güvenli değildir, sadece test amaçlıdır
- Üretim ortamında bu şifreler değiştirilmelidir
- Üye hesabı için admin panelinden yeni kullanıcı oluşturmanız gerekmektedir

---

## Seed Dosyası Konumu

Seed dosyası: `prisma/seed.ts`

Seed'i çalıştırmak için:
```bash
npm run seed
```
veya
```bash
npx prisma db seed
```

Seed çalıştırıldığında konsol çıktısı:
```
Seed tamamlandi. Ornek admin: admin@t3.org.tr / Admin12345!
Ornek baskan: baskan@t3.org.tr / Baskan12345!
```
