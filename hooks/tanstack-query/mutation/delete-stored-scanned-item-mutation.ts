import { deleteScannedItem } from "@/data-access-layer/insert/insert-stored-scanned-item";
import { useMutation } from "@tanstack/react-query";

export const useDeleteScannedItemQuantityMutation = () => {
  return useMutation({
    mutationKey: ["update-scanned-item-quantity-mutation"],
    mutationFn: (id: string) => deleteScannedItem(id),
    networkMode: "offlineFirst",
  });
};
