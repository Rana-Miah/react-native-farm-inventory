import { getItemDetailsByBarcodeWithAdvanceFeature } from "@/data-access-layer/get-item"
import { ScanItemFormData } from "@/schema/scan-item-form-schema"
import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"

export function useDefaultUnitFromItemDetails(
    form: UseFormReturn<ScanItemFormData>,
    itemDetails: Awaited<ReturnType<typeof getItemDetailsByBarcodeWithAdvanceFeature>>['data']
) {
    const { setValue } = form

    useEffect(() => {
        if (!itemDetails?.unitId) return

        setValue("unitId", itemDetails.unitId, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }, [itemDetails, setValue])
}
