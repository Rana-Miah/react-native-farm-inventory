import { MaterialIcons } from "@expo/vector-icons";
import { PortalHost } from "@rn-primitives/portal";
import { Tabs } from "expo-router";
import 'react-native-reanimated';
import "./global.css";

export default function RootLayout() {
  return (
    <>
    
      <Tabs screenOptions={{
        tabBarLabel: "Home",
        headerShown:false
      }}>
        {rootLayoutScreens.map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name}
            
            options={screen.options}
          />
        ))}
      </Tabs>
      <PortalHost />
    </>
  )
}


type RootLayoutScreens = Parameters<typeof Tabs.Screen>[0]

const rootLayoutScreens: RootLayoutScreens[] = [
  {
    name: "index",
    options: {
      tabBarLabel: "Home",
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="home" size={size} color={color} />
      )
    },
  },
  {
    name: "items-list",
    
    options: {
      tabBarLabel: "Items List",
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="list" size={size} color={color} />
      )
    },
  },
  {
    name: "price",
    
    options: {
      tabBarLabel: "Price",
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="local-offer" size={size} color={color} />
      )
    },
  },
  {
    name: "search",
    
    options: {
      tabBarLabel: "Search",
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="search" size={size} color={color} />
      )
    },
  },
  {
    name: "files",
    
    options: {
      tabBarLabel: "Files",
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="description" size={size} color={color} />
      )
    },
  },
  {
    name: "settings",
    
    options: {
      tabBarLabel: "Settings",
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="settings" size={size} color={color} />
      )
    },
  },
]