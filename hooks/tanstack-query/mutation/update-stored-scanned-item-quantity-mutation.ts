import { updateScannedItemQuantity } from "@/data-access-layer/update/update-stored-scanned-item-quantity";
import { useMutation } from "@tanstack/react-query";

export const useUpdateScannedItemQuantityMutation = () => {
  return useMutation({
    mutationKey: ["update-scanned-item-quantity"],
    mutationFn: (payload: { storedScannedItemId: string; quantity: string }) =>
      updateScannedItemQuantity(payload),
    networkMode: "offlineFirst",
  });
};
