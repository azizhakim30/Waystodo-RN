import { Box, Image, Input, Text, VStack, Button, HStack } from "native-base"
import React from "react"
import { API, setAuthorization } from "../../config/Api"
import { UserContext } from "../../context/UserContext"
import { useContext, useState } from "react"
import { showMessage } from "react-native-flash-message"
import { useMutation } from "react-query"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Login = ({ navigation }) => {
  const [state, dispatch] = useContext(UserContext)
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  })

  function handleOnChange(name, value) {
    setDataLogin({
      ...dataLogin,
      [name]: value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      const response = await API.post("/auth/login", dataLogin)
      AsyncStorage.setItem("token", response.data.token)
      const payload = response.data
      showMessage({
        message: "Login Success!",
        type: "success",
      })
      dispatch({
        type: "LOGIN_SUCCESS",
        payload,
      })
      setAuthorization(response.data.token)

      navigation.navigate("MyTodo")
    } catch (err) {
      showMessage({
        message: "Email Or Passwrod Wrong",
        type: "danger",
      })
    }
  })
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Image
        style={{ height: 250, width: 250 }}
        mb={10}
        source={require("../../../assets/images/login.png")}
        alt=""
      />
      <Box>
        <Text fontSize="2xl" bold mb={5}>
          Login
        </Text>
        <VStack space={4} mb={10}>
          <Input
            width={300}
            placeholder="Email"
            type="email"
            name="email"
            onChangeText={(value) => handleOnChange("email", value)}
          />
          <Input
            width={300}
            placeholder="Password"
            type="password"
            name="password"
            onChangeText={(value) => handleOnChange("password", value)}
          />
        </VStack>
        <Button
          width={300}
          backgroundColor="#FF5555"
          onPress={(e) => handleSubmit.mutate(e)}
        >
          <Text color="white" fontWeight={800}>
            Login
          </Text>
        </Button>
      </Box>
      <HStack space={2} mt={2}>
        <Text>New Users?</Text>
        <Text color="#FF5555" onPress={() => navigation.navigate("Register")}>
          Register
        </Text>
      </HStack>
    </Box>
  )
}

export default Login
