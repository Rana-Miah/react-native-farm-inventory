import { deleteScannedItem, insertScannedItem, updateScannedItemQuantity } from "@/data-access-layer/insert-scanned-item"
import { ScanItemFormData } from "@/schema/scan-item-form-schema"
import { useMutation } from "@tanstack/react-query"


export const useInsertStoredScannedItem = () => {
    return useMutation({
        mutationKey: ['insert-scanned-item'],
        mutationFn: (payload: ScanItemFormData) => insertScannedItem(payload),
        networkMode: "offlineFirst"
    })
}

export const useUpdateScannedItemQuantity = () => {
    return useMutation({
        mutationKey: ['update-scanned-item-quantity'],
        mutationFn: (payload: { storedScannedItemId: string; quantity: string }) => updateScannedItemQuantity(payload),
        networkMode: "offlineFirst"
    })
}

export const useDeleteScannedItem = () => {
    return useMutation({
        mutationKey: ['update-scanned-item-quantity'],
        mutationFn: (id: string) => deleteScannedItem(id),
        networkMode: "offlineFirst"
    })
}