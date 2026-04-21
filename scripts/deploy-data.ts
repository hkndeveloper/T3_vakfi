import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const LOCAL_DB_URL = process.env.DATABASE_URL;
const REMOTE_DB_URL = "postgresql://postgres:sQjJiqaFtScytOtCgMNNxXrFezNQyniq@roundhouse.proxy.rlwy.net:45701/railway";

async function migrate() {
  console.log("🚀 Veri aktarımı başlatılıyor...");
  
  const localClient = new Client({ connectionString: LOCAL_DB_URL });
  const remoteClient = new Client({ connectionString: REMOTE_DB_URL });

  try {
    await localClient.connect();
    console.log("✅ Yerel veritabanına bağlanıldı.");
    await remoteClient.connect();
    console.log("✅ Railway veritabanına bağlanıldı.");

    // Tablo listesi (İlişki sırasına göre)
    const tables = [
      'University',
      'User',
      'Role',
      'Permission',
      'RolePermission',
      'Community',
      'UserRole',
      'CommunityMember',
      'Event',
      'EventParticipant',
      'Report',
      'MediaFile',
      'Document',
      'ActivityLog',
      'Announcement',
      'Notification'
    ];

    // Önce hedefteki tüm verileri temizle (opsiyonel ama güvenli)
    console.log("🧹 Hedef veritabanı temizleniyor...");
    for (const table of [...tables].reverse()) {
      await remoteClient.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    }

    // Verileri kopyala
    for (const table of tables) {
      console.log(`📦 ${table} tablosu aktarılıyor...`);
      const { rows } = await localClient.query(`SELECT * FROM "${table}"`);
      
      if (rows.length === 0) {
        console.log(`ℹ️ ${table} boş, atlanıyor.`);
        continue;
      }

      const columns = Object.keys(rows[0]).map(c => `"${c}"`).join(', ');
      
      for (const row of rows) {
        const placeholders = Object.keys(row).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(row);
        await remoteClient.query(
          `INSERT INTO "${table}" (${columns}) VALUES (${placeholders})`,
          values
        );
      }
      console.log(`✅ ${table} aktarıldı (${rows.length} kayıt).`);
    }

    console.log("✨ TÜM VERİLER BAŞARIYLA AKTARILDI!");

  } catch (error) {
    console.error("❌ HATA OLUŞTU:", error);
  } finally {
    await localClient.end();
    await remoteClient.end();
  }
}

migrate();
