import { getItemByBarcode } from '@/constants/query/barcode';
import { getItemByItemCode } from '@/constants/query/item';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type ScannedItem = ReturnType<typeof getItemByBarcode>['data'] | ReturnType<typeof getItemByItemCode>['data']

type ScannedItemState = {
    scannedItem: ScannedItem;
}

const initialState: ScannedItemState = {
    scannedItem: null
}

export const scannedItemSlice = createSlice({
    name: 'scannedItems',
    initialState,
    reducers: {
        setItem: (state, action: PayloadAction<ScannedItem>) => {
            state.scannedItem = action.payload;
        },
        clearItem: (state) => {
            state.scannedItem = null
        }
    },
})

// Action creators are generated for each case reducer function
export const { setItem, clearItem } = scannedItemSlice.actions
const scannedItemReducer = scannedItemSlice.reducer
export default scannedItemReducer