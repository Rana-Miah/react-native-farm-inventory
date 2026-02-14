import { items } from "../item";
import { getBarcodesByItemCode } from "./barcode";
import { getSupplierById } from "./supplier";

export type Item = {
    itemCode: string;
    barcode?: string;
    description: string;
    units: {
        uom?: string;
        packing?: number
    }[],
    supplierName: string;
    supplierCode: string,
    price?: number
}


export const getItemById = (id: string) => {
    return items.find(item => item.id === id);
}



export const getItemByItemCode = (itemCode: string): { data: null | Item; message: string } => {
    const item = items.find(item => item.item_code === itemCode);
    if (!item) {
        return { message: "Item not found", data: null };
    }
    const barcodes = getBarcodesByItemCode(item.item_code)
    const supplier = getSupplierById(item.supplierId);
    if (!supplier) {
        return { message: "Supplier not found", data: null };
    }
    const units = barcodes.map(barcode => {

        return {
            uom: barcode.unitName,
            packing: barcode.packing,
        }
    })
    const barcode = barcodes.find(barcode => barcode.packing === 1)
    return {
        message: "Item found",
        data: {
                barcode:barcode?.barcode,
                itemCode:item.item_code,
                description:item.item_description,
                units,
                supplierCode:supplier.supplierCode,
                supplierName:supplier.supplierName,
                price:barcode?.price

        }
    }
}
