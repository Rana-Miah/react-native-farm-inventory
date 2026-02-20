import { insertScannedItem } from "@/data-access-layer/insert/insert-stored-scanned-item";
import { ScanItemFormData } from "@/schema/scan-item-form-schema";
import { useMutation } from "@tanstack/react-query";

export const useInsertStoredScannedItemMutation = () => {
  return useMutation({
    mutationKey: ["insert-stored-scanned-item"],
    mutationFn: (payload: ScanItemFormData) => insertScannedItem(payload),
    networkMode: "offlineFirst",
  });
};
