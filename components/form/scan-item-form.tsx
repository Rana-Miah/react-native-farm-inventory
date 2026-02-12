import { ScanItemFormData, scanItemFormSchema } from "@/schema/scan-item-form-schema"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { View } from "react-native"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Text } from "../ui/text"

export default function ScanItemForm() {
    const form = useForm<ScanItemFormData>({
        resolver: zodResolver(scanItemFormSchema),
        defaultValues: {
            barcode: "",
            uom: "",
            quantity: 1,
        },
    })
    const onSubmit = form.handleSubmit(value => {
        alert(JSON.stringify(value))
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
                                        alert(field.value)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <View className="flex-row items-center gap-1">
                    <View className="flex-1">
                        <FormField
                            control={form.control}
                            name="uom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="UOM" onChangeText={field.onChange} />
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
                                        <Input {...field} placeholder="Quantity"
                                            keyboardType="numeric" value={field.value.toString()}
                                            onChangeText={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </View>
                </View>
                <Button onPress={onSubmit} className="mt-5">
                    <Text>Submit</Text>
                </Button>
            </View>
        </Form>
        // <View>
        //     <Controller
        //         control={control}
        //         name="barcode"
        //         render={({ field: { onChange, onBlur, value } }) => (
        //             <TextInput
        //                 placeholder="Barcode"
        //                 onBlur={onBlur}
        //                 onChangeText={onChange}
        //                 value={value}
        //             />
        //         )}
        //     />
        //     {errors.barcode && <Text>{errors.barcode.message}.</Text>}

        //     <Controller
        //         control={control}
        //         name="uom"
        //         render={({ field: { onChange, onBlur, value } }) => (
        //             <TextInput
        //                 placeholder="UOM"
        //                 onBlur={onBlur}
        //                 onChangeText={onChange}
        //                 value={value}
        //             />
        //         )}
        //     />
        //     {errors.uom && <Text>{errors.uom.message}.</Text>}


        //     <Controller
        //         control={control}
        //         name="quantity"
        //         render={({ field: { onChange, onBlur, value } }) => (
        //             <Input
        //                 placeholder="Quantity"
        //                 keyboardType="numeric"
        //                 onBlur={onBlur}
        //                 onChangeText={onChange}
        //                 value={value.toString()}
        //             />
        //         )}
        //     />
        //     {errors.quantity && <Text>{errors.quantity.message}quantity.</Text>}

        //     <Button title="Submit" onPress={onSubmit} />
        // </View>
    )
}