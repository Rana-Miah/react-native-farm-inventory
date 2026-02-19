"use client"
import Container from "@/components/container"
import {
    Button
} from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Text } from "@/components/ui/text"
import { items } from "@/constants/item"
import { db } from "@/drizzle/db"
import { itemTable, supplierTable } from "@/drizzle/schema"
import { randomInt } from "@/drizzle/seed/seeding-factory"
import { generateItemCode } from "@/lib/seed"
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
import { SeedItemDisplayCard, useGetSupplier } from "./seed-suppliers"

const formSchema = z.object({
    supplierId: z.string(),
    seedQuantity: z.string(),
});


const useGetItems = () => {
    return useQuery({
        queryKey: ["get-item"],
        queryFn: async () => {
            return await db.select().from(itemTable)
        }
    })
}



const seedItem = async ({ seedQuantity, supplierId }: { supplierId: string; seedQuantity: string }) => {
    if (!supplierId) return { data: null, msg: "supplier id missing!" }
    const [existSupplier] = await db.select().from(supplierTable).where(eq(supplierTable.id, supplierId))
    if (!existSupplier) return { data: null, msg: "supplier not exist!" }



    console.log(`Seeding start`)
    for (let i = 0; i < Number(seedQuantity); i++) {
        const [item] = await db.select({ item_code: itemTable.item_code }).from(itemTable).orderBy(desc(itemTable.item_code))
        console.log(item)
        const item_code = generateItemCode(item ? item.item_code : `01010101-0000`, 1)
        const randomDummyItemIndex = randomInt(0, items.length - 1)
        const item_description = items[randomDummyItemIndex].item_description
        await db.insert(itemTable).values({ item_code, item_description, supplierId: existSupplier.id })
    }
}



export default function SeedItemFrom() {
    const [pending, startTransition] = useTransition()
    const { data: suppliers, isSuccess: supIsSuccess } = useGetSupplier()
    const { data: items, isSuccess: itemIsSuccess, refetch, } = useGetItems()
    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    const onSubmit = form.handleSubmit(values => {
        console.log(values)
        startTransition(
            async () => {
                await seedItem(values)
                await queryClient.invalidateQueries({ queryKey: ['get-item'] })
                refetch()
                console.log(`seeding finish`)
            }
        )
    })


    if (!supIsSuccess || !itemIsSuccess) {
        return (
            <View className="my-3">
                <NavLink />
            </View>
        )
    }





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
                    name="supplierId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Select
                                    onValueChange={(option) => field.onChange(option?.value ?? field.value)}
                                    value={{
                                        value: field.value,
                                        label: suppliers.filter(s => s.id === field.value)[0]?.supplierCode ?? field.value
                                    }}
                                    disabled={pending}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            suppliers.map(s => (
                                                <SelectItem value={s.id} label={s.supplierCode} key={s.id} />
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button onPress={onSubmit} disabled={pending}>
                    <Text>Seed Item</Text>
                </Button>
            </Form>

            <FlatList
                data={items}
                renderItem={({ item, index }) => (
                    <SeedItemDisplayCard
                        label={`${item.item_code}  -   #${index + 1}`}
                        onDelete={async () => {
                            await db.delete(itemTable).where(eq(itemTable.id, item.id))
                            refetch()
                        }}
                        onCopy={async () => { await copyToClipboard(item.item_code) }}
                        disabled={false}

                    />
                )}
            />
        </Container>
    )
}