import { NativeBaseProvider, extendTheme } from "native-base"
import {
  useFonts,
  Sen_400Regular,
  Sen_700Bold,
  Sen_800ExtraBold,
} from "@expo-google-fonts/sen"
import { UserContextProvider } from "./src/context/UserContext"
import { NavigationContainer } from "@react-navigation/native"

import { QueryClient, QueryClientProvider } from "react-query"

import Containers from "./container"

export default function App() {
  const [fontsLoaded] = useFonts({
    Sen_400Regular,
    Sen_700Bold,
    Sen_800ExtraBold,
  })

  const fontConfig = {
    Sen: {
      400: {
        normal: "Sen_400Regular",
      },
      700: {
        normal: "Sen_700Bold",
      },
      800: {
        normal: "Sen_800ExtraBold",
      },
    },
  }

  const theme = extendTheme({
    fontConfig,
    fonts: {
      heading: "Sen",
      body: "Sen",
      mono: "Sen",
    },
  })

  if (!fontsLoaded) {
    return
  } else {
    const client = new QueryClient()

    return (
      <NavigationContainer>
        <QueryClientProvider client={client}>
          <NativeBaseProvider theme={theme}>
            <UserContextProvider>
              <Containers />
            </UserContextProvider>
          </NativeBaseProvider>
        </QueryClientProvider>
      </NavigationContainer>
    )
  }
}
