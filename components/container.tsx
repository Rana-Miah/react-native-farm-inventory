import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-1 flex-col px-4'>
                {children}
            </View>
        </SafeAreaView>
    )
}

export default Container