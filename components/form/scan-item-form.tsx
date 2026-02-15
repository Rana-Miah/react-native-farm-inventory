import { useAppDispatch } from "@/hooks/redux"
import { useGetItemByBarcode } from "@/hooks/tanstack-query/item-query"
import { clearItem, setItem } from "@/lib/redux/slice/scanned-item-slice"
import { ScanItemFormData, scanItemFormSchema } from "@/schema/scan-item-form-schema"
import { Feather } from "@expo/vector-icons"
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"
import { TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import { ItemDetails } from "../item-details"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"

export default function ScanItemForm() {
    const [triggerWidth, setTriggerWidth] = React.useState(0)
    const [barcodeInputValue, setBarcodeInputValue] = React.useState<string>("")
    const qc = useQueryClient()
    const { data, isError, isFetched } = useGetItemByBarcode(barcodeInputValue)

    const quantityInputRef = React.useRef<any>(null)
    const dispatch = useAppDispatch()


    const form = useForm<ScanItemFormData>({
        resolver: zodResolver(scanItemFormSchema),
        defaultValues: {
            barcode: "",
            uom: "",
            quantity: 1,
        },
    })

    React.useEffect(() => {
        if (!barcodeInputValue) return
        if (isError || !data) {
            Toast.show({
                type: 'error',
                text1: 'Item not found!',
                text1Style: {
                    fontSize: 16
                },
            })
            dispatch(clearItem())
            return
        }

        quantityInputRef.current?.focus()
        form.setValue('uom', data.data?.unit_name ?? '')
        dispatch(setItem("data"))
        Toast.show({
            type: 'success',
            text1: data.msg,
            text1Style: {
                fontSize: 16
            },
        })
    }, [barcodeInputValue, dispatch, form, data, isError])



    //! handle submit function
    const onSubmit = form.handleSubmit(value => {
        Toast.show({
            type: 'success',
            text1: 'Item added successfully',
            text1Style: {
                fontSize: 16
            },
        })
    })



    //! handle submit function
    const handleOnSubmitEditing = (code: string) => {
        if (!code) {
            form.setValue('uom', "")
            return
        }
        setBarcodeInputValue(code)
    }



    return (
        <Form {...form}>
            <View className="gap-2">
                <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Barcode</FormLabel>
                            <FormControl>
                                <View className="relative">
                                    <Input
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
                                            <TouchableOpacity onPress={async () => {
                                                form.reset()
                                                dispatch(clearItem())
                                                setBarcodeInputValue("")
                                                await qc.invalidateQueries({ queryKey: ['get-item-by-barcode'] })
                                            }}>
                                                <Feather name="x-circle" size={24} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : null}
                                </View>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <View className="flex-row items-center gap-1">
                    <View className="flex-1">
                        <FormField
                            name="uom"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            onValueChange={(option) => { field.onChange(option?.value); console.log(field.value) }}
                                            value={{
                                                value: field.value, label: (data && data.data ? data.data.units : []).filter(item => item.id === field.value)[0]?.unitName
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
                                                    {/* <SelectItem value="KG" label="KG" />
                                                    <SelectItem value="PC" label="PC" />
                                                    <SelectItem value="CT" label="CT" />
                                                    <SelectItem value="CT1" label="CT1" />
                                                    <SelectItem value="OU1" label="OU1" />
                                                    <SelectItem value="OU2" label="OU2" />
                                                    <SelectItem value="BAG" label="BAG" />
                                                    <SelectItem value="CAN" label="CAN" /> */}
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
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            ref={quantityInputRef}
                                            placeholder="Quantity"
                                            keyboardType="numeric"
                                            returnKeyType="go"
                                            value={field.value.toString()}
                                            onChangeText={field.onChange}
                                            onSubmitEditing={() => {
                                                // Toast.show({
                                                //     type: 'success',
                                                //     text1: 'Item added successfully',
                                                // })
                                                onSubmit()
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
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
                                description: data.data?.br_description ?? "N/A",
                                item_code: data.data?.item_code ?? "N/A",
                                price: data.data?.price ?? 0,
                                unit: data.data?.unit_name ?? "N/A"
                            }} />
                            <Separator className="my-3" />
                        </>
                    )
                }
            </View>
        </Form>
    )
}


