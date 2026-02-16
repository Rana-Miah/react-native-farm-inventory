import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

import * as schema from './schema';

const expo = SQLite.openDatabaseSync('inventory.db', { enableChangeListener: true });
expo.execSync("PRAGMA foreign_keys = ON;");



export async function dropAllTables() {
    console.log('✅ All tables dropping start')
    // 1️⃣ Disable foreign key checks
    expo.execSync('PRAGMA foreign_keys = OFF;')
    
    const tables = expo.getAllSync<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table';"
    )
    
    for (const table of tables) {
        if (
            table.name !== 'sqlite_sequence' &&
            table.name !== 'sqlite_master'
        ) {
            expo.execSync(`DROP TABLE IF EXISTS "${table.name}";`)
        }
    }
    
    // 2️⃣ Re-enable foreign key checks
    expo.execSync('PRAGMA foreign_keys = ON;')
    
    console.log('✅ All tables dropped successfully')
}
export async function deleteAllData() {
    console.log('✅ All data deleting start')
    
    expo.execSync('PRAGMA foreign_keys = OFF;')
    await db.delete(schema.storedScannedItemTable)
    await db.delete(schema.barcodeTable)
    await db.delete(schema.unitTable)
    await db.delete(schema.supplierTable)
    await db.delete(schema.supplierTable)
    
    expo.execSync('PRAGMA foreign_keys = ON;')
    console.log('✅ All data deleted')
}


export const db = drizzle(expo, { schema });
