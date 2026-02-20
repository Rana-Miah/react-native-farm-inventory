import { db } from "@/drizzle/db";
import {
  barcodeTable,
  itemTable,
  storedScannedItemTable,
} from "@/drizzle/schema";
import {
  ScanItemFormData,
  scanItemFormSchema,
} from "@/schema/scan-item-form-schema";
import { and, eq } from "drizzle-orm";
import { getBarcodeByBarcode, getUnitById } from "../get-item";
import { consoleLog } from "@/lib/log";

export const insertScannedItem = async (payload: ScanItemFormData) => {
  const validation = scanItemFormSchema.safeParse(payload);
  if (!validation.success)
    return {
      msg: validation.error.message,
      data: null,
    };

  const { barcode, scanFor, isAdvanceModeEnable } = validation.data;

  const [existBarcode] = await db
    .select()
    .from(barcodeTable)
    .innerJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))
    .where(eq(barcodeTable.barcode, barcode));

  if (!existBarcode) return { msg: "Item Not Found", data: null };

  // is the unitid exist or not
  const existUnit = await getUnitById(payload.unitId);
  if (!existUnit) return { msg: "Item Not Found", data: null };

  /**
   * advance feature implement
   *
   * 1. is advance mode on
   * 2. is scan for order
   * 3. is there are any storedItems that already scanned for order
   * 4. if exist return the stored data
   *
   */
  const isScanForOrder = isAdvanceModeEnable && scanFor === "Order";

  if (isScanForOrder) {
    const storedItemsByItemCode = await db
      .select()
      .from(storedScannedItemTable)
      .innerJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))
      .rightJoin(
        barcodeTable,
        eq(barcodeTable.id, storedScannedItemTable.barcodeId),
      )
      .where(
        and(
          eq(itemTable.item_code, existBarcode.item.item_code),
          eq(storedScannedItemTable.scanFor, "Order"),
        ),
      );

    const hasStoredItems = storedItemsByItemCode.length > 0;

    if (hasStoredItems) {
      return {
        msg: "Duplicate Item not allow for ordering!",
        data: storedItemsByItemCode[0],
      };
    }
  }

  const [addedItem] = await db
    .insert(storedScannedItemTable)
    .values({
      barcodeId: existBarcode.barcode.id,
      quantity: payload.quantity,
      unitId: existUnit.id,
      scanFor: scanFor,
    })
    .returning();

  consoleLog({ inserted: addedItem });

  return {
    msg: "Item Added",
    data: addedItem,
  };
};

export const deleteScannedItem = async (id: string) => {
  const [existStored] = await db
    .select()
    .from(storedScannedItemTable)
    .where(eq(storedScannedItemTable.id, id));
  if (!existStored) return { msg: "Scanned item not found!", data: null };
  await db
    .delete(storedScannedItemTable)
    .where(eq(storedScannedItemTable.id, id))
    .returning();

  return {
    msg: "Item deleted!",
    data: null,
  };
};
