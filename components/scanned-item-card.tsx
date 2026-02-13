import { items } from '@/constants'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { DetailsRow } from './details-row'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'


const ScannedItemCard = ({ item, enableActionBtn }: { item: typeof items[number], enableActionBtn?: boolean }) => {
    const [isEditState, setIsEditState] = React.useState(false)

    const form = useForm({
        defaultValues: {
            quantity: item.quantity
        }
    })

    const onSubmit = form.handleSubmit((params) => {
        console.log(params)
        Toast.show({
            type:"success",
            text1:'Quantity',
            text2:params.quantity.toString()
        })
    })

    return (
        <Card className='bg-white border-muted my-1 p-3 gap-4'>
            <CardHeader className='flex-1 flex-row items-center justify-between px-0'>
                <View>
                    <CardTitle className='text-black'>
                        BARCODE
                    </CardTitle>
                    <CardDescription className='text-black'>
                        {item.barcode}
                    </CardDescription>
                </View>

                <View className="flex-row items-center gap-2 px-0">
                    {enableActionBtn ? (
                        <>
                            <Button variant={'outline'} className='bg-[#E8F1FC]' size={'sm'} onPress={() => setIsEditState(pre => !pre)}>
                                <FontAwesome6 name={isEditState ? "save" : "edit"} color={'#124DA1'} size={20} />
                            </Button>
                            {
                                !isEditState && (
                                    <Button variant={'destructive'} size={'sm'} onPress={() => alert('hello')}>
                                        <FontAwesome6 name={'trash'} size={20} color={'#fff'} />
                                    </Button>
                                )
                            }
                        </>
                    ) : (
                        <Badge variant="outline" className="border-muted-foreground rounded-full px-4 py-1 ">
                            <View>
                                <Text className='text-sm font-bold w-full bg-red-500'>{item.quantity} {item.uom.toUpperCase()}</Text>
                            </View>
                        </Badge>
                    )}
                </View>

            </CardHeader>

            <CardContent className='flex-col gap-2 px-0 py-0'>
                <DetailsRow icon={{ library: 'FontAwesome', name: 'barcode' }} label='item code' value={item.item_code} />
                <DetailsRow icon={{ library: 'FontAwesome', name: 'file-text' }} label='description' value={item.description} />
            </CardContent>
            {
                enableActionBtn && (
                    <>
                        <Separator />
                        <CardFooter className="flex items-center justify-between px-0">
                            <View className="flex-row items-center gap-2">
                                <View className='flex-row items-center justify-center w-8 h-8 bg-[#E8F1FC] rounded-md'>
                                    <MaterialIcons name={'layers'} color={"#124DA1"} size={20} />
                                </View>
                                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Quantity
                                </Text>
                            </View>

                            {isEditState ? (
                                <View>
                                    <Controller
                                        control={form.control}
                                        name="quantity"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input
                                                className="h-8 w-28" // same height & width as badge
                                                returnKeyType="done"
                                                keyboardType='numeric'
                                                onSubmitEditing={onSubmit}
                                                onChangeText={onChange}
                                                value={value.toString()}
                                            />
                                        )}
                                    />
                                    </View>
                                    ) : (
                                    <Badge variant="outline" className="border-muted-foreground rounded-full px-4">
                                            <Text onPress={()=>setIsEditState(prev=>!prev)} className='flex-1 max-w-12 text-center text-sm font-bold'>{item.quantity} {item.uom}</Text>
                                    </Badge>
                            )}
                                </CardFooter>

                        {/* <CardFooter
                            className="flex items-center justify-between px-0"
                        >
                            <View className="flex-row items-center gap-2">
                                <View className='flex-row items-center justify-center w-8 h-8 bg-[##E8F1FC] rounded-md'>
                                    <MaterialIcons name={'layers'} color={"#124DA1"} size={20} />
                                </View>
                                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Quantity
                                </Text>
                            </View>
                            {isEditState ? (
                                <Form {...form}>
                                    <FormField
                                        control={form.control}
                                        name='quantity'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input className=' h-8 max-w-28' returnKeyType='done' onSubmitEditing={onSubmit} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </Form>
                            ) : (
                                <Badge variant="outline" className="border-muted-foreground rounded-full px-4 py-1 ">
                                    <Text className='text-sm font-bold'>{item.quantity} {item.uom}</Text>
                                </Badge>
                            )}
                        </CardFooter> */}
                        </>
                        )
            }
                    </Card>
            )
}

            export default ScannedItemCard