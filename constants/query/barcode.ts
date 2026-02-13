import { barcodes } from "../barcode";
import { getItemById } from "./item";
import { getSupplierById } from "./supplier";
import { getUnitById } from "./unit";

export const getBarcodeById = (id: string) => {
    return barcodes.find(barcode => barcode.id === id);
}

export const getBarcodesByItemCode = (itemCode: string) => {
    return barcodes.map(barcode => {
        const unit = getUnitById(barcode.unitId);

        return {
            ...barcode,
            ...unit
        }
    });
}

export const getItemByBarcode = (barcode: string) => {
    const itemByBarcode = barcodes.find(b => b.barcode === barcode);
    if (!itemByBarcode) {
        return { message: "Item not found" };
    }
    const item = getItemById(itemByBarcode.itemId);
    if (!item) {
        return { message: "Item not found", data: null };
    }

    const unit = getUnitById(itemByBarcode.unitId)
    if (!unit) {
        return { message: "Unit not found", data: null };
    }
    const supplier = getSupplierById(item.supplierId);
    if (!supplier) {
        return { message: "Supplier not found", data: null };
    }
    return {
        message: "Item found",
        data: {
            ...item,
            ...supplier,
            ...unit,
            ...itemByBarcode
        }
    }
}
