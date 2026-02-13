import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type ScannedItem = {
    barcode: string;
    quantity: number;
    uom: string;
}

type ScannedItemsState = {
    scannedItems: ScannedItem[];
}

const initialState: ScannedItemsState = {
    scannedItems: []
}

export const scannedItemsSlice = createSlice({
    name: 'scannedItems',
    initialState,
    reducers: {
        addScannedItem: (state, action: PayloadAction<ScannedItem>) => {
            state.scannedItems.push(action.payload);
        },
        removeScannedItem: (state, action: PayloadAction<string>) => {
            state.scannedItems = state.scannedItems.filter(item => item.barcode !== action.payload);
        },
        clearScannedItems: (state) => {
            state.scannedItems = [];
        },
        updateQuantity: (state, action: PayloadAction<{ barcode: string; quantity: number }>) => {
            const { barcode, quantity } = action.payload;
            const item = state.scannedItems.find(item => item.barcode === barcode);
            if (item) {
                item.quantity = quantity;
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { addScannedItem, removeScannedItem, clearScannedItems, updateQuantity } = scannedItemsSlice.actions
const scannedItemsReducer = scannedItemsSlice.reducer
export default scannedItemsReducer