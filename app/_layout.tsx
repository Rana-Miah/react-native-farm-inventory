import { FontAwesome6 } from "@expo/vector-icons";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from '@tanstack/react-query';
import { Tabs } from "expo-router";
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import StoreProvider from "@/components/provider/redux-store-provider";
import { queryClient } from "@/lib/tanstack-query/client";
import "./global.css";


export default function RootLayout() {


  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Tabs screenOptions={{
          tabBarLabel: "Home",
          headerShown: false
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
        <Toast />
      </StoreProvider>
    </QueryClientProvider>
  )
}


type RootLayoutScreens = Parameters<typeof Tabs.Screen>[0]

const rootLayoutScreens: RootLayoutScreens[] = [
  {
    name: "index",
    options: {
      tabBarLabel: "Home",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="house" size={size} color={color} />
      )
    },
  },
  {
    name: "items-list",

    options: {
      tabBarLabel: "Items List",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="list" size={size} color={color} />
      )
    },
  },
  {
    name: "price",

    options: {
      tabBarLabel: "Price",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="tags" size={size} color={color} />
      )
    },
  },
  {
    name: "search",

    options: {
      tabBarLabel: "Search",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="magnifying-glass" size={size} color={color} />
      )
    },
  },
  {
    name: "files",

    options: {
      tabBarLabel: "Files",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="file-lines" size={size} color={color} />
      )
    },
  },
  {
    name: "settings",

    options: {
      tabBarLabel: "Settings",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="gear" size={size} color={color} />
      )
    },
  },
]