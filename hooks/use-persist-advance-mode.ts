import { multitaskVariantValues } from "@/constants"
import { getSecureStoreValueFor, saveIntoSecureStore } from "@/lib/secure-store"
import { ScanItemFormData } from "@/schema/scan-item-form-schema"
import { useEffect, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"

export const usePersistAdvanceMode = (
    form: UseFormReturn<ScanItemFormData>
) => {
    const [isHydrated, setIsHydrated] = useState(false)
    const { control, reset, getValues } = form

    const isAdvanceModeEnable = useWatch({
        control,
        name: 'isAdvanceModeEnable'
    })
    const scanFor = useWatch({
        control,
        name: 'scanFor'
    })


    useEffect(
        () => {
            const loadAdvanceMode = async () => {
                const isAdvanceModeEnable = await getSecureStoreValueFor<boolean>('isAdvanceModeEnable')
                const scanFor = await getSecureStoreValueFor<typeof multitaskVariantValues[number] | undefined>('scanFor')

                reset({
                    ...getValues(),
                    isAdvanceModeEnable: isAdvanceModeEnable,
                    scanFor: isAdvanceModeEnable ? scanFor ?? 'Inventory' : undefined
                })
                setIsHydrated(true)
            }
            loadAdvanceMode()
        },
        [getValues, reset]
    )

    useEffect(
        () => {

            if (!isHydrated) return
            const sync = async () => {
                await saveIntoSecureStore('isAdvanceModeEnable', isAdvanceModeEnable)
                // await saveIntoSecureStore('scanFor', scanFor)
            }
            sync()
        }, [isHydrated, isAdvanceModeEnable, scanFor]
    )

    return { isAdvanceModeEnable, isHydrated }

}