import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

import * as schema from './schema';

const expo = SQLite.openDatabaseSync('inventory.db', { enableChangeListener: true });

export const db = drizzle(expo, { schema });
