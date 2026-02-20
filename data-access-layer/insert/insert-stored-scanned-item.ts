import { db } from "@/drizzle/db";
import { storedScannedItemTable } from "@/drizzle/schema";
import { ScanItemFormData } from "@/schema/scan-item-form-schema";
import { eq } from "drizzle-orm";
import { getBarcodeByBarcode, getUnitById } from "../get-item";

export const insertScannedItem = async (payload: ScanItemFormData) => {
  const existBarcode = await getBarcodeByBarcode(payload.barcode);
  if (!existBarcode) return { msg: "Item Not Found", data: null };

  // is the unitid exist or not
  const existUnit = await getUnitById(payload.unitId);
  if (!existUnit) return { msg: "Item Not Found", data: null };

  const [addedItem] = await db
    .insert(storedScannedItemTable)
    .values({
      barcodeId: existBarcode.id,
      quantity: payload.quantity,
      unitId: existUnit.id,
    })
    .returning();

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
