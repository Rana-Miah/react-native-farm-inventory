import { barcodes } from "../barcode";
import { getItemById, Item } from "./item";
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

export const getItemByBarcode = (barcode: string):{ data: null | Item; message: string } => {
    const itemByBarcode = barcodes.find(b => b.barcode === barcode);
    if (!itemByBarcode) {
        return { message: "Item not found",data:null };
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

    const barcodesByItemCode = getBarcodesByItemCode(item.item_code).filter(b=>b.unitId!=unit.id)


    const units = barcodesByItemCode.map(barcode => {

        return {
            uom: barcode.unitName,
            packing: barcode.packing,
        }
    })

    const modifiedUnits = [{uom:unit.unitName,packing:unit.packing},...units]

    return {
        message: "Item found",
        data: {
            itemCode:item.item_code,
            description:item.item_description,
            supplierCode:supplier.supplierCode,
            supplierName:supplier.supplierName,
            units:modifiedUnits,
            barcode:itemByBarcode.barcode,
            price:itemByBarcode.price
        }
    }
}
