import { valueIsItemCode } from "@/constants"
import { getItemByBarcode } from "@/constants/query/barcode"
import { getItemByItemCode } from "@/constants/query/item"
import { useAppDispatch, useScannedItems } from "@/hooks/redux"
import { clearItem, setItem } from "@/lib/redux/slice/scanned-item-slice"
import { ScanItemFormData, scanItemFormSchema } from "@/schema/scan-item-form-schema"
import { zodResolver } from '@hookform/resolvers/zod'
import React from "react"
import { useForm } from "react-hook-form"
import { View } from "react-native"
import Toast from "react-native-toast-message"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

export default function ScanItemForm() {
    const [triggerWidth, setTriggerWidth] = React.useState(0)
    const { scannedItems } = useScannedItems()
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
        // dispatch(addScannedItem(value))
        // dispatch(clearItem())
        // form.reset()
        // console.log(scannedItems)

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
                                <Input
                                    placeholder="Barcode/Item-Code"
                                    keyboardType="numeric"
                                    returnKeyType="done"
                                    onChangeText={field.onChange}
                                    value={field.value}
                                    onSubmitEditing={() => {

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
                                        return
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <View className="flex-row items-center gap-1">
                    <View className="flex-1">
                        <Select>
                            <SelectTrigger

                                onLayout={(e) => setTriggerWidth(e.nativeEvent.layout.width)}
                            >
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
                                            placeholder="Quantity"
                                            keyboardType="numeric"
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