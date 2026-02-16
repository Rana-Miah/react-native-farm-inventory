import { useGetItemByBarcode } from "@/hooks/tanstack-query/item-query"
import { ScanItemFormData } from "@/schema/scan-item-form-schema"
import { useQueryClient } from "@tanstack/react-query"
import React from "react"
import { UseFormReturn } from "react-hook-form"
import Toast from "react-native-toast-message"

export function useScanItem({ barcode,form,quantityRef}: {
    barcode: string,
    form: UseFormReturn<ScanItemFormData>,
    quantityRef: React.RefObject<any>
}) {
    const qc = useQueryClient()

    const itemResponse = useGetItemByBarcode(barcode)
    const { data, isError } = itemResponse

    React.useEffect(() => {
        if (!barcode) return

        if (isError || !data) {
            Toast.show({ type: "error", text1: "Item not found!" })
            return
        }

        form.setValue("uom", data.data?.unit_name ?? "")
        quantityRef.current?.focus()

        Toast.show({ type: "success", text1: data.msg })
    }, [barcode, data, isError])

    const resetAll = async () => {
        form.reset()
        await qc.invalidateQueries({ queryKey: ["get-item-by-barcode"] })
    }

    return {
        ...itemResponse,
        resetAll,
    }
}
