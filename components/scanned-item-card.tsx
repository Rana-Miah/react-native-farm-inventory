import { StoredItem } from "@/data-access-layer/get-item";
import { copyToClipboard } from "@/lib/utils";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { DetailsRow } from "./details-row";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

type WithActionBtn = {
  item: StoredItem;
  enableActionBtn?: true;
  defaultCollapse: boolean;
  isCollapseAble: boolean;
  onUpdate: (item: StoredItem) => void;
  onDelete: (item: StoredItem) => void;
};
type WithoutActionBtn = {
  item: StoredItem;
  enableActionBtn?: false;
  defaultCollapse?: boolean;
  isCollapseAble?: boolean;
  onUpdate?: (item: StoredItem) => void;
  onDelete?: (item: StoredItem) => void;
};
type ScannedItemCardProps = WithActionBtn | WithoutActionBtn;

const ScannedItemCard = ({
  item,
  enableActionBtn,
  isCollapseAble,
  defaultCollapse,
  onDelete,
  onUpdate,
}: ScannedItemCardProps) => {
  const [isEditState, setIsEditState] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(
    () => defaultCollapse ?? false,
  );

  const quantityRef = React.useRef<any>(null);

  const form = useForm({
    defaultValues: {
      quantity: item.quantity,
    },
  });

  const onSubmit = form.handleSubmit((params) => {
    if (!!onUpdate && item.quantity !== params.quantity) {
      onUpdate({
        ...item,
        quantity: params.quantity,
      });
    }
    setIsEditState(false);
  });

  React.useEffect(() => {
    if (!isEditState) {
      form.reset({
        quantity: item.quantity,
      });
    }
  }, [isEditState, item.quantity, form]);

  return (
    <Card className="bg-white border-muted my-0.5 p-2 gap-4">
      <TouchableOpacity onPress={() => setIsCollapsed((prev) => !prev)}>
        <CardHeader className="flex-row items-center justify-between px-0">
          <View className="w-2/3">
            <View className="flex-row items-center gap-1">
              <CardTitle className="text-black">BARCODE</CardTitle>

              {item.scanFor && (
                <Badge variant={"outline"} className="sha">
                  <Text>
                    {item.scanFor === "Inventory" ? "Inv" : item.scanFor}
                  </Text>
                </Badge>
              )}
            </View>

            <CardDescription className="text-black">
              {item.barcode}
            </CardDescription>
          </View>

          <View>
            {enableActionBtn ? (
              <>
                {!isEditState ? (
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    onPress={() => {
                      onDelete(item);
                    }}
                  >
                    <FontAwesome6 name={"trash"} size={14} color={"#fff"} />
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    className="bg-[#E8F1FC]"
                    size={"sm"}
                    onPress={onSubmit}
                  >
                    <FontAwesome6 name={"save"} color={"#124DA1"} size={14} />
                  </Button>
                )}
              </>
            ) : (
              <ItemQuantityUnit
                quantity={item.quantity}
                uom={item.unitName ?? "N/A"}
                onPress={() => setIsEditState((prev) => !prev)}
              />
            )}
          </View>
        </CardHeader>
      </TouchableOpacity>

      {isCollapseAble && !isCollapsed && (
        <>
          <CardContent className="flex-col gap-2 px-0 py-0">
            <View className="flex-row items-center">
              <View className="flex-1">
                <DetailsRow
                  icon={{ library: "FontAwesome", name: "hashtag" }}
                  label="item code"
                  value={item.item_code ?? "N/A"}
                />
              </View>
              <Button
                variant={"outline"}
                className="flex-row items-center gap-1"
                size={"sm"}
                onPress={async () => {
                  await copyToClipboard(item.barcode ?? "");
                }}
              >
                <Text className="text-muted-foreground">
                  <FontAwesome6 name="copy" color="#000" />
                </Text>
                <Text className="text-black">Barcode</Text>
              </Button>
            </View>
            <DetailsRow
              icon={{ library: "FontAwesome", name: "file-text" }}
              label="description"
              value={item.description ?? "N/A"}
            />
          </CardContent>
          {enableActionBtn && (
            <>
              <Separator />
              <CardFooter className="items-center justify-between px-0">
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center justify-center w-8 h-8 bg-[#E8F1FC] rounded-md">
                    <MaterialIcons
                      name={"layers"}
                      color={"#124DA1"}
                      size={20}
                    />
                  </View>
                  <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Quantity
                  </Text>
                </View>

                {isEditState ? (
                  <View>
                    <Controller
                      control={form.control}
                      name="quantity"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          ref={quantityRef}
                          className="h-8 w-28" // same height & width as badge
                          returnKeyType="go"
                          keyboardType="numeric"
                          onSubmitEditing={onSubmit}
                          onChangeText={onChange}
                          value={value.toString()}
                        />
                      )}
                    />
                  </View>
                ) : (
                  <ItemQuantityUnit
                    quantity={item.quantity}
                    uom={item.unitName ?? "N/A"}
                    onPress={() => {
                      setIsEditState((prev) => !prev);
                      quantityRef.current?.focus();
                    }}
                  />
                )}
              </CardFooter>
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default ScannedItemCard;

type ItemQuantityUnitProps = {
  quantity: number;
  uom: string;
} & React.ComponentProps<typeof Text>;

const ItemQuantityUnit = ({
  quantity,
  uom,
  ...props
}: ItemQuantityUnitProps) => {
  return (
    <Badge variant="outline" className="rounded-full px-2.5">
      <Text {...props} className="text-center text-sm ">
        {quantity} - {uom.toUpperCase()}
      </Text>
    </Badge>
  );
};
