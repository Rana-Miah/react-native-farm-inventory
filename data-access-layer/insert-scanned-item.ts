import { db } from "@/drizzle/db";
import { storedScannedItemTable } from "@/drizzle/schema";
import { ScanItemFormData } from "@/schema/scan-item-form-schema";
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


    console.log({
        barcodeId: existBarcode.id,
        quantity: payload.quantity,
        unitId: existUnit.id
    })


    return {
        msg:"Item Added",
        data:addedItem
    }
}