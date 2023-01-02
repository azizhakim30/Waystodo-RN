import { Box, Image, Input, Text, VStack, Button, HStack } from "native-base"
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API } from "../../config/Api"

const Register = ({ navigation }) => {
  const [form, setForm] = React.useState({
    email: "",
    firstName: "",
    password: "",
  })

  const handleOnChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleRegister = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      const response = await API.post("/auth/register", form, config)

      alert("Registration Succeeded")
      navigation.navigate("Login")
    } catch {
      alert("Registration Failed")
    }
  }
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
          Register
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
            placeholder="Name"
            type="text"
            name="firstName"
            onChangeText={(value) => handleOnChange("firstName", value)}
          />
          <Input
            width={300}
            placeholder="Password"
            type="password"
            name="password"
            onChangeText={(value) => handleOnChange("password", value)}
          />
        </VStack>
        <Button width={300} backgroundColor="#FF5555" onPress={handleRegister}>
          <Text color="white" fontWeight={800}>
            Register
          </Text>
        </Button>
      </Box>
      <HStack space={2} mt={2}>
        <Text>Joined us before?</Text>
        <Text color="#FF5555" onPress={() => navigation.navigate("Login")}>
          Login
        </Text>
      </HStack>
    </Box>
  )
}

export default Register
