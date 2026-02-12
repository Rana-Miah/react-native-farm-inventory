import Container from "@/components/container";
import ScanItemForm from "@/components/form/scan-item-form";
import ScannedItemCard from "@/components/scanned-item-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { items } from "@/constants";
import { FlatList, View } from "react-native";


import { db } from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";

import { Text } from "@/components/ui/text";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

export default function Index() {

  const { success, error } = useMigrations(db, migrations);

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
          <Input
            placeholder="Barcode"
            className="w-full"
            keyboardType="numeric"
          />
        </View>
        <View className="flex-row items-center justify-between gap-2 w-full">

          <View className="flex-1">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select a fruit' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem label='Apple' value='apple'>
                    Apple
                  </SelectItem>
                  <SelectItem label='Banana' value='banana'>
                    Banana
                  </SelectItem>
                  <SelectItem label='Blueberry' value='blueberry'>
                    Blueberry
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>

          <View className="flex-1">
            <Input
              placeholder="Quantity"
              className="w-full"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>


      {/* scanned items */}
      <FlatList
        className="pb-0 flex-1"
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
