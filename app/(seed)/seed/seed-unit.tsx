"use client"
import Container from "@/components/container"
import {
    Button
} from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { db } from "@/drizzle/db"
import { unitTable } from "@/drizzle/schema"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { eq } from "drizzle-orm"
import { FlatList, View } from "react-native"
import { NavLink } from "."
import { SeedItemDisplayCard } from "./seed-suppliers"


export const useGetUnit = () => {
    return useQuery({
        queryKey: ["seed-unit"],
        queryFn: async () => {
            return await db.select().from(unitTable)
        }
    })
}


const seedUnit = async () => {
    await db.insert(unitTable).values([
        {
            packing: 12,
            unitName: 'OU1'
        },
        {
            packing: 6,
            unitName: 'OU2'
        },
        {
            packing: 3,
            unitName: 'OU3'
        },
        {
            packing: 24,
            unitName: 'CT'
        },
        {
            packing: 48,
            unitName: 'CT1'
        },
        {
            packing: 96,
            unitName: 'CT2'
        },
        {
            packing: 1,
            unitName: 'KG'
        },
        {
            packing: 1,
            unitName: 'PC'
        },
        {
            packing: 1,
            unitName: 'BAG'
        },
    ])


}



export default function SeedUnit() {
    const qc = useQueryClient()
    const { data, isSuccess } = useGetUnit()

    const handleSeedUnit = async () => {
        await seedUnit()
        await qc.invalidateQueries({ queryKey: ['get-unit'] })
    }

    if (!isSuccess) return (
        <View className="my-3">
            <NavLink />
        </View>
    )

    return (
        <Container>
            <View className="my-3">
                <NavLink />
            </View>

            <Button onPress={handleSeedUnit}>
                <Text>Seed Item</Text>
            </Button>

            <View>
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => (
                        <SeedItemDisplayCard
                            label={`${item.unitName}  -   #${index + 1}`}
                            onDelete={async () => {
                                await db.delete(unitTable).where(eq(unitTable.id, item.id))
                            }}
                            onCopy={() => { }}
                            disabled={false}

                        />
                    )}
                />
            </View>
        </Container >
    )
}