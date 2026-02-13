import { suppliers } from "../supplier";

export const getSupplierById = (id: string) => {
    return suppliers.find(supplier => supplier.id === id);
}