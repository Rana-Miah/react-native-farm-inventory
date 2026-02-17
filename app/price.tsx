import Container from '@/components/container'
import { PriceCheckCard } from '@/components/price-check-card'
import { Input } from '@/components/ui/input'
import { useGetItemPriceByBarcode } from '@/hooks/tanstack-query/item-query'
import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'

const Price = () => {
  const [barcode, setBarcode] = useState("")
  const { data ,refetch} = useGetItemPriceByBarcode(barcode)
  const form = useForm({
    defaultValues: { barcode: "" }
  })

  const onSubmit = form.handleSubmit(({ barcode }) => {
    setBarcode(barcode)
  })

  return (
    <Container>
      <View className='h-16 justify-center'>

        <Controller
          control={form.control}
          name="barcode"
          render={({ field: { onChange, value } }) => (
            <View className="relative">
              <Input
                placeholder='Barcode'
                keyboardType='numeric'
                returnKeyType='go'
                value={value}
                onChangeText={onChange}
                onSubmitEditing={onSubmit}
              />

              {/* Clear Button */}
              {value.length > 0 ? (
                <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <TouchableOpacity onPress={() => {
                    form.reset()
                    refetch()
                  }}>
                    <Feather name="x-circle" size={24} />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
        />



      </View>


      {/* <View className='flex-1 pb-0'> */}
      <ScrollView className='flex-1'
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}>
        {
          (data && form.watch('barcode').length > 0) ? (
            <PriceCheckCard
              barcode={data.barcode}
              itemCode={data.item_code ?? ""}
              description={data.description ?? ""}
              regularPrice={data.price}
              promoPrice={data.promoPrice ?? undefined}
              supplierCode={data.supplierCode ?? ""}
              supplierName={data.supplierName ?? ""}
              currency='SAR'
            />
          ) : null
        }

      </ScrollView>
      {/* </View> */}
    </Container>
  )
}

export default Price
