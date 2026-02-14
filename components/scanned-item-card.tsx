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

type ScannedItemCardHeader = {
    title: string;
    description: string;
    headerComponent?: () => React.ReactNode
}


type ScannedItemCardProps = {
    header: ScannedItemCardHeader,

}


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
            type: "success",
            text1: 'Quantity',
            text2: params.quantity.toString()
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
                        <ItemQuantityUnit
                            quantity={item.quantity}
                            uom={item.uom}
                            onPress={() => setIsEditState(prev => !prev)}
                        />
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
                        <CardFooter className="items-center justify-between px-0">
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
                                                returnKeyType="go"
                                                keyboardType='numeric'
                                                onSubmitEditing={onSubmit}
                                                onChangeText={onChange}
                                                value={value.toString()}
                                            />
                                        )}
                                    />
                                </View>
                            ) : (
                                <ItemQuantityUnit
                                    quantity={item.quantity}
                                    uom={item.uom}
                                    onPress={() => setIsEditState(prev => !prev)}
                                />
                            )}
                        </CardFooter>
                    </>
                )
            }
        </Card>
    )
}

export default ScannedItemCard


type ItemQuantityUnitProps = {
    quantity: number;
    uom: string
} & React.ComponentProps<typeof Text>

const ItemQuantityUnit = ({ quantity, uom, ...props }: ItemQuantityUnitProps) => {
    return (
        <Badge variant="outline" className="border-muted-foreground rounded-full px-4">
            <Text {...props} className='flex-1 max-w-12 text-center text-sm font-bold'>{quantity} {uom.toUpperCase()}</Text>
        </Badge>
    )
}