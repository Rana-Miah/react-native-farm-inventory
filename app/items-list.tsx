import AlertModal from '@/components/alert-modal'
import Container from '@/components/container'
import ScannedItemCard from '@/components/scanned-item-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAlertModal, useAppDispatch } from '@/hooks/redux'
import { useGetStoredScannedItems } from '@/hooks/tanstack-query/item-query'
import { useDeleteScannedItem, useUpdateScannedItemQuantity } from '@/hooks/tanstack-query/scanned-item-mutation'
import { onClose, onOpen } from '@/lib/redux/slice/alert-modal-slice'
import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import Toast from 'react-native-toast-message'

type ActionState =
  { type: 'update', id: string, quantity: string }
  | { type: 'delete', id: string }
  | null

const ItemsList = () => {
  const [searchInputValue, setSearchInputValue] = useState("")
  const { data, refetch, qs, queryKey } = useGetStoredScannedItems(searchInputValue)
  const [actionState, setActionState] = useState<ActionState>(null)
  const { mutate: deleteMutate } = useDeleteScannedItem()
  const { mutate: updateMutate } = useUpdateScannedItemQuantity()
  const { isOpen, type } = useAlertModal()
  const isUpdateAlertModalOpen = type === 'update' && isOpen
  const isDeleteAlertModalOpen = type === 'delete' && isOpen
  const dispatch = useAppDispatch()

  const onUpdate = () => {
    if (actionState && actionState.type === 'update') {
      dispatch(onClose())

      updateMutate(
        { quantity: actionState.quantity, storedScannedItemId: actionState.id },
        {
          onSuccess(data) {
            if (!data.data) {
              Toast.show({
                type: 'error',
                text1: data.msg,
                text1Style: {
                  fontSize: 16
                },
              })
              return
            }
            refetch()
            Toast.show({
              type: 'success',
              text1: data.msg,
              text1Style: {
                fontSize: 16
              },
              text2: data.data.quantity.toString(),
              text2Style: {
                fontSize: 14
              }
            })
          },
        }
      )
    }
  }
  const onDelete = () => {
    if (actionState && actionState.type === 'delete') {
      deleteMutate(
        actionState.id,
        {
          async onSuccess(data) {
            dispatch(onClose())
            refetch()
            await qs.invalidateQueries({ queryKey })
            Toast.show({
              type: 'success',
              text1: data.msg,
              text1Style: {
                fontSize: 16
              },
            })
          },
        }
      )
    }
  }





  return (
    <Container>


      <AlertModal
        isOpen={isUpdateAlertModalOpen}
        onCancel={() => dispatch(onClose())}
        onConfirm={onUpdate}
        title='Are you sure?'
        description='Scanned item quantity will update!'

      />
      <AlertModal
        isOpen={isDeleteAlertModalOpen}
        onCancel={() => dispatch(onClose())}
        onConfirm={onDelete}
        title='Are you sure?'
        description='Scanned item will be delete!'

      />


      <View className='flex-1 flex-col items-between justify-center gap-1'>

        {/* Inventory Save Form */}
        <View className='h-24 gap-2'>
          <Input
            className='flex-1'
            placeholder='Item Title'
          />
          <Input
            className='flex-1'
            placeholder='Search'
            onChangeText={(value) => {
              setSearchInputValue(value)
            }}
            value={searchInputValue}
          />
        </View>



        {/* scanned items */}
        <FlatList
          className="pb-0 flex-1"
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item, index }) => (
            <ScannedItemCard
              key={item.barcode}
              item={item}
              enableActionBtn
              isCollapseAble
              defaultCollapse={index !== 0}
              onDelete={(id) => {
                dispatch(onOpen('delete'))
                setActionState({ type: 'delete', id })
              }}
              onUpdate={({ id, quantity }) => {
                dispatch(onOpen('update'))
                setActionState({ type: 'update', id, quantity })
              }}
            />
          )}
        />


        {/* Buttons */}
        <View className='flex-row items-center gap-1 justify-between py-2'>
          <Button variant='outline' size={'sm'} className='flex-1'>
            <Text>Inventory</Text>
          </Button>
          <Button variant='outline' size={'sm'} className='flex-1'>
            <Text>Tags</Text>
          </Button>
          <Button variant='outline' size={'sm'} className='flex-1'>
            <Text>Order</Text>
          </Button>
          <Button variant='outline' size={'sm'} className='flex-1'>
            <Text>Print</Text>
          </Button>
        </View>
      </View>
    </Container>
  )
}

export default ItemsList