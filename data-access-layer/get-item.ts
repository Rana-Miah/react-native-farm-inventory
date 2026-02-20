import { multitaskVariantValues } from "@/constants";
import { db } from "@/drizzle/db";
import {
  barcodeTable,
  itemTable,
  storedScannedItemTable,
  supplierTable,
  unitTable,
} from "@/drizzle/schema";
import { consoleLog } from "@/lib/log";
import { and, desc, eq, like, or } from "drizzle-orm";

export const getItemByScanBarcode = async ({
  scanFor,
  isAdvanceModeEnable,
  barcode: scannedBarcode,
}: {
  barcode: string;
  scanFor: (typeof multitaskVariantValues)[number] | undefined;
  isAdvanceModeEnable: boolean;
}) => {
  consoleLog({ scanFor, isAdvanceModeEnable, scannedBarcode });

  const [itemResponse] = await db
    .select()
    .from(barcodeTable)
    .innerJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
    .innerJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))
    .where(eq(barcodeTable.barcode, scannedBarcode));

  if (!itemResponse || !itemResponse.barcode || !itemResponse.unit)
    return {
      msg: "Item not found!",
      data: null,
    };

  const { barcode, item, unit } = itemResponse;

  const barcodeUnits = await db
    .select()
    .from(barcodeTable)
    .rightJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
    .where(eq(barcodeTable.itemId, item.id));

  const units = barcodeUnits.map(({ unit }) => {
    const { createdAt, updatedAt, ...rest } = unit;
    return {
      ...rest,
    };
  });

  //! GET ALREADY SCANNED ITEM

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
        eq(itemTable.item_code, item.item_code),
        eq(storedScannedItemTable.scanFor, "Order"),
      ),
    );

  const hasStoredItems = storedItemsByItemCode.length > 0;

  const isAlreadyScanned = storedItemsByItemCode.some(
    ({ stored_scanned_item }) => stored_scanned_item?.scanFor === "Order",
  );

  const data = {
    ...item,
    ...barcode,
    ...unit,
    units,
  };

  if (isScanForOrder && hasStoredItems && isAlreadyScanned) {
    const [existStored] = storedItemsByItemCode;
    return {
      ...data,
      storedId: existStored?.stored_scanned_item?.id,
    };
  }

  return {
    msg: "item found",
    data,
  };
};

export const getBarcodeByBarcode = async (barcode: string) => {
  const [item] = await db
    .select()
    .from(barcodeTable)
    .where(eq(barcodeTable.barcode, barcode));
  return item;
};

export const getUnitById = async (id: string) => {
  const [unit] = await db.select().from(unitTable).where(eq(unitTable.id, id));
  return unit;
};

export const getStoredScannedItems = async (query?: string) => {
  const storeScannedItemsQuery = db
    .select()
    .from(storedScannedItemTable)
    .leftJoin(unitTable, eq(unitTable.id, storedScannedItemTable.unitId))
    .leftJoin(
      barcodeTable,
      eq(barcodeTable.id, storedScannedItemTable.barcodeId),
    )
    .leftJoin(itemTable, eq(itemTable.id, barcodeTable.itemId));

  if (query) {
    const words = query.trim().toLowerCase().split(/\s+/);

    storeScannedItemsQuery.where(
      or(
        like(barcodeTable.barcode, `%${query}%`),
        like(itemTable.item_code, `%${query}%`),
        ...words.map((word) => like(itemTable.item_description, `%${word}%`)),
      ),
    );
  }

  const storedScannedItems = await storeScannedItemsQuery.orderBy(
    desc(storedScannedItemTable.createdAt),
  );

  consoleLog(storedScannedItems[0]);

  return storedScannedItems.map(
    ({ barcode, stored_scanned_item, item, unit }) => {
      return {
        storedId: stored_scanned_item.id,
        quantity: stored_scanned_item.quantity,
        barcode: barcode?.barcode,
        item_code: item?.item_code,
        description: item?.item_description,
        unitName: unit?.unitName,
        unitPacking: unit?.packing,
        scanFor: stored_scanned_item.scanFor,
      };
    },
  );
};

export const getItemByBarcode = async (barcode: string) => {
  const storedScannedItems = await db
    .select()
    .from(barcodeTable)
    .leftJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
    .leftJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))
    .leftJoin(supplierTable, eq(supplierTable.id, itemTable.supplierId))
    .where(eq(barcodeTable.barcode, barcode));

  const [item] = storedScannedItems.map(({ barcode, supplier, item, unit }) => {
    return {
      barcode: barcode?.barcode,
      item_code: item?.item_code,
      description: item?.item_description,
      unitName: unit?.unitName,
      unitPacking: unit?.packing,
      price: barcode.price,
      promoPrice: barcode.promoPrice,
      supplierName: supplier?.supplierName,
      supplierCode: supplier?.supplierCode,
    };
  });

  return item;
};

export type StoredItem = NonNullable<
  Awaited<ReturnType<typeof getStoredScannedItems>>
>[number];

/**
 *TODO: Remove this fn and organize you code
 * @param param0
 * @returns
 */

type StoredScanned = {
  item: {
    id: string;
    supplierId: string;
    item_code: string;
    item_description: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  barcode: {
    id: string;
    barcode: string;
    price: number;
    promoPrice: number | null;
    description: string | null;
    itemId: string;
    unitId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  stored_scanned_item: {
    id: string;
    barcodeId: string;
    unitId: string;
    quantity: number;
    scanFor: "Inventory" | "Tags" | "Order" | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

type Data = {
  units: {
    id: string;
    unitName: string;
    packing: number;
  }[];
  id: string;
  unitName: string;
  packing: number;
  createdAt: Date;
  updatedAt: Date;
  barcode: string;
  price: number;
  promoPrice: number | null;
  description: string | null;
  itemId: string;
  unitId: string;
  supplierId: string;
  item_code: string;
  item_description: string;
};

type WithStored = Data & {
  storedItem: StoredScanned;
};

type ResponseData = Data | WithStored;

export const getItemDetailsByBarcodeWithAdvanceFeature = async ({
  scanFor,
  isAdvanceModeEnable,
  barcode: scannedBarcode,
}: {
  barcode: string;
  scanFor: (typeof multitaskVariantValues)[number] | undefined;
  isAdvanceModeEnable: boolean;
}): Promise<{ msg: string; data: ResponseData | null }> => {
  consoleLog({ scanFor, isAdvanceModeEnable, scannedBarcode });

  const [itemResponse] = await db
    .select()
    .from(barcodeTable)
    .innerJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
    .innerJoin(itemTable, eq(itemTable.id, barcodeTable.itemId))
    .where(eq(barcodeTable.barcode, scannedBarcode));

  if (!itemResponse || !itemResponse.barcode || !itemResponse.unit)
    return {
      msg: "Item not found!",
      data: null,
    };

  const { barcode, item, unit } = itemResponse;

  const barcodeUnits = await db
    .select()
    .from(barcodeTable)
    .rightJoin(unitTable, eq(unitTable.id, barcodeTable.unitId))
    .where(eq(barcodeTable.itemId, item.id));

  const units = barcodeUnits.map(({ unit }) => {
    const { createdAt, updatedAt, ...rest } = unit;
    return {
      ...rest,
    };
  });

  //! GET ALREADY SCANNED ITEM

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
        eq(itemTable.item_code, item.item_code),
        eq(storedScannedItemTable.scanFor, "Order"),
      ),
    );

  const hasStoredItems = storedItemsByItemCode.length > 0;

  const data = {
    ...item,
    ...barcode,
    ...unit,
    units,
  };

  if (isScanForOrder && hasStoredItems) {
    const [existStored] = storedItemsByItemCode;

    consoleLog({
      ...data,
      storedItem: existStored,
    });

    return {
      msg: "Duplicate item scanned for order!",
      data: {
        ...data,
        storedItem: existStored,
      },
    };
  }

  consoleLog(data);

  return {
    msg: "item found",
    data,
  };
};
