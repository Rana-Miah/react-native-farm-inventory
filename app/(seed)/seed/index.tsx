import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Link } from "expo-router"
import { View } from "react-native"

export const NavLink = () => {

    return (
        <View className="flex-row items-center gap-1">
            <Link href={'/(seed)/seed'} asChild>
                <Button size={'sm'}>
                    <Text>
                        Home
                    </Text>
                </Button>
            </Link>
            <Link href={'/(seed)/seed/seed-item'} asChild>
                <Button size={'sm'}>
                    <Text>
                        Item
                    </Text>
                </Button>
            </Link>
            <Link href={'/(seed)/seed/seed-barcode'} asChild>
                <Button size={'sm'}>
                    <Text>
                        Barcode
                    </Text>
                </Button>
            </Link>
            <Link href={'/(seed)/seed/seed-suppliers'} asChild>
                <Button size={'sm'}>
                    <Text>
                        Supplier
                    </Text>
                </Button>
            </Link>
            <Link href={'/(seed)/seed/seed-unit'} asChild>
                <Button size={'sm'}>
                    <Text>
                        Unit
                    </Text>
                </Button>
            </Link>
        </View>
    )
}

const Seed = () => {

    return <NavLink />
}

export default Seed