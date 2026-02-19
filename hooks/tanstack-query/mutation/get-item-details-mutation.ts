import { getItemDetailsByBarcodeWithAdvanceFeture } from "@/data-access-layer/get-item"
import { type GetItemDetailsByBarcodeWithAdvanceFeture } from "@/data-access-layer/types"
import { useMutation } from "@tanstack/react-query"

export const useGetItemDetailsMutaitonWithFeature = () => {
    return useMutation({
        mutationKey:['get-item-details-mutaion-with-advance'],
        mutationFn:async (params:GetItemDetailsByBarcodeWithAdvanceFeture) => await getItemDetailsByBarcodeWithAdvanceFeture(params),
    })
}