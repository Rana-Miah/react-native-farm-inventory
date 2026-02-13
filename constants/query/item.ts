import { items } from "../item";
import { getBarcodesByItemCode } from "./barcode";
import { getSupplierById } from "./supplier";

export const getItemById = (id: string) => {
    return items.find(item => item.id === id);
}



export const getItemByItemCode = (itemCode: string) => {
    const item = items.find(item => item.item_code === itemCode);
    if (!item) {
        return { message: "Item not found", data: null };
    }
    const barcodes = getBarcodesByItemCode(item.item_code)
    const supplier = getSupplierById(item.supplierId);
    if (!supplier) {
        return { message: "Supplier not found", data: null };
    }
    return {
        message: "Item found",
        data: {
            ...item,
            ...supplier,
            barcodes
        }
    }
}
