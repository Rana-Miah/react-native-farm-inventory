"use client"
import Container from "@/components/container"
import {
    Button
} from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { db } from "@/drizzle/db"
import { barcodeTable, itemTable, unitTable } from "@/drizzle/schema"
import { randomInt, randomPrice } from "@/drizzle/seed/seeding-factory"
import { copyToClipboard } from "@/lib/utils"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { desc, eq } from "drizzle-orm"
import { useTransition } from "react"
import {
    useForm
} from "react-hook-form"
import { FlatList, View } from "react-native"
import {
    z
} from "zod"
import { NavLink } from "."
import { SeedItemDisplayCard } from "./seed-suppliers"

const formSchema = z.object({
    seedQuantity: z.string(),
    item_code: z.string(),
});


const useGetBarcode = () => {
    return useQuery({
        queryKey: ["seed-barcode"],
        queryFn: async () => {

            return await db.select().from(barcodeTable)

        }
    })
}


const seedItem = async ({ item_code, seedQuantity }: z.infer<typeof formSchema>) => {
    const [item] = await db.select({ id: itemTable.id, description: itemTable.item_description }).from(itemTable).where(eq(itemTable.item_code, item_code))
    if (!item) return { data: null, msg: "Item not exist!" }

    const units = await db.select().from(unitTable)
    const unitLength = units.length - 1

    for (let i = 0; i < Number(seedQuantity); i++) {
        const [barcode] = await db.select({ barcode: barcodeTable.barcode, unitId: barcodeTable.unitId }).from(barcodeTable).orderBy(desc(barcodeTable.barcode))

        const lastBarcode = barcode ? (Number(barcode.barcode) + 1).toString() : "6285696558241"

        const unitIndex = randomInt(0, unitLength)
        let unit = units[unitIndex > unitLength ? unitLength : unitIndex]

        // console.log("=================================================================================================")
        // console.log({ unitLength, unitIndex })
        // console.log("=================================================================================================")
        // console.log({ unit ,unitId:unit.id})
        // console.log("=================================================================================================")
        // console.log({ units })
        // console.log("=================================================================================================")

        while (barcode && unit.id === barcode.unitId) {
            console.log({ isTrue: unit.id === barcode.unitId })
            unit = units[randomInt(0, unitLength)]
            console.log({ isTrue: unit.id === barcode.unitId })
        }

        await db.insert(barcodeTable).values({
            barcode: lastBarcode,
            itemId: item.id,
            price: randomPrice(),
            unitId: unit.id,
            description: item.description
        })
    }
}



export default function SeedItemFrom() {
    const [pending, startTransition] = useTransition()
    const { data: barcodes, isSuccess: barcodeIsSuccess } = useGetBarcode()
    const qc = useQueryClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item_code: "01010101-00"
        }
    })

    const onSubmit = form.handleSubmit(values => {
        startTransition(
            async () => {
                await seedItem(values)
                await qc.invalidateQueries({ queryKey: ['seed-barcode'] })
            }
        )
    })
    if (!barcodeIsSuccess) return (
        <View className="my-3">
            <NavLink />
        </View>
    )

    return (
        <Container>
            <View className="my-3">
                <NavLink />
            </View>
            <Form {...form}>
                <FormField
                    control={form.control}
                    name="seedQuantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Seed Quantity"
                                    returnKeyType="next"
                                    onChangeText={field.onChange}
                                    value={field.value}
                                    editable={!pending}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="item_code"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Seed Quantity"
                                    returnKeyType="go"
                                    onChangeText={field.onChange}
                                    value={field.value}
                                    editable={!pending}
                                    onSubmitEditing={()=>onSubmit()}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button onPress={onSubmit} disabled={pending}>
                    <Text>Seed Barcode</Text>
                </Button>
            </Form>

            <FlatList
                data={barcodes}
                renderItem={({ item, index }) => (
                    <SeedItemDisplayCard
                        label={`${item.barcode}  -   #${index + 1}`}
                        onDelete={async () => {
                            await db.delete(barcodeTable).where(eq(barcodeTable.id, item.id))
                            qc.invalidateQueries({ queryKey: ['seed-barcode'] })
                        }}
                        onCopy={async () => { await copyToClipboard(item.barcode) }}

                        disabled={false}

                    />
                )}
            />
        </Container>
    )
}