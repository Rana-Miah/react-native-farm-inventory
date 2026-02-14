import { db } from "../db";
import { itemTable, unitTable } from "../schema";

export const randomBetweenZeroAndN = (n: number): number => {
    if (n < 0) {
        throw new Error("n must be a non-negative number");
    }

    return Math.floor(Math.random() * (n + 1));
};


let barcodeSuffix = 6281785585231
const seedDatabase = async () => {
    console.log('Start database seeding!');


    // const suppliers = await db.select().from(supplierTable)
    const items = await db.select().from(itemTable)
    const units = await db.select().from(unitTable)


    //! item code seed
    // for (let i = 0; i < suppliers.length; i++) {
    //     const numberOfItems = Array.from({ length: 10 })

    //     numberOfItems.forEach(() => {
    //         suffix++
    //         const index = randomBetweenZeroAndN(items.length)
    //         const maxLength = suffix < 10 ? 3 : (suffix >= 10 && suffix < 100) ? 2 : 1


    //         const insertItem = async () => {
    //             await db.insert(itemTable).values({
    //                 item_code: `01060106-${"".padStart(maxLength, "0")}${suffix}`,
    //                 supplierId: suppliers[i].id,
    //                 item_description: items[index].item_description,
    //             })
    //         }
    //         console.log({ supplierId: i, itemCode: `01060106-${"".padStart(maxLength, "0")}${suffix}`, index })

    //         insertItem()
    //     })

    // }

    //! barcode seed
    // for (let i = 0; i < items.length; i++) {
    //     const numberOfItems = Array.from({ length: 3 })

    //     numberOfItems.forEach(() => {
    //         barcodeSuffix++
    //         const unitIndex = randomBetweenZeroAndN(units.length - 1)

    //         const price = randomBetweenZeroAndN(200)

    //         const insertItem = async () => {
    //             await db.insert(barcodeTable).values({
    //                 barcode: (barcodeSuffix + i).toString(),
    //                 price: price === 0 ? 1 : price,
    //                 description: items[i].item_description,
    //                 itemId: items[i].id,
    //                 unitId: units[unitIndex].id
    //             })
    //         }

    //         insertItem()
    //         // console.log({
    //         //     barcode: (barcodeSuffix + i).toString(),
    //         //     price: price === 0 ? 1 : price,
    //         //     // i,
    //         //     // unitIndex,
    //         //     // unitLength: units.length
    //         //     description: items[i].item_description,
    //         //     itemId: items[i].id,
    //         //     unitId: units[unitIndex].id
    //         // })
    //     })

    // }
}

export default async function main() {
    try {
        // await seedDatabase();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}
