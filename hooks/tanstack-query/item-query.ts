import { db } from "@/drizzle/db"
import { barcodeTable, itemTable, unitTable } from "@/drizzle/schema"
import { useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm"

const getItemByScanBarcode = async (scannedBarcode: string) => {
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
        if (!unit) return null
        const { createdAt, updatedAt, ...rest } = unit
        return {
            ...rest
        }
    }).filter(i => i !== null)


    return {
        msg: 'item found',
        data: {
            ...item,
            units
        }
    }
}

export const useGetItemByBarcode = (barcode: string) => {
    return useQuery({
        queryKey: ['get-item-by-barcode', barcode],
        queryFn: () => getItemByScanBarcode(barcode),
        enabled: !!barcode
    })
}