import { valueIsItemCode } from "@/constants"
import { getItemByBarcode } from "@/constants/query/barcode"
import { getItemByItemCode } from "@/constants/query/item"
import { useAppDispatch } from "@/hooks/redux"
import { useItems } from "@/hooks/tanstack-query/item"
import { clearItem, setItem } from "@/lib/redux/slice/scanned-item-slice"
import { ScanItemFormData, scanItemFormSchema } from "@/schema/scan-item-form-schema"
import { Feather } from "@expo/vector-icons"
import { zodResolver } from '@hookform/resolvers/zod'
import React from "react"
import { useForm } from "react-hook-form"
import { TouchableOpacity, View } from "react-native"
import Toast from "react-native-toast-message"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

export default function ScanItemForm() {
    const [triggerWidth, setTriggerWidth] = React.useState(0)
    const [barcodeInputValue, setBarcodeInputValue] = React.useState<string>("")

    const { data } = useItems(barcodeInputValue)

    console.log({ data })
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
    const onSubmit = form.handleSubmit(value => {
        console.log({ value })
        Toast.show({
            type: 'success',
            text1: 'Item added successfully',
            text1Style: {
                fontSize: 16
            },
        })
    })




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
                                        onSubmitEditing={() => {

                                            setBarcodeInputValue(field.value)

                                            dispatch(setItem(JSON.stringify(data)))

                                            const isItemCode = valueIsItemCode(field.value)

                                            if (isItemCode) {
                                                const item = getItemByItemCode(field.value)
                                                if (!item.data) {
                                                    Toast.show({
                                                        type: 'error',
                                                        position: 'top',
                                                        text1: item.message,
                                                        text1Style: {
                                                            fontSize: 16
                                                        },
                                                    })
                                                    dispatch(clearItem())
                                                    return
                                                }
                                                dispatch(setItem(item.data))
                                                quantityInputRef.current?.focus()
                                                return
                                            }
                                            const item = getItemByBarcode(field.value)

                                            if (!item.data) {
                                                Toast.show({
                                                    type: 'error',
                                                    text1: item.message,
                                                    text1Style: {
                                                        fontSize: 16
                                                    },
                                                })
                                                dispatch(clearItem())
                                                return
                                            }
                                            dispatch(setItem(item.data))
                                            quantityInputRef.current?.focus()
                                            return
                                        }}
                                    />

                                    {/* Clear Button */}
                                    {field.value.length > 0 ? (
                                        <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                            <TouchableOpacity onPress={() => {
                                                field.onChange('')
                                                dispatch(clearItem())
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
                                        <Select onValueChange={(option) => field.onChange(option?.value)} value={{ value: field.value, label: field.value }}>
                                            <SelectTrigger onLayout={(e) => setTriggerWidth(e.nativeEvent.layout.width)}>
                                                <SelectValue placeholder="UOM" />
                                            </SelectTrigger>
                                            <SelectContent style={{ width: triggerWidth }}>
                                                <SelectGroup>
                                                    <SelectLabel>Units</SelectLabel>
                                                    <SelectItem value="KG" label="KG" />
                                                    <SelectItem value="PC" label="PC" />
                                                    <SelectItem value="CT" label="CT" />
                                                    <SelectItem value="CT1" label="CT1" />
                                                    <SelectItem value="OU1" label="OU1" />
                                                    <SelectItem value="OU2" label="OU2" />
                                                    <SelectItem value="BAG" label="BAG" />
                                                    <SelectItem value="CAN" label="CAN" />
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
        </Form>
    )
}