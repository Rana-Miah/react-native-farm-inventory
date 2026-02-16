import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


export type AlertModalType = 'delete' | 'update'
export type AlerTModalState = {
    type: AlertModalType | null
    isOpen: boolean
}

const initialState: AlerTModalState = {
    isOpen: false,
    type: null
}

export const alertModalSlice = createSlice({
    name: 'alertModal',
    initialState,
    reducers: {
        onOpen: (state, action: PayloadAction<AlertModalType>) => {
            state.type = action.payload
            state.isOpen = true
        },
        onClose: (state) => {
            state.type = null
            state.isOpen = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { onClose, onOpen } = alertModalSlice.actions
const alertModalReducer = alertModalSlice.reducer
export default alertModalReducer