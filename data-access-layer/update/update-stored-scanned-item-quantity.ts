import { db } from "@/drizzle/db";
import { storedScannedItemTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const updateScannedItemQuantity = async (payload: {
  storedScannedItemId: string;
  quantity: string;
}) => {
  //Quantity must be more than 0
  if (Number(payload.quantity) < 1)
    return { msg: "Quantity must grater than 0" };

  // if stored scanned item exist then continue
  const [existStoredScannedItem] = await db
    .select()
    .from(storedScannedItemTable)
    .where(eq(storedScannedItemTable.id, payload.storedScannedItemId));

  if (!existStoredScannedItem)
    return { msg: "Scanned item not found!", data: null };

  const [updated] = await db
    .update(storedScannedItemTable)
    .set({
      quantity: Number(payload.quantity),
    })
    .where(eq(storedScannedItemTable.id, payload.storedScannedItemId))
    .returning();

  return {
    msg: `Quantity updated`,
    data: updated,
  };
};
