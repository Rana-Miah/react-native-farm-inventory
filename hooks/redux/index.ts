import { AppDispatch, RootState } from '@/lib/redux/store'
import { useDispatch, useSelector } from 'react-redux'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()


export const useScannedItems = () => useAppSelector(state => state.scannedItems)
export const useScannedItem = () => useAppSelector(state => state.scannedItem)

