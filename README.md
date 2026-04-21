# T3 Topluluk Yonetim Sistemi

Bu repo, T3 Vakfi universite topluluklari icin gelistirilen merkezi yonetim platformunun Faz 0 temel kurulumudur.

## Faz 0 Kapsami

- Next.js App Router tabanli fullstack kurulum
- Prisma + PostgreSQL veri katmani
- NextAuth credentials tabanli giris
- RBAC ve permission omurgasi (roller, yetkiler, rol-yetki eslesmesi)
- Seed ile ornek super admin hesabi
- Admin ve Baskan paneli icin ilk korumali route iskeleti

## Gereksinimler

- Node.js 20+
- Docker Desktop (PostgreSQL icin)

## Kurulum

1. Projeye gir:

```bash
cd t3-topluluk-yonetim
```

Alternatif: Kok klasorden komut calistirmak istersen `C:\T3_Yonetim\package.json` icindeki
proxy scriptleri kullanilabilir.

2. Ortam degiskenlerini ayarla:

```bash
cp .env.example .env
```

Windows PowerShell icin:

```powershell
Copy-Item .env.example .env
```

Not: Yerel PostgreSQL sifren farkliysa `.env` icindeki `DATABASE_URL` satirini kendi
bilgine gore guncelle.

3. Veritabani container'ini baslat:

```bash
docker compose up -d
```

Eger komutu `C:\T3_Yonetim` klasorunden calistiriyorsaniz, kokteki `docker-compose.yml`
dosyasi uzerinden de baslatabilirsiniz.

4. Prisma migration ve client olustur:

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

Kok klasorden calisiyorsan:

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

5. Seed calistir:

```bash
npm run prisma:seed
```

6. Uygulamayi baslat:

```bash
npm run dev
```

## Giris Bilgisi (Seed)

- URL: `http://localhost:3000/giris`
- E-posta: `admin@t3.org.tr`
- Sifre: `Admin12345!`
- E-posta: `baskan@t3.org.tr`
- Sifre: `Baskan12345!`

## Sonraki Fazlar

- Faz 1: Rol/yetki UI ve kapsamli access policy (tamamlandi)
- Faz 2: Universite/topluluk yonetimi (ilk bolum tamamlandi)
- Faz 3: Etkinlik olusturma ve admin onay akisi
- Faz 4: Katilim/yoklama modulu
- Faz 5: Rapor + medya + belge + rapor onay
- Faz 6: Duyuru + bildirim + istatistik (tamamlandi)
- Faz 4: Katilim/yoklama
- Faz 5: Rapor + medya + belge
- Faz 6: Duyuru, bildirim, dashboard, istatistik
