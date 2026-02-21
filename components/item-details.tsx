import React, { useState, useEffect } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { DetailsRow } from "./details-row";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { getItemDetailsByBarcodeWithAdvanceFeature } from "@/data-access-layer/get-item";
import { consoleLog } from "@/lib/log";
import { Button } from "./ui/button";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Separator } from "./ui/separator";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { ItemQuantityUnit } from "./scanned-item-card";
import { useRestoreQuantity } from "@/hooks/use-restore-quantity";
import AlertModal from "./alert-modal";
import { useDeleteScannedItemQuantityMutation } from "@/hooks/tanstack-query/mutation/delete-stored-scanned-item-mutation";
import { useGetStoredScannedItems } from "@/hooks/tanstack-query/item-query";
import { useGetItemDetailsMutationWithFeature } from "@/hooks/tanstack-query/mutation/get-item-details-mutation";
import { useUpdateScannedItemQuantityMutation } from "@/hooks/tanstack-query/mutation/update-stored-scanned-item-quantity-mutation";
import { useAlertModal, useAppDispatch } from "@/hooks/redux";
import { onClose, onOpen } from "@/lib/redux/slice/alert-modal-slice";

type ScannedItemCardHeader = {
  title: string;
  description?: string;
};

type Item = NonNullable<
  Awaited<ReturnType<typeof getItemDetailsByBarcodeWithAdvanceFeature>>["data"]
>;

type ScannedItemCardProps = {
  header: ScannedItemCardHeader;
  item: Item;
  onUpdate?: (item: Item, quantity: number) => void;
  onDelete?: (item: Item) => void;
};

export const ItemDetails = ({
  header,
  item,
  onUpdate,
  onDelete,
}: ScannedItemCardProps) => {
  const { isOpen, type } = useAlertModal();
  const [latestQuantity, setLatestQuantity] = useState(
    Number(item.storedItem?.quantity) ?? 1,
  );
  const dispatch = useAppDispatch();
  const form = useForm({
    defaultValues: {
      quantity: Number(item.storedItem?.quantity) ?? 0,
    },
  });

  const { isEditState, setIsEditState } = useRestoreQuantity({
    form,
    quantity: Number(item.storedItem?.quantity) ?? 0,
  });

  const onSubmitEditing = form.handleSubmit(({ quantity: latestQuantity }) => {
    setLatestQuantity(latestQuantity);
    dispatch(onOpen("update"));
  });

  const isDeleteAlertModalOpen = isOpen && type === "delete" && !!onDelete;
  const isUpdateAlertModalOpen = isOpen && type === "update" && !!onUpdate;

  const alertTitle = `Sure? Scanned order item will ${isDeleteAlertModalOpen ? "be deleted" : "update"}!`;
  const alertDescription =
    item && item.storedItem ? (item.storedItem.description ?? "") : "";

  const onConfirm = () => {
    if (
      isDeleteAlertModalOpen &&
      !!onDelete &&
      item.storedItem &&
      item.storedItem.storedId
    ) {
      consoleLog("delete modal");
      onDelete(item);
    }
    if (
      isUpdateAlertModalOpen &&
      !!onUpdate &&
      item.storedItem &&
      item.storedItem.storedId
    ) {
      onUpdate(item, latestQuantity);
      console.log({ latestQuantity });
      consoleLog("update modal");
    }
  };

  const { height } = useWindowDimensions();

  return (
    <>
      <AlertModal
        title={alertTitle}
        description={alertDescription}
        isOpen={isDeleteAlertModalOpen || isUpdateAlertModalOpen}
        onConfirm={onConfirm}
        onCancel={() => dispatch(onClose())}
      />
      {/* Item Details Card */}
      <ScrollView
        style={{ maxHeight: height * 0.4 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <Card className="bg-white border-muted my-1 p-3 gap-4">
          <CardHeader className="flex-row items-center justify-between px-0">
            <View>
              <CardTitle className="text-black">{header.title}</CardTitle>
              <CardDescription className="text-black">
                {header.description || ""}
              </CardDescription>
            </View>

            <View className="flex-row items-center gap-2 px-0">
              {item.storedItem ? (
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  onPress={() => dispatch(onOpen("delete"))}
                >
                  <FontAwesome6 name={"trash"} size={14} color={"#fff"} />
                </Button>
              ) : (
                <ItemPriceUnit
                  price={item.price}
                  uom={item?.unitName || "N/A"}
                />
              )}
            </View>
          </CardHeader>

          <CardContent className="flex-col gap-2 px-0 py-0">
            <DetailsRow
              icon={{ library: "FontAwesome", name: "hashtag" }}
              label="Item Code"
              value={item?.item_code ?? "N/A"}
            />
            <DetailsRow
              icon={{ library: "FontAwesome", name: "file-text" }}
              label="description"
              value={item?.description ?? "N/A"}
            />
          </CardContent>

          {item.storedItem && (
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
                    Order Quantity
                  </Text>
                </View>

                {isEditState ? (
                  <View>
                    <Controller
                      control={form.control}
                      name="quantity"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          className="h-8 w-28" // same height & width as badge
                          returnKeyType="go"
                          keyboardType="numeric"
                          onSubmitEditing={onSubmitEditing}
                          onChangeText={onChange}
                          onBlur={() => setIsEditState(false)}
                          value={value.toString()}
                        />
                      )}
                    />
                  </View>
                ) : (
                  <ItemQuantityUnit
                    quantity={Number(item.storedItem.quantity) ?? "0"}
                    uom={item.unitName ?? "N/A"}
                    onPress={() => {
                      setIsEditState((prev) => !prev);
                    }}
                  />
                )}
              </CardFooter>
            </>
          )}
        </Card>
      </ScrollView>
    </>
  );
};

type ItemPriceUnitProps = {
  price?: number;
  uom?: string;
} & React.ComponentProps<typeof Text>;

const ItemPriceUnit = ({ price, uom, ...props }: ItemPriceUnitProps) => {
  return (
    <Badge
      variant="outline"
      className="border-muted-foreground rounded-full px-4"
    >
      <Text {...props} className="text-center text-sm font-bold">
        SAR {price ?? 0} / {uom ?? "".toUpperCase()}
      </Text>
    </Badge>
  );
};
