import Container from "@/components/container";
import { Column, DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <Container>
      <View className="flex-col">
        <View className="w-full">
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

      <View>


        <DataTable
        data={data}
        columns={columns}
        />

      </View>
    </Container>
  );
}



const data = [
  {
    id: "1",
    barcode: "8901030890123",
    uom: "PCS",
    quantity: 120,
  },
  {
    id: "2",
    barcode: "9780201379624",
    uom: "BOX",
    quantity: 45,
  },
  {
    id: "3",
    barcode: "6294001234567",
    uom: "KG",
    quantity: 18,
  },
  {
    id: "4",
    barcode: "012345678905",
    uom: "LITER",
    quantity: 60,
  },
  {
    id: "5",
    barcode: "8806098765432",
    uom: "PCS",
    quantity: 250,
  },
];

const columns:Column<typeof data[number]>[]  = [
  {
    key: "barcode",
    title: "Barcode",
  },
  {
    key: "uom",
    title: "UOM",
  },
  {
    key: "quantity",
    title: "Quantity",
    render: (value) => (
      <Text className="font-semibold text-blue-600">
        {value}
      </Text>
    ),
  },
];
