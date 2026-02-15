import { db } from "@/drizzle/db"
import { barcodeTable, itemTable, unitTable } from "@/drizzle/schema"
import { useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm"

const getItemByScanBarcode = async (barcode: string) => {
    const [item] = await db
        .select(
            {
                barcodeId: barcodeTable.id,
                barcode: barcodeTable.barcode,
                price: barcodeTable.price,
                br_description: barcodeTable.description,
                item_codeId: itemTable.id,
                item_code: itemTable.item_code,
                itm_description: itemTable.item_description,
                unitId: unitTable.id,
                unit_name: unitTable.unitName
            }
        )
        .from(barcodeTable)
        .leftJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))
        .leftJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
        .where(eq(barcodeTable.barcode, barcode))

    if (!item) return (
        {
            msg: 'Item not found!',
            data: null
        }
    )

    if (!item.item_codeId) return (
        {
            msg: `barcode don't have item code!`,
            data: null
        }
    )

    const barcodeUnits = await db
        .select()
        .from(barcodeTable)
        .leftJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
        .where(eq(barcodeTable.itemId, item.item_codeId))

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