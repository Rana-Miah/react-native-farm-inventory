import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

type UseRestoreQuantityParams = {
  form: UseFormReturn<{ quantity: number }>;
  quantity: number;
};

export const useRestoreQuantity = ({
  form,
  quantity,
}: UseRestoreQuantityParams) => {
  const [isEditState, setIsEditState] = useState(false);
  useEffect(() => {
    if (!isEditState) {
      form.reset({ quantity });
    }
  }, [isEditState, form, quantity]);

  return { isEditState, setIsEditState };
};
