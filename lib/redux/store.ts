import { configureStore } from '@reduxjs/toolkit'
import scannedItemReducer from './slice/scanned-item-slice'
import scannedItemsReducer from './slice/scanned-items-slice'

export const store = configureStore({
    reducer: {
        scannedItems: scannedItemsReducer,
        scannedItem: scannedItemReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch