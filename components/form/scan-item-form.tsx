import { multitaskVariantValues } from '@/constants'
import { useGetStoredScannedItems } from "@/hooks/tanstack-query/item-query"
import { useScanBarcode } from "@/hooks/tanstack-query/scanned-item-mutation"
import { useCountDown } from "@/hooks/use-count-down"
import { useScanItem } from "@/hooks/use-scan-item"
import { cn } from '@/lib/utils'
import { ScanItemFormData, scanItemFormSchema } from "@/schema/scan-item-form-schema"
import { Feather, FontAwesome6 } from "@expo/vector-icons"
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Pressable, TouchableOpacity, View } from "react-native"
import Toast from 'react-native-toast-message'
import InputField from "../input-field"
import { ItemDetails } from "../item-details"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage, } from "../ui/form"
import { Label } from '../ui/label'
import { RadioGroup } from '../ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { Switch } from '../ui/switch'
import { Text } from '../ui/text'



export default function ScanItemForm() {
    const [triggerWidth, setTriggerWidth] = React.useState(0)
    const [barcodeInputValue, setBarcodeInputValue] = React.useState<string>("")
        const { isTimerFinish, seconds, startTimer } = useCountDown(5)
    const quantityInputRef = React.useRef<any>(null)
    const barcodeInputRef = React.useRef<any>(null)
    const qc = useQueryClient()
    const { refetch } = useGetStoredScannedItems()


    // React-hook-form
    const form = useForm<ScanItemFormData>({
        resolver: zodResolver(scanItemFormSchema),
        defaultValues: {
            barcode: "",
            unitId: "",
            quantity: 1,
            isAdvanceModeEnable:false,
            scanFor:undefined
        },
    })
    const isAdvanceModeEnable = form.watch('isAdvanceModeEnable')
    const { data } = useScanItem({ barcode: barcodeInputValue, form, quantityRef: quantityInputRef })
    const { mutate } = useScanBarcode()


    //! handle submit function
    const onSubmit = form.handleSubmit(async value => {
        mutate(
            value,
            {
                async onSuccess({ data, msg }) {
                    if (!data) {
                        Toast.show({
                            type: 'error',
                            text1: msg,
                        })
                        return
                    }
                    Toast.show({
                        type: 'success',
                        text1: msg,
                    })
                    refetch()

                },
            })
        barcodeInputRef.current?.focus()
        //TODO:Reset form & set barcode input value to ""
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
    }, [data, form])


    return (

        <>
        <Form {...form}>
            <View className="gap-1.5">

                {/* Barcode Input */}
                <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                        <View className="relative">
                            <InputField
                                ref={barcodeInputRef}
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
                        )}/>

                        {/* UOM & Quantity Container Start */}
                <View className="flex-row items-center gap-1">
                        {/* UOM Select Input */}
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

                        {/* Quantity Input */}
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
                        {/* UOM & Quantity Container Finish */}

                            <FormField
                            name="isAdvanceModeEnable"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <View className='flex-row items-center justify-between'>
                                            <Label>Advance Mode</Label>
                                            <Switch
                                        onCheckedChange={(isEnable) => {
                                            field.onChange(isEnable)
                                            form.setValue('scanFor',isEnable? 'Inventory':undefined)
                                                
                                        }}
                                                checked={field.value}
                                                
                                        />
                                        </View>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}/>

{/* Multitask Scan*/}
                    {isAdvanceModeEnable && (
                        <FormField
                    control={form.control}
                    name='scanFor'
                    render={({ field }) => (
                        <FormItem>

                            <View className='flex-row items-center justify-between'>
                                <Label className="font-semibold">Scan For</Label>
                                <Pressable onPress={startTimer}>
                                    <Text className="">
                                        <Feather name='info' size={20} />
                                    </Text>
                                </Pressable>
                            </View>
                            <FormControl>
                                <RadioGroup value={field.value} onValueChange={field.onChange} className='flex-row gap-0'>
                                    {
                                        multitaskVariantValues.map(
                                            variant => {
                                                const isActive = form.getValues('scanFor') === variant
                                                return (
                                                    <Pressable onPress={() => field.onChange(variant)} key={variant} className={cn('flex-1 rounded-md', isActive ? 'bg-black' : "")}>
                                                        <Text className={cn('py-2 text-center font-semibold', isActive && "text-white")}>
                                                            {variant}  {isActive && <FontAwesome6 name='check' color="#fff" size={14} />}
                                                        </Text>
                                                    </Pressable>
                                                )
                                            }
                                        )
                                    }
                                </RadioGroup>
                            </FormControl>
                            {
                                !isTimerFinish && (
                                    <FormDescription>
                                        By using this feature merchandiser can scan multi type inventory at the same time. Like <Text className='font-semibold text-sm'>Inventory, Shelf tags, Order</Text>
                                    </FormDescription>
                                )
                            }
                        </FormItem>
                    )}
                />
                )}

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
                                unit: data.data?.unitName,
                                isAlreadyScanned: false
                            }} />
                            <Separator className="my-3" />
                        </>
                    )
                }

            </View>


        </Form>
                </>
    )
}


