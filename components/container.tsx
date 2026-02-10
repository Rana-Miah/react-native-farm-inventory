import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaView>
            <View className='flex-col w-full h-full px-4 py-2'>
                {children}
            </View>
        </SafeAreaView>
    )
}

export default Container