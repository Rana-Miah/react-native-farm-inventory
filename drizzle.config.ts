import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'sqlite',
    driver: 'expo',
    schema: './drizzle/schema/index.ts',
    out: './drizzle/migrations',
});
