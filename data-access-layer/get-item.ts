import { db } from "@/drizzle/db"
import { barcodeTable, itemTable, storedScannedItemTable, unitTable } from "@/drizzle/schema"
import { desc, eq, like, or } from "drizzle-orm"

export const getItemByScanBarcode = async (scannedBarcode: string) => {
    const [itemResponse] = await db
        .select()
        .from(barcodeTable)
        .rightJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
        .rightJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))
        .where(eq(barcodeTable.barcode, scannedBarcode))

    if (!itemResponse || !itemResponse.barcode || !itemResponse.unit) return (
        {
            msg: 'Item not found!',
            data: null
        }
    )

    const { barcode, item, unit } = itemResponse

    const barcodeUnits = await db
        .select()
        .from(barcodeTable)
        .rightJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
        .where(eq(barcodeTable.itemId, item.id))

    const units = barcodeUnits.map(({ unit }) => {
        const { createdAt, updatedAt, ...rest } = unit
        return {
            ...rest
        }
    })


    const data = {
        ...item,
        ...barcode,
        ...unit,
        units
    }

    return {
        msg: 'item found',
        data
    }
}

export const getBarcodeByBarcode = async (barcode: string) => {
    const [item] = await db.select().from(barcodeTable).where(eq(barcodeTable.barcode, barcode))
    return item
}

export const getUnitById = async (id: string) => {
    const [unit] = await db.select().from(unitTable).where(eq(unitTable.id, id))
    return unit
}



export const getStoredScannedItems = async (query?: string) => {
    const storeScannedItemsQuery = db
        .select()
        .from(storedScannedItemTable)
        .leftJoin(unitTable, eq(unitTable.id, storedScannedItemTable.unitId))
        .leftJoin(barcodeTable, eq(barcodeTable.id, storedScannedItemTable.barcodeId))
        .leftJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))


    if (query) {
        const words = query.trim().toLowerCase().split(/\s+/);

        storeScannedItemsQuery.where(or(
            like(barcodeTable.barcode, `%${query}%`),
            like(itemTable.item_code, `%${query}%`),
            ...words.map(word => (
                like(itemTable.item_description, `%${word}%`)
            ))
        ))
    }

    const storedScannedItems = await storeScannedItemsQuery.orderBy(desc(storedScannedItemTable.createdAt))


    return storedScannedItems.map(({ barcode, stored_scanned_item, item, unit }) => {

        return {
            storedId: stored_scanned_item.id,
            quantity: stored_scanned_item.quantity,
            barcode: barcode?.barcode,
            item_code: item?.item_code,
            description: item?.item_description,
            unitName: unit?.unitName,
            unitPacking: unit?.packing,
        }
    })

}

