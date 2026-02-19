import { db } from "@/drizzle/db";
import { storedScannedItemTable } from "@/drizzle/schema";
import { ScanItemFormData } from "@/schema/scan-item-form-schema";
import { eq } from "drizzle-orm";
import { getBarcodeByBarcode, getUnitById } from "./get-item";

export const insertScannedItem = async (payload: ScanItemFormData) => {
    const existBarcode = await getBarcodeByBarcode(payload.barcode)
    if (!existBarcode) return { msg: "Item Not Found", data: null }
    const existUnit = await getUnitById(payload.unitId)
    if (!existUnit) return { msg: "Item Not Found", data: null }
    const [addedItem] = await db.insert(storedScannedItemTable).values({
        barcodeId: existBarcode.id,
        quantity: payload.quantity,
        unitId: existUnit.id
    }).returning()

    return {
        msg: "Item Added",
        data: addedItem
    }
}

export const updateScannedItemQuantity = async (payload: { storedScannedItemId: string; quantity: string }) => {
    if (Number(payload.quantity) < 1) return { msg: 'Quantity must grater than 0' }
    const [existBarcode] = await db.select().from(storedScannedItemTable).where(
        eq(storedScannedItemTable.id, payload.storedScannedItemId)
    )
    if (!existBarcode) return { msg: "Scanned item not found!", data: null }
    const [updated] = await db.update(storedScannedItemTable).set({
        quantity: Number(payload.quantity)
    }).where(eq(storedScannedItemTable.id, payload.storedScannedItemId)).returning()

    return {
        msg: `Quantity updated to`,
        data: updated
    }
}

export const deleteScannedItem = async (id: string) => {
    const [existStored] = await db.select().from(storedScannedItemTable).where(
        eq(storedScannedItemTable.id, id)
    )
    if (!existStored) return { msg: "Scanned item not found!", data: null }
    await db.delete(storedScannedItemTable).where(eq(storedScannedItemTable.id, id)).returning()

    return {
        msg: "Item deleted!",
        data: null
    }
}