import { units } from "../unit";

export const getUnitById = (id: string) => {
    return units.find(unit => unit.id === id);
}
