import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from 'uuid';

type OneComma<S extends string> =
    S extends `${infer A},${infer B}`
    ? A extends `${string},${string}`
    ? never
    : B extends `${string},${string}`
    ? never
    : S
    : never;


const createdAt = (columnName: string = 'createdAt') => integer(columnName, { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
const updatedAt = (columnName: string = 'updatedAt') => integer(columnName, { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())

export const relationBetween = <T extends string>(bothTableName: OneComma<T>) => {
    const [firstTable, secondTable] = bothTableName.split(',')

    return `relation between ${firstTable} and ${secondTable}`
}

export const itemTable = sqliteTable("item", {
    id: text('id').primaryKey().notNull().unique().$defaultFn(() => uuid()),
    supplierId: text('supplier_id').notNull().references(() => supplierTable.id),
    item_code: text('item_code').notNull().unique(),
    item_description: text('item_description').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
});

export const itemTableRelations = relations(itemTable, ({ one, many }) => ({
    supplier: one(supplierTable, {
        fields: [itemTable.supplierId],
        references: [supplierTable.id],
        relationName: relationBetween('item,supplier')
    }),
    barcode: many(barcodeTable, { relationName: relationBetween('item,barcode') }),
}))

export const supplierTable = sqliteTable('supplier', {
    id: text('id').primaryKey().notNull().unique().$defaultFn(() => uuid()),
    supplierCode: text('supplier_code').notNull(),
    supplierName: text('supplier_name').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
});

export const supplierTableRelations = relations(supplierTable, ({ one, many }) => ({
    items: many(itemTable, { relationName: relationBetween('supplier,item') }),
}))



export const unitTable = sqliteTable('unit', {
    id: text('id').primaryKey().notNull().unique().$defaultFn(() => uuid()),
    unitName: text('unit_name').notNull(),
    packing: integer('packing').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
});

export const unitTableRelations = relations(unitTable, ({ one, many }) => ({
    barcode: many(barcodeTable, { relationName: relationBetween('unit,barcode') }),
}))


export const barcodeTable = sqliteTable('barcode', {
    id: text('id').primaryKey().notNull().unique().$defaultFn(() => uuid()),
    barcode: text('barcode').notNull().unique(),
    price: real('price').notNull(),
    promoPrice: real('promo_price'),
    description: text('description'),
    itemId: text('item_code_id').notNull().references(() => itemTable.id),
    unitId: text('unit_id').notNull().references(() => unitTable.id),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
});

export const barcodeTableRelations = relations(barcodeTable, ({ one }) => ({
    item: one(itemTable, {
        fields: [barcodeTable.itemId],
        references: [itemTable.id],
        relationName: relationBetween('barcode,item')
    }),
    unit: one(unitTable, {
        fields: [barcodeTable.unitId],
        references: [unitTable.id],
        relationName: relationBetween('barcode,unit')
    }),
}))




export const storedScannedItemTable = sqliteTable('stored_scanned_item', {
    id: text('id').primaryKey().notNull().unique().$defaultFn(() => uuid()),
    barcodeId: text('barcode_id').notNull().references(() => barcodeTable.id),
    unitId:text('unit_id').notNull().references(() => unitTable.id),
    quantity: real('quantity').notNull(),
    createdAt:createdAt(),
    updatedAt:updatedAt()
})


export const storedScannedItemTableRelations = relations(storedScannedItemTable, ({ one }) => ({
    barcode: one(barcodeTable, {
        fields: [storedScannedItemTable.barcodeId],
        references: [barcodeTable.id],
        relationName: relationBetween('stored_scanned_item,barcode')
    })
}))