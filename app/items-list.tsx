import AlertModal from "@/components/alert-modal";
import Container from "@/components/container";
import ScannedItemCard from "@/components/scanned-item-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { StoredItem } from "@/data-access-layer/get-item";
import { useAlertModal, useAppDispatch } from "@/hooks/redux";
import {
  useGetStoredScannedItems,
  useGetStoredScannedItemsSearch,
} from "@/hooks/tanstack-query/item-query";
import { useDeleteScannedItemQuantityMutation } from "@/hooks/tanstack-query/mutation/delete-stored-scanned-item-mutation";
import { useUpdateScannedItemQuantityMutation } from "@/hooks/tanstack-query/mutation/update-stored-scanned-item-quantity-mutation";

import { onClose, onOpen } from "@/lib/redux/slice/alert-modal-slice";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import Toast from "react-native-toast-message";

type ActionState = { type: "update" | "delete"; item: StoredItem } | null;

const ItemsList = () => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const { data: allData, refetch } = useGetStoredScannedItems();
  const { data: searchedData, refetch: refetchSearch } =
    useGetStoredScannedItemsSearch(searchInputValue);
  const [actionState, setActionState] = useState<ActionState>(null);
  const { mutate: deleteMutate } = useDeleteScannedItemQuantityMutation();
  const { mutate: updateMutate } = useUpdateScannedItemQuantityMutation();
  const qs = useQueryClient();
  const { isOpen, type } = useAlertModal();
  const isUpdateAlertModalOpen = type === "update" && isOpen;
  const isDeleteAlertModalOpen = type === "delete" && isOpen;
  const dispatch = useAppDispatch();

  const data = searchInputValue.length > 0 ? searchedData : allData;
  const actionItem = actionState && actionState.item;

  const currentItem = (data ?? []).find(
    (item) => item.storedId === actionItem?.storedId,
  );

  const onUpdate = () => {
    if (actionState && actionState.type === "update") {
      dispatch(onClose());

      updateMutate(
        {
          quantity: actionState.item.quantity.toString(),
          storedScannedItemId: actionState.item.storedId,
        },
        {
          async onSuccess(data) {
            await qs.invalidateQueries({
              queryKey: ["get-stored-scanned-items-search", searchInputValue],
            });
            if (searchInputValue.length > 0) {
              refetchSearch();
            }
            if (!data.data) {
              Toast.show({
                type: "error",
                text1: data?.msg,
              });
              return;
            }
            refetch();
            Toast.show({
              type: "success",
              text1: data?.msg,
            });
          },
        },
      );
    }
  };

  const onDelete = () => {
    if (actionState && actionState.type === "delete") {
      deleteMutate(actionState.item.storedId, {
        async onSuccess(data) {
          if (searchInputValue.length > 0) {
            refetchSearch();
          }
          refetch();
          dispatch(onClose());
          Toast.show({
            type: "success",
            text1: data.msg,
          });
        },
      });
    }
  };

  const updateAlertTitle = `Current quantity ${currentItem?.quantity} will update to ${actionItem?.quantity}`;
  const updateAlertDescription = actionItem?.description ?? "";

  return (
    <Container>
      <AlertModal
        isOpen={isUpdateAlertModalOpen}
        onCancel={() => dispatch(onClose())}
        onConfirm={onUpdate}
        title={updateAlertTitle}
        description={updateAlertDescription}
      />
      <AlertModal
        isOpen={isDeleteAlertModalOpen}
        onCancel={() => dispatch(onClose())}
        onConfirm={onDelete}
        title="Sure? Scanned item will be delete!"
        description={
          (actionState &&
            actionState.type === "delete" &&
            actionState.item.description) ||
          ""
        }
      />

      <View className="flex-1 flex-col items-between justify-center gap-1">
        {/* Inventory Save Form */}
        <View className="h-24 gap-2">
          <Input className="flex-1" placeholder="Item Title" />
          <Input
            className="flex-1"
            placeholder="Search"
            onChangeText={(value) => {
              setSearchInputValue(value);
            }}
            value={searchInputValue}
          />
        </View>

        {/* scanned items */}
        <FlatList
          className="pb-0 flex-1"
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item, index }) => (
            <ScannedItemCard
              key={item.barcode}
              item={item}
              enableActionBtn
              isCollapseAble
              defaultCollapse={index !== 0}
              onDelete={(item) => {
                dispatch(onOpen("delete"));
                setActionState({ type: "delete", item });
              }}
              onUpdate={(item) => {
                dispatch(onOpen("update"));
                setActionState({ type: "update", item });
              }}
            />
          )}
        />

        {/* Buttons */}
        <View className="flex-row items-center justify-between py-2 gap-1">
          <Button variant="outline" size={"sm"} className="flex-1">
            <Text>Inventory</Text>
          </Button>
          <Button variant="outline" size={"sm"}>
            <Text>Tags</Text>
          </Button>
          <Button variant="outline" size={"sm"} className="flex-1">
            <Text>Order</Text>
          </Button>
          <Button variant="outline" size={"sm"}>
            <Text>Print</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
};

export default ItemsList;
