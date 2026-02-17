import { getItemByBarcode, getItemByScanBarcode, getStoredScannedItems } from "@/data-access-layer/get-item"
import { useQuery, useQueryClient } from "@tanstack/react-query"



export const useGetItemByBarcode = (barcode: string) => {
    return useQuery({
        queryKey: ['get-item-by-barcode', barcode],
        queryFn: () => getItemByScanBarcode(barcode),
        enabled: !!barcode
    })
}

export const useGetItemPriceByBarcode = (barcode: string) => {
    return useQuery({
        queryKey: ['get-item-price-by-barcode', barcode],
        queryFn: () => getItemByBarcode(barcode),
        enabled: !!barcode
    })
}

export const useGetStoredScannedItems = () => {
    const qs = useQueryClient()
    const queryKey = ['get-stored-scanned-items']
    const data = useQuery({
        queryKey,
        queryFn: () => getStoredScannedItems(),
    })

    return {
        ...data,
        qs,
        queryKey
    }
}

export const useGetStoredScannedItemsSearch = (search: string) => {
    const qs = useQueryClient()
    const queryKey = ['get-stored-scanned-items', search]
    const data = useQuery({
        queryKey,
        queryFn: () => getStoredScannedItems(search),
        enabled: search.length > 0
    })

    return {
        ...data,
        qs,
        queryKey
    }
}