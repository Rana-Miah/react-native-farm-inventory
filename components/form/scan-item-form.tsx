import { useScanBarcode } from "@/hooks/tanstack-query/scanned-item-mutation"
import { useScanItem } from "@/hooks/use-scan-item"
import { ScanItemFormData, scanItemFormSchema } from "@/schema/scan-item-form-schema"
import { Feather } from "@expo/vector-icons"
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import InputField from "../input-field"
import { ItemDetails } from "../item-details"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"

export default function ScanItemForm() {
    const [triggerWidth, setTriggerWidth] = React.useState(0)
    const [barcodeInputValue, setBarcodeInputValue] = React.useState<string>("")
    const quantityInputRef = React.useRef<any>(null)
    const qc = useQueryClient()


    // React-hook-form
    const form = useForm<ScanItemFormData>({
        resolver: zodResolver(scanItemFormSchema),
        defaultValues: {
            barcode: "",
            unitId: "",
            quantity: 1,
        },
    })

    const { data } = useScanItem({ barcode: barcodeInputValue, form, quantityRef: quantityInputRef })
    const { mutate } = useScanBarcode()

    //! handle submit function
    const onSubmit = form.handleSubmit(async value => {
        mutate(
            value,
            {
                onSuccess({ data, msg }) {
                    if (!data) {
                        Toast.show({
                            type: 'error',
                            text1: msg,
                            text1Style: {
                                fontSize: 16
                            },
                        })
                        return
                    }
                    Toast.show({
                        type: 'success',
                        text1: msg,
                        text1Style: {
                            fontSize: 16
                        },
                    })

                },
            })

        await qc.invalidateQueries({queryKey:['get-stored-scanned-items']})
    })



    //! handle submit function
    const handleOnSubmitEditing = async (code: string) => {
        if (!code) {
            form.setValue('unitId', "")
            return
        }
        setBarcodeInputValue(code)
        await qc.invalidateQueries({ queryKey: ['get-stored-scanned-items'] })
    }

    useEffect(() => {
        if (data?.data) {
            const defaultUnitId = data.data.unitId;
            // or data.data.units[0]?.id if multiple units

            if (defaultUnitId) {
                form.setValue("unitId", defaultUnitId, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            }
        }
    }, [data])


    return (
        <Form {...form}>
            <View className="gap-2">
                <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                        <View className="relative">
                            <InputField
                                placeholder="Barcode/Item-Code"
                                keyboardType="numeric"
                                returnKeyType="next"
                                onChangeText={field.onChange}
                                value={field.value}
                                onSubmitEditing={() => handleOnSubmitEditing(field.value)}
                            />

                            {/* Clear Button */}
                            {field.value.length > 0 ? (
                                <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                    <TouchableOpacity onPress={() => {
                                        form.reset()
                                        setBarcodeInputValue("")
                                    }}>
                                        <Feather name="x-circle" size={24} />
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>

                    )}
                />
                <View className="flex-row items-center gap-1">
                    <View className="flex-1">
                        <FormField
                            name="unitId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            onValueChange={(option) => { field.onChange(option?.value); console.log(field.value) }}
                                            value={{
                                                value: field.value,
                                                label: (data?.data?.units ?? [])
                                                    .find(u => u.id === field.value)?.unitName ?? "Select an unit"
                                            }}

                                        >
                                            <SelectTrigger onLayout={(e) => setTriggerWidth(e.nativeEvent.layout.width)}>
                                                <SelectValue placeholder="UOM" />
                                            </SelectTrigger>
                                            <SelectContent style={{ width: triggerWidth }}>
                                                <SelectGroup>
                                                    <SelectLabel>Units</SelectLabel>
                                                    {
                                                        (data && data.data ? data.data.units : []).map((unit, i) => (
                                                            <SelectItem
                                                                value={unit?.id ?? "N/A"}
                                                                label={`${unit.unitName ?? "N/A"} (${unit.packing})`}
                                                                key={unit.id}
                                                            />
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </View>

                    <View className="flex-1">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <InputField
                                    {...field}
                                    ref={quantityInputRef}
                                    placeholder="Quantity"
                                    keyboardType="numeric"
                                    returnKeyType="go"
                                    value={field.value.toString()}
                                    onChangeText={field.onChange}
                                    onSubmitEditing={() => {
                                        onSubmit()
                                    }}
                                />
                            )}
                        />
                    </View>
                </View>

            </View>
            <Separator className="my-3" />
            <View>
                {
                    (barcodeInputValue && data?.data) && (
                        <>
                            <ItemDetails header={{ title: "Item Details", description: "Scanned item" }} item={{
                                description: data.data?.description ?? "N/A",
                                item_code: data.data?.item_code,
                                price: data.data?.price,
                                unit: data.data?.unitName
                            }} />
                            <Separator className="my-3" />
                        </>
                    )
                }

            </View>


        </Form>
    )
}


