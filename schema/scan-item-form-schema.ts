import { multitaskVariantValues } from "@/constants"
import * as z from "zod"

export const withAdvanceMode = z.object({
  barcode: z.string().min(1, "Barcode is required"),
  unitId: z.string().min(1, "UOM is required"),
  quantity: z.coerce.number<number>().positive().min(1, "Quantity must be at least 1").gt(0, "Quantity must be greater than 0"),
  isAdvanceModeEnable:z.literal(true),
  scanFor:z.enum(multitaskVariantValues).nonoptional()
})
export const withoutAdvanceMode = z.object({
  barcode: z.string().min(1, "Barcode is required"),
  unitId: z.string().min(1, "UOM is required"),
  quantity: z.coerce.number<number>().positive().min(1, "Quantity must be at least 1").gt(0, "Quantity must be greater than 0"),
  isAdvanceModeEnable:z.literal(false),
  scanFor:z.enum(multitaskVariantValues).optional()
})

export const scanItemFormSchema = z.discriminatedUnion(
  'isAdvanceModeEnable',
  [
    withAdvanceMode,
    withoutAdvanceMode
  ]
)

export type ScanItemFormData = z.infer<typeof scanItemFormSchema>