import 'react-native-get-random-values';

import Container from "@/components/container";
// import ScanItemForm from "@/components/form/scan-item-form";
import ScannedItemCard from "@/components/scanned-item-card";
import { FlatList, View } from "react-native";


import { db } from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";

import { EmptyState } from '@/components/empty-state';
import ScanItemForm from '@/components/form/scan-item-form';
import { Text } from "@/components/ui/text";
import { useGetStoredScannedItems } from '@/hooks/tanstack-query/item-query';
import { Feather } from '@expo/vector-icons';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

export default function Index() {

  const { success, error } = useMigrations(db, migrations);
  const { data } = useGetStoredScannedItems()

  const storedScannedItems = data ? data : []

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

        </View>
      </View>

      {/* scanned items */}
      {
        storedScannedItems.length > 0 ? (
          <FlatList
            className="pb-0 flex-1"
            showsVerticalScrollIndicator={false}
            data={storedScannedItems}
            renderItem={({ item }) => (
              <ScannedItemCard
                key={item.barcode}
                item={item}
                isCollapseAble
                defaultCollapse={false}
              />
            )}
          />
        ) : (
          <EmptyState
            icon={<Feather name='package' size={28} />}
          />
        )
      }
    </Container>
  );
}
