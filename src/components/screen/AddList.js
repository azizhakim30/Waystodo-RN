import {
  Box,
  Button,
  Input,
  Select,
  Text,
  TextArea,
  Pressable,
  HStack,
} from "native-base"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { showMessage } from "react-native-flash-message"
import { useMutation, useQuery } from "react-query"
import { API } from "../../config/Api"

function AddList({ navigation }) {
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [text, setText] = useState("Choose Date")
  const [mode, setMode] = useState("date")

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(false)
    setDate(currentDate)

    const tempDate = new Date(currentDate)
    const formatDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear()
    setText(formatDate)
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const [dataTodo, setDataList] = useState({
    name: "",
    date: date,
    description: "",
    category_id: "",
    is_done: 0,
  })

  let { data: category, refetch: categoryRefetch } = useQuery(
    "categoryCaches",
    async () => {
      let categoryResponse = await API.get("/Categories")

      return categoryResponse.data
    }
  )

  function handleChangeText(name, value) {
    setDataList({
      ...dataTodo,
      [name]: value,
    })
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      if (
        (dataTodo.name.trim(),
        dataTodo.date,
        dataTodo.description,
        dataTodo.category_id == "")
      ) {
        return showMessage({
          message: "Input all data",
          type: "danger",
        })
      }

      const todoData = {
        name: dataTodo.name,
        date: date,
        description: dataTodo.description,
        category_id: dataTodo.category_id,
        is_done: 0,
      }

      await API.post("/Todo", todoData)

      listRefetch()

      showMessage({
        message: "Success to add Todo",
        type: "success",
      })
      setDataList({
        name: "",
        date: date,
        description: "",
        category_id: "",
        is_done: 0,
      })

      navigation.navigate("List")
    } catch (err) {
      showMessage({
        message: "Failed to add List!",
        type: "danger",
      })
    }
  })

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/Todo")
      return listResponse.data
    }
  )

  return (
    <Box
      display="flex"
      flex={1}
      bg="white"
      px={3}
      py={5}
      w={"100%"}
      alignItems="center"
    >
      <Box display="flex" w={"90%"} mt={5}>
        <Text fontWeight="bold" fontSize={30}>
          Add List
        </Text>
        <Box display="flex" w={"100%"} mt={5}>
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Name"
            py={3}
            my={2}
            value={dataTodo.name}
            fontSize={15}
            borderRadius={8}
            borderWidth={2}
            borderColor="muted.400"
            onChangeText={(value) => handleChangeText("name", value)}
          />
          <Select
            defaultValue={dataTodo.category_id}
            placeholder="Pilih category..."
            w={"100%"}
            h={50}
            bg="muted.200"
            py={3}
            my={2}
            fontSize={15}
            borderRadius={8}
            borderWidth={2}
            borderColor="muted.400"
            _selectedItem={{
              bg: "muted.500",
            }}
            mt={1}
            onValueChange={(value) => handleChangeText("category_id", value)}
          >
            {category?.map((item, i) => (
              <Select.Item label={item.name} value={item._id} key={i} />
            ))}
          </Select>
          <Pressable
            title="DatePicker"
            onPress={() => showMode("date")}
            p={3}
            h={52}
            bg="muted.200"
            borderRadius={8}
            borderWidth={2}
            borderColor="muted.400"
            mb={1}
            w="100%"
          >
            <HStack justifyContent="space-between">
              <Text fontSize="md">{text}</Text>
              <Text color="blueGray.400">
                <Ionicons name="calendar-outline" />
              </Text>
            </HStack>
          </Pressable>
          {show && (
            <RNDateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              display="default"
              onChange={onChangeDate}
            />
          )}
          <TextArea
            w={"100%"}
            h={100}
            bg="muted.200"
            placeholder="Description"
            py={3}
            my={2}
            value={dataTodo.description}
            fontSize={15}
            borderRadius={8}
            borderWidth={2}
            borderColor="muted.400"
            onChangeText={(value) => handleChangeText("description", value)}
          />
          <Button
            w={"100%"}
            mt={5}
            bg="error.500"
            _hover={{ backgroundColor: "error.600" }}
            py={3}
            _text={{
              fontSize: "md",
              fontWeight: "bold",
            }}
            onPress={(e) => handleSubmit.mutate(e)}
          >
            Add List
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AddList
