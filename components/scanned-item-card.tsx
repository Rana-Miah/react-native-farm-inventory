import { items } from '@/constants'
import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'


const ScannedItemCard = ({ item }: { item: typeof items[number] }) => {
    return (
        <Card className='bg-white border-foreground my-2 p-3'>
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
                    <Button variant={'destructive'} size={'sm'}

                        onPress={() => alert('hello')}
                    >
                        <MaterialIcons name={'delete'} size={20} color={'#fff'} />
                    </Button>
                    <Button className='bg-[#E8F1FC]' size={'sm'} >
                        <MaterialIcons name={'edit'} color={'#124DA1'} size={20} />
                    </Button>
                </View>

            </CardHeader>

            <CardContent className='flex-col gap-2 px-0 py-0'>
                <Icon name='tag' label='item code' value={item.item_code} />
                <Icon name='description' label='description' value={item.description} />
            </CardContent>
            <Separator />
            <CardFooter
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
                <Badge
                    variant="outline"
                    className="border-muted-foreground rounded-full px-4 py-1 "
                >
                    <Text className='text-sm font-bold'>{item.quantity} {item.uom}</Text>
                </Badge>
            </CardFooter>
        </Card>
    )
}

export default ScannedItemCard

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

const Icon = ({
    name,
    label,
    value
}: { name: MaterialIconName, label: string, value: string }) => {

    return (

        <View className="flex-row items-center  gap-2 bg-white">
            <View className='flex-row items-center justify-center w-8 h-8 bg-[##E8F1FC] rounded-md'>
                <MaterialIcons name={name} color={"#124DA1"} size={20} />
            </View>
            <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                </Text>
                <Text className="flex-1 flex-wrap text-sm leading-relaxed font-semibold">
                    {value}
                </Text>
            </View>
        </View>
    )
}
