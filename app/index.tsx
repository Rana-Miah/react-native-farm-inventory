import 'react-native-get-random-values';

import Container from "@/components/container";
import ScanItemForm from "@/components/form/scan-item-form";
import ScannedItemCard from "@/components/scanned-item-card";
import { Separator } from "@/components/ui/separator";
import { FlatList, View } from "react-native";


import { db } from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";

import { Text } from "@/components/ui/text";
import { items } from "@/constants";
import { useScannedItem } from "@/hooks/redux";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

export default function Index() {

  const { success, error } = useMigrations(db, migrations);
  const { scannedItem } = useScannedItem()

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  return (
    <Container>
      <View className="flex-col ">
        <View className="w-full">
          <ScanItemForm />
          <Separator className="my-3" />
          {
            scannedItem && (
              <>
                {/* <ItemDetails header={{ title: "Item Details", description: "Scanned item" }} item={scannedItem} /> */}
                <Text>{
                  JSON.stringify(scannedItem)
                }</Text>
                <Separator className="my-3" />
              </>
            )
          }
        </View>
      </View>


      {/* scanned items */}
      <FlatList
        className="pb-0 flex-1"
        showsVerticalScrollIndicator={false}
        data={items}
        renderItem={({ item }) => (
          <ScannedItemCard
            key={item.barcode}
            item={item}
          />
        )}
      />
    </Container>
  );
}
