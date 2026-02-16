import { getItemByScanBarcode, getStoredScannedItems } from "@/data-access-layer/get-item"
import { useQuery, useQueryClient } from "@tanstack/react-query"



export const useGetItemByBarcode = (barcode: string) => {
    return useQuery({
        queryKey: ['get-item-by-barcode', barcode],
        queryFn: () => getItemByScanBarcode(barcode),
        enabled: !!barcode
    })
}

export const useGetStoredScannedItems = (search?: string) => {
    const qs = useQueryClient()
    const queryKey = ['get-stored-scanned-items', search]
    const data = useQuery({
        queryKey,
        queryFn: () => getStoredScannedItems(search),
    })

    return {
        ...data,
        qs,
        queryKey
    }
}