import { Box, Button, HStack, Image, Text, VStack } from "native-base"

const Home = ({ navigation }) => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Image
        style={{ width: 250, height: 250 }}
        source={require("../../../assets/images/hero.png")}
        alt=""
      />
      <HStack space={3}>
        <Text fontSize="4xl" fontWeight="bold">
          Ways
        </Text>
        <HStack>
          <Text fontSize="4xl" fontWeight="bold" color="#B82020">
            To
          </Text>
          <Text fontSize="4xl" fontWeight="bold" color="#FF5555">
            DO
          </Text>
        </HStack>
      </HStack>
      <Text width={300} textAlign="center" my={5} mb={20}>
        Write your activity and finish your activity. Fast, Simple and Easy to
        Use
      </Text>
      <VStack space={2}>
        <Button width={300} backgroundColor="#FF5555">
          <Text
            color="white"
            fontWeight={800}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Button>
        <Button width={300} backgroundColor="#0000004F">
          <Text
            color="white"
            fontWeight={800}
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </Text>
        </Button>
      </VStack>
    </Box>
  )
}

export default Home
