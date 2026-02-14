import { db } from '@/drizzle/db'
import { barcodeTable, itemTable, supplierTable, unitTable } from '@/drizzle/schema'
import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'

export function useItems(itemCode: string) {
    return useQuery({
        queryKey: ['items', itemCode],
        queryFn: async () => {
            const data = await db.select().from(itemTable)
                .leftJoin(supplierTable, eq(itemTable.supplierId, supplierTable.id))
                .leftJoin(barcodeTable, eq(itemTable.id, barcodeTable.itemId))
                .leftJoin(unitTable, eq(barcodeTable.unitId, unitTable.id))
                .groupBy(itemTable.id)
                .where(eq(itemTable.item_code, itemCode))

            // const res = Object.groupBy(data, (item) => item.users_table.item_code)

            return data
        },
    })
}
