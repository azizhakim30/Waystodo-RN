import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createStackNavigator } from "@react-navigation/stack"
import { useContext, useEffect, useState } from "react"
import FlashMessage from "react-native-flash-message"
import Spinner from "react-native-loading-spinner-overlay"
import { UserContext } from "./src/context/UserContext"

import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons"

import AddList from "./src/components/screen/AddList"
import Home from "./src/components/screen/Home"
import Login from "./src/components/screen/Login"
import Register from "./src/components/screen/Register"
import List from "./src/components/screen/List"
import Categories from "./src/components/screen/Categories"
import Detail from "./src/components/screen/Detail"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { setAuthorization } from "./src/config/Api"

const NativeStack = createNativeStackNavigator()
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const ButtonTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: () => {
          return null
        },
        tabBarIcon: ({ focused }) => {
          let bgColor
          if (route.name == "List") {
            bgColor = focused ? "#FF5555" : "#D9D9D9"
            return (
              <FontAwesome5 name="clipboard-list" size={25} color={bgColor} />
            )
          } else if (route.name == "AddList") {
            bgColor = focused ? "#FF5555" : "#D9D9D9"
            return (
              <MaterialCommunityIcons
                name="clipboard-plus"
                size={25}
                color={bgColor}
              />
            )
          } else if (route.name == "Categories") {
            bgColor = focused ? "#FF5555" : "#D9D9D9"
            return <MaterialIcons name="category" size={25} color={bgColor} />
          }
        },
      })}
    >
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="AddList" component={AddList} />
      <Stack.Screen name="Categories" component={Categories} />
    </Tab.Navigator>
  )
}

const Containers = () => {
  const [state, dispatch] = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  async function checkAuth() {
    try {
      let token = await AsyncStorage.getItem("token")

      if (token) setAuthorization(token)

      await API.post("/auth/verify-token", {
        validateStatus: () => true,
      })
        .then((response) => {
          if (response.status >= 400) {
            return dispatch({
              type: "AUTH_ERROR",
            })
          }

          const payload = response.data
          dispatch({
            type: "AUTH_SUCCESS",
            payload,
          })
        })
        .catch((error) => {
          dispatch({
            type: "AUTH_ERROR",
          })
        })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  async function isAsyncTokenExist() {
    await AsyncStorage.getItem("token")
    checkAuth()
  }

  useEffect(() => {
    isAsyncTokenExist()
  }, [])

  return (
    <>
      {isLoading ? (
        <Spinner
          size="large"
          visible={isLoading}
          textContent={"Waiting..."}
          overlayColor="rgba(0, 0, 0, 0.25)"
        />
      ) : state.isLogin ? (
        <Stack.Navigator>
          <Stack.Screen
            name="MyTodo"
            component={ButtonTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailList"
            component={Detail}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
      <FlashMessage position="top" />
    </>
  )
}

export default Containers
