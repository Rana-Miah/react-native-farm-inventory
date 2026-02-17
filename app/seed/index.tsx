import Container from "@/components/container"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { dropAllTables } from "@/drizzle/db"
import { Link } from "expo-router"
import { ScrollView, View } from "react-native"

export const NavLink = () => {

    return (
        <ScrollView
            horizontal
        >
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
        </ScrollView>
    )
}

const Seed = () => {

    return (
        <Container>

            <View>
                <NavLink />
                <Button size={'sm'} className=" my-6" onPress={dropAllTables}>
                    <Text>
                        Reset Database
                    </Text>
                </Button>
                <Button size={'sm'} className=" " onPress={dropAllTables}>
                    <Text>
                        Delete all Data
                    </Text>
                </Button>
            </View>
        </Container>
    )
}

export default Seed