import Container from "@/components/container";
import ScanItemForm from "@/components/form/scan-item-form";
import ScannedItemCard from "@/components/scanned-item-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { items } from "@/constants";
import { FlatList, View } from "react-native";

export default function Index() {

  return (
    <Container>
      <View className="flex-col ">
        <View className="w-full">
          <ScanItemForm/>
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
      <View>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ScannedItemCard
              key={item.barcode}
              item={item}
            />
          )}
        />
      </View>
    </Container>
  );
}
