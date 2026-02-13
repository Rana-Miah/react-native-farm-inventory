export const ITEM_CODE_REGEX = /^0\d{7}-\d{4}$/
export const valueIsItemCode = (code: string) => ITEM_CODE_REGEX.test(code)

export const items = [
    {
        barcode: "6284697582136486",
        item_code: "01060802-0021",
        description: "Saudi chicken breast 900 gr",
        quantity: 2,
        uom: 'pc'
    },
    {
        barcode: "6281045698741235",
        item_code: "01060803-0022",
        description: "Fresh whole chicken 1 kg",
        quantity: 5,
        uom: 'pc'
    },
    {
        barcode: "6298745632104589",
        item_code: "01060804-0023",
        description: "Industrial LED Panel Light, 600x600mm, 48W, 4000K Neutral White, IP44 Rated",
        quantity: 3,
        uom: 'pc'
    },
    {
        barcode: "6285569874120369",
        item_code: "01060805-0024",
        description: "Chicken drumsticks 800 gr",
        quantity: 4,
        uom: 'pc'
    },
    {
        barcode: "6291134578963201",
        item_code: "01060806-0025",
        description: "Chicken mince 500 gr",
        quantity: 6,
        uom: 'pc'
    },
];
