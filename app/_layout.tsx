import { FontAwesome6 } from "@expo/vector-icons";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import "react-native-reanimated";
import Toast, { BaseToast } from "react-native-toast-message";

import StoreProvider from "@/components/provider/redux-store-provider";
import { queryClient } from "@/lib/tanstack-query/client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        width: screenWidth - 32, // 👈 16px margin both sides
        alignSelf: "center",
        borderLeftColor: "green",
      }}
    />
  ),
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <SafeAreaProvider>
          <Tabs
            screenOptions={{
              tabBarLabel: "Home",
              headerShown: false,
            }}
          >
            {rootLayoutScreens.map((screen) => (
              <Tabs.Screen
                key={screen.name}
                name={screen.name}
                options={screen.options}
              />
            ))}
          </Tabs>
          <PortalHost />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

type RootLayoutScreens = Parameters<typeof Tabs.Screen>[0];

const rootLayoutScreens: RootLayoutScreens[] = [
  {
    name: "index",
    options: {
      tabBarLabel: "Home",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="house" size={18} color={color} />
      ),
    },
  },
  {
    name: "items-list",

    options: {
      tabBarLabel: "Items List",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="list" size={18} color={color} />
      ),
    },
  },
  {
    name: "price",

    options: {
      tabBarLabel: "Price",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="tags" size={18} color={color} />
      ),
    },
  },
  {
    name: "search",

    options: {
      tabBarLabel: "Search",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="magnifying-glass" size={18} color={color} />
      ),
    },
  },
  {
    name: "files",

    options: {
      tabBarLabel: "Files",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="file-lines" size={18} color={color} />
      ),
    },
  },
  {
    name: "settings",

    options: {
      tabBarLabel: "Settings",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="gear" size={18} color={color} />
      ),
    },
  },
  {
    name: "seed",

    options: {
      tabBarLabel: "Seed",
      tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="seedling" size={18} color={color} />
      ),
    },
  },
];
