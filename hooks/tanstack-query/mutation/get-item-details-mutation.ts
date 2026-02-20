import { getItemDetailsByBarcodeWithAdvanceFeature } from "@/data-access-layer/get-item"
import { type GetItemDetailsByBarcodeWithAdvanceFeature } from "@/data-access-layer/types"
import { useMutation } from "@tanstack/react-query"

export const useGetItemDetailsMutationWithFeature = () => {
    return useMutation({
        mutationKey: ['get-item-details-mutation-with-advance'],
        mutationFn: async (params: GetItemDetailsByBarcodeWithAdvanceFeature) => await getItemDetailsByBarcodeWithAdvanceFeature(params),
    })
}