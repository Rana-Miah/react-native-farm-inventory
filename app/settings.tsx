import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { db } from '@/drizzle/db'
import { itemTable, supplierTable } from '@/drizzle/schema'
import main from '@/drizzle/seed'
import { FontAwesome6 } from '@expo/vector-icons'
import React from 'react'
import { FlatList, View } from 'react-native'

type Supplier = typeof supplierTable.$inferSelect
type Item = typeof itemTable.$inferSelect

const Settings = () => {

  const [suppliers, setSuppliers] = React.useState<Supplier[]>([])
  const [items, setItems] = React.useState<Item[]>([])

  React.useEffect(() => {
    const getSuppliers = async () => {
      const suppliers = await db.select().from(supplierTable)
      setSuppliers(suppliers)
    }
    const getItems = async () => {
      const items = await db.select().from(itemTable)
      setItems(items)
    }

    getSuppliers()
    getItems()
  }, [suppliers])

  const onDelete = async (id: string) => {
    // await db.delete(itemTable).where(eq(itemTable.id, id))
  }

  return (
    <Container>
      <View className='flex-1 items-center justify-center'>
        <Button onPress={main}>
          <Text>Seed</Text>
        </Button>

        <View>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View className='flex-1 flex-row px-3 py-2 items-center justify-between'>
                <Text className='px-3 py-1'>{item.item_code}</Text>
                <Button
                  onPress={() => onDelete(item.id)}
                // disabled={items.length === 5}
                >
                  <Text>
                    <FontAwesome6 name='trash' />
                  </Text>
                </Button>
              </View>
            )}
          />
        </View>
      </View>
    </Container>
  )
}

export default Settings