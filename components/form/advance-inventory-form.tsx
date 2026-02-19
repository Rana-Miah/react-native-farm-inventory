import InputField from '@/components/input-field'
import { Form, FormControl, FormDescription, FormField, FormItem } from '@/components/ui/form'
import { multitaskVariantValues } from '@/constants'
import { useCountDown } from '@/hooks/use-count-down'
import { cn } from '@/lib/utils'
import { advanceInventoryFormSchema, AdvanceInventoryFormValue } from '@/schema/advance-inventory-form-schema'
import { Feather, FontAwesome6 } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { Label } from '../ui/label'
import { RadioGroup } from '../ui/radio-group'
import { Text } from '../ui/text'


const AdvanceInventoryForm = () => {
    const { isTimerFinish, seconds, startTimer } = useCountDown(5)
    const form = useForm<AdvanceInventoryFormValue>({
        resolver: zodResolver(advanceInventoryFormSchema),
        defaultValues: {
            barcode: "",
            unitId: "",
            quantity: 1,
            scannedFor: "Inventory"
        }
    })
    const { control, handleSubmit, reset } = form
    return (
        <Form {...form}>
            <View className="gap-1.5">
                {/* Barcode */}
                <FormField
                    control={control}
                    name='barcode'
                    render={({ field }) => (
                        <InputField
                            placeholder='Barcode'
                            keyboardType='numeric'
                            returnKeyType='next'
                            onSubmitEditing={() => { }}
                            onChangeText={field.onChange}
                            value={field.value}
                        />
                    )}
                />


                {/* UOM & Quantity Start*/}
                <View className='flex-row items-center gap-2'>
                    {/* UOM Selector */}
                    <View className="flex-1">
                        <FormField
                            control={control}
                            name='unitId'
                            render={({ field }) => (
                                <InputField
                                    placeholder='Unit'
                                    returnKeyType='next'
                                    onSubmitEditing={() => { }}
                                    onChangeText={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </View>


                    {/* Quantity */}
                    <View className="flex-1">
                        <FormField
                            control={control}
                            name='quantity'
                            render={({ field }) => (
                                <InputField
                                    placeholder='Quantity'
                                    returnKeyType='next'
                                    keyboardType='numeric'
                                    onSubmitEditing={() => { }}
                                    onChangeText={field.onChange}
                                    value={field.value.toString()}
                                />
                            )}
                        />
                    </View>
                </View>
                {/* UOM & Quantity End*/}


                {/* Multitask Scan*/}
                <FormField
                    control={control}
                    name='scannedFor'
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
                                                const isActive = form.getValues('scannedFor') === variant
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
            </View>
        </Form>
    )
}




export default AdvanceInventoryForm