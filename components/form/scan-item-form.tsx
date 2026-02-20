import { multitaskVariantValues } from "@/constants";
import { useGetStoredScannedItems } from "@/hooks/tanstack-query/item-query";
import { useGetItemDetailsMutationWithFeature } from "@/hooks/tanstack-query/mutation/get-item-details-mutation";
import { useCountDown } from "@/hooks/use-count-down";
import { useDefaultUnitFromItemDetails } from "@/hooks/use-default-unit";
import {
  getSecureStoreValueFor,
  saveIntoSecureStore,
} from "@/lib/secure-store";
import { cn } from "@/lib/utils";
import {
  ScanItemFormData,
  scanItemFormSchema,
} from "@/schema/scan-item-form-schema";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Pressable, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import InputField from "../input-field";
import { ItemDetails } from "../item-details";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Text } from "../ui/text";
import { useInsertStoredScannedItemMutation } from "@/hooks/tanstack-query/mutation/insert-stored-scanned-item-mutation";

export default function ScanItemForm() {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  const { isTimerFinish, startTimer } = useCountDown(5);
  const quantityInputRef = React.useRef<any>(null);
  const barcodeInputRef = React.useRef<any>(null);
  const { refetch: refetchStoredItems } = useGetStoredScannedItems();
  const {
    mutate: getItemDetailsMutation,
    data: itemDetails,
    reset: resetItemDetailsMutation,
  } = useGetItemDetailsMutationWithFeature();
  const units = React.useMemo(
    () => itemDetails?.data?.units ?? [],
    [itemDetails],
  );

  //! React-hook-form
  const form = useForm<ScanItemFormData>({
    resolver: zodResolver(scanItemFormSchema),
    defaultValues: {
      barcode: "",
      unitId: itemDetails?.data?.unitId ?? "",
      quantity: 1,
      isAdvanceModeEnable: false,
      scanFor: undefined,
    },
  });
  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue: setFormValue,
    getValues: getFormValues,
  } = form;
  const isAdvanceModeEnable = useWatch({
    control,
    name: "isAdvanceModeEnable",
  });
  const scanFor = useWatch({ control, name: "scanFor" });

  //! Tanstack mutation hook
  const { mutate: insertStoredScannedItemMutation } =
    useInsertStoredScannedItemMutation();

  //! handle submit function
  const onSubmit = handleSubmit(async (value) => {
    insertStoredScannedItemMutation(value, {
      async onSuccess({ data, msg }) {
        Toast.show({
          type: data ? "success" : "error",
          text1: msg,
        });
        if (!data) return;
        refetchStoredItems();
        resetItemDetailsMutation();
      },
    });
    const currentAdvanceMode = getFormValues("isAdvanceModeEnable");
    const currentScanFor = getFormValues("scanFor");

    resetForm({
      barcode: "",
      unitId: "",
      quantity: 1,
      isAdvanceModeEnable: currentAdvanceMode,
      scanFor: currentAdvanceMode ? (currentScanFor ?? "Inventory") : undefined,
    });

    barcodeInputRef.current?.focus();
  });

  //! handle submit function
  const handleOnSubmitEditing = React.useCallback(
    (code: string) => {
      if (!code) {
        setFormValue("unitId", "");
        return;
      }

      getItemDetailsMutation(
        {
          barcode: code,
          isAdvanceModeEnable,
          scanFor,
        },
        {
          onSuccess(data) {
            if (data.data) {
              Toast.show({
                type: "success",
                text1: "item found",
              });
              quantityInputRef.current?.focus();
              return;
            }
          },
        },
      );
    },
    [getItemDetailsMutation, isAdvanceModeEnable, scanFor, setFormValue],
  );

  const handleBarcodeSubmit = React.useCallback(() => {
    const barcode = getFormValues("barcode");
    handleOnSubmitEditing(barcode);
  }, [getFormValues, handleOnSubmitEditing]);

  useDefaultUnitFromItemDetails(form, itemDetails?.data);

  useEffect(() => {
    const loadAdvanceMode = async () => {
      const storedIsAdvanceModeEnable = await getSecureStoreValueFor<boolean>(
        "isAdvanceModeEnable",
      );
      const storedScanFor = await getSecureStoreValueFor<
        (typeof multitaskVariantValues)[number] | undefined
      >("scanFor");
      console.log({ storedIsAdvanceModeEnable });
      resetForm({
        ...getFormValues(),
        barcode: "",
        unitId: "",
        isAdvanceModeEnable: storedIsAdvanceModeEnable,
        scanFor: storedIsAdvanceModeEnable
          ? (storedScanFor ?? "Inventory")
          : undefined,
      });
      console.log({ getFormValues: getFormValues() });
      setIsHydrated(true);
    };
    loadAdvanceMode();
  }, [setFormValue, getFormValues, resetForm]);

  useEffect(() => {
    if (!isHydrated) return;
    const sync = async () => {
      await saveIntoSecureStore("isAdvanceModeEnable", isAdvanceModeEnable);
      await saveIntoSecureStore("scanFor", scanFor);
    };
    sync();
  }, [isHydrated, isAdvanceModeEnable, scanFor]);

  if (!isHydrated) return null;

  return (
    <>
      <Form {...form}>
        <View className="gap-1.5">
          {/* Barcode Input */}
          <FormField
            control={control}
            name="barcode"
            render={({ field }) => (
              <View className="relative">
                <InputField
                  ref={barcodeInputRef}
                  placeholder="Barcode/Item-Code"
                  keyboardType="numeric"
                  returnKeyType="next"
                  onChangeText={field.onChange}
                  value={field.value}
                  onSubmitEditing={handleBarcodeSubmit}
                />

                {/* Clear Button */}
                {field.value.length > 0 ? (
                  <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <TouchableOpacity
                      onPress={async () => {
                        resetForm();
                        resetItemDetailsMutation();
                      }}
                    >
                      <Feather name="x-circle" size={24} />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          />

          {/* UOM & Quantity Container Start */}
          <View className="flex-row items-center gap-1">
            {/* UOM Select Input */}
            <View className="flex-1">
              <FormField
                name="unitId"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(option) => {
                          field.onChange(option?.value);
                        }}
                        value={{
                          value: field.value,
                          label:
                            units.find((u) => u.id === field.value)?.unitName ??
                            "Select an unit",
                        }}
                        disabled={!itemDetails}
                      >
                        <SelectTrigger
                          onLayout={(e) =>
                            setTriggerWidth(e.nativeEvent.layout.width)
                          }
                          disabled={!itemDetails || !itemDetails.data}
                        >
                          <SelectValue placeholder="UOM" />
                        </SelectTrigger>
                        <SelectContent style={{ width: triggerWidth }}>
                          <SelectGroup>
                            <SelectLabel>Units</SelectLabel>
                            {(itemDetails && itemDetails.data
                              ? itemDetails.data.units
                              : []
                            ).map((unit, i) => (
                              <SelectItem
                                value={unit?.id ?? "N/A"}
                                label={`${unit.unitName ?? "N/A"} (${unit.packing})`}
                                key={unit.id}
                              />
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </View>

            {/* Quantity Input */}
            <View className="flex-1">
              <FormField
                control={control}
                name="quantity"
                render={({ field }) => (
                  <InputField
                    {...field}
                    ref={quantityInputRef}
                    placeholder="Quantity"
                    keyboardType="numeric"
                    returnKeyType="go"
                    value={field.value.toString()}
                    onChangeText={field.onChange}
                    onSubmitEditing={onSubmit}
                  />
                )}
              />
            </View>
          </View>
          {/* UOM & Quantity Container Finish */}

          <FormField
            name="isAdvanceModeEnable"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <View className="flex-row items-center justify-between">
                    <Label>Advance Mode</Label>
                    <Switch
                      onCheckedChange={(isEnable) => {
                        field.onChange(isEnable);
                        setFormValue(
                          "scanFor",
                          isEnable ? "Inventory" : undefined,
                        );
                      }}
                      checked={field.value}
                    />
                  </View>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Multitask Scan*/}
          {isAdvanceModeEnable && (
            <FormField
              control={control}
              name="scanFor"
              render={({ field }) => (
                <FormItem>
                  <View className="flex-row items-center gap-3">
                    <Label className="font-semibold">Scan For</Label>
                    <Pressable onPress={startTimer}>
                      <Text className="">
                        <Feather name="info" size={18} />
                      </Text>
                    </Pressable>
                  </View>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex-row gap-0"
                    >
                      {multitaskVariantValues.map((variant) => {
                        const isActive = getFormValues("scanFor") === variant;
                        return (
                          <Pressable
                            onPress={() => field.onChange(variant)}
                            key={variant}
                            className={cn(
                              "flex-1 rounded-md",
                              isActive ? "bg-black" : "",
                            )}
                          >
                            <Text
                              className={cn(
                                "py-1 text-center font-semibold",
                                isActive && "text-white",
                              )}
                            >
                              {variant}{" "}
                              {isActive && (
                                <FontAwesome6
                                  name="check"
                                  color="#fff"
                                  size={14}
                                />
                              )}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  {!isTimerFinish && (
                    <FormDescription>
                      By using this feature merchandiser can scan multi type
                      inventory at the same time. Like{" "}
                      <Text className="font-semibold text-sm">
                        Inventory, Shelf tags, Order
                      </Text>
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          )}
        </View>
        <Separator className="my-3" />
        <View>
          {itemDetails && itemDetails.data && (
            <>
              <ItemDetails
                header={{ title: "Item Details", description: "Scanned item" }}
                item={{
                  description: itemDetails.data?.description ?? "N/A",
                  item_code: itemDetails.data?.item_code,
                  price: itemDetails.data?.price,
                  unit: itemDetails.data?.unitName,
                  isAlreadyScanned: false,
                }}
              />
              <Separator className="my-3" />
            </>
          )}
        </View>
      </Form>
    </>
  );
}
