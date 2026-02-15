"use client"
import Container from "@/components/container"
import {
    Button
} from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { suppliers } from "@/constants/supplier"
import { db } from "@/drizzle/db"
import { supplierTable } from "@/drizzle/schema"
import { useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm"
import { useEffect, useState, useTransition } from "react"
import { FlatList, View } from "react-native"
import { NavLink } from "."


export const useGetSupplier = () => {
    return useQuery({
        queryKey: ["seed-supplier"],
        queryFn: async () => {
            return await db.select().from(supplierTable)
        }
    })
}


const seedSupplier = async () => {
    console.log('Start database seeding!');

    const suppliersSeed = suppliers.map(({ id, ...res }) => (res))
    await db.insert(supplierTable).values(suppliersSeed)
}



export default function SeedItemFrom() {
    const [, startTransition] = useTransition()
    const [, setItems] = useState<any[]>([])
    const { data, isError } = useGetSupplier()

    function onSubmit() {
        startTransition(
            async () => {
                await seedSupplier()
                console.log('Finish database seeding!');

            }
        )
    }

    useEffect(() => {
        const seed = async () => {
            const data = await db.select().from(supplierTable)
            setItems(data)
        }

        seed()
    }, [])



    if (isError) return (
        <View className="my-3">
            <NavLink />
        </View>
    )

    return (
        <Container>
            <View className="my-3">
                <NavLink />
            </View>



            <Button onPress={onSubmit}>
                <Text>Seed Supplier</Text>
            </Button>

            <View>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <SeedItemDisplayCard
                            label={item.supplierCode}
                            onDelete={async () => {
                                await db.delete(supplierTable).where(eq(supplierTable.id, item.id))
                            }}
                            onCopy={() => { }}
                            disabled={data?.length === 5}

                        />
                    )}
                />
            </View>
        </Container>
    )
}



export const SeedItemDisplayCard = ({ label, disabled, onDelete, onCopy }: { label: string; disabled: boolean, onDelete: () => void, onCopy: () => void }) => {
    return (
        <View className="flex-row items-center justify-between gap-2 px-3 py-2">
            <Text>{label}</Text>
            <View className="flex-row items-center gap-1">
                <Button size={'sm'} disabled={disabled} onPress={onDelete}>
                    <Text>Delete</Text>
                </Button>
                <Button size={'sm'} disabled={disabled} onPress={onCopy}>
                    <Text>Copy</Text>
                </Button>
            </View>
        </View>
    )
}