import { AntDesign, FontAwesome } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from "moment"
import {
  Box,
  Button,
  Center,
  FlatList,
  Image,
  Input,
  Menu,
  Modal,
  Pressable,
  Select,
  Text,
  HStack,
} from "native-base"
import { useContext, useEffect, useState } from "react"
import { showMessage } from "react-native-flash-message"
import { useQuery } from "react-query"
import ChecklistImage from "../../../assets/images/checklist.png"
import { API } from "../../config/Api"
import { UserContext } from "../../context/UserContext"
import { Ionicons } from "@expo/vector-icons"
import RNDateTimePicker from "@react-native-community/datetimepicker"

function List({ navigation }) {
  const [state, dispatch] = useContext(UserContext)
  const [showModalFilter, setShowModalFilter] = useState(false)
  const [shouldOverlapWithTrigger] = useState(false)
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
  const [dataFilter, setDataFilter] = useState({
    search: "",
    date: "",
    category: "",
    status: "",
  })

  const [tempDataFilter, setTempDataFilter] = useState({
    date: "",
    category: "",
    status: "",
  })

  const todoColor = [
    {
      index: 0,
      bgColor: "primary.200",
    },
    {
      index: 1,
      bgColor: "green.200",
    },
    {
      index: 2,
      bgColor: "danger.200",
    },
    {
      index: 3,
      bgColor: "warning.200",
    },
    {
      index: 4,
      bgColor: "purple.200",
    },
  ]

  const categoryColor = [
    {
      index: 0,
      bgColor: "#155263",
    },
    {
      index: 1,
      bgColor: "#FF6F3C",
    },
    {
      index: 2,
      bgColor: "#FF9A3C",
    },
    {
      index: 3,
      bgColor: "#FFC93C",
    },
    {
      index: 4,
      bgColor: "danger.500",
    },
  ]

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/Todo")
      return listResponse.data
    }
  )

  let { data: category } = useQuery("categoryCaches", async () => {
    let categoryResponse = await API.get("/Categories")
    return categoryResponse.data
  })

  function cutSentence(sentence, maxCharacter) {
    return sentence.length > maxCharacter
      ? sentence.substring(0, maxCharacter) + "..."
      : sentence
  }

  function handleLogout() {
    AsyncStorage.removeItem("token")
    dispatch({
      type: "LOGOUT_SUCCESS",
    })
    showMessage({
      message: "Logout success!",
      type: "success",
    })
  }

  async function handleUpdateIsDone(e, id_todo, current_status) {
    e.preventDefault()
    try {
      await API.patch(`/Todo/${id_todo}`, {
        is_done: current_status == 0 ? 1 : 0,
      })
      listRefetch()
    } catch (err) {
      showMessage({
        message: "Gagal mengubah status todo!",
        type: "danger",
      })
    }
  }

  useEffect(() => {
    listRefetch()
  }, [])

  function TodoComponent(item, i) {
    let listBgColor = todoColor?.find(
      (item) => item.index === i % todoColor.length
    )?.bgColor
    let categoryBgColor = categoryColor?.find(
      (item) => item.index === i % categoryColor.length
    )?.bgColor
    let categoryName = category?.find(
      (itemCategory) => itemCategory._id === item.category_id
    )?.name
    return (
      <Pressable
        bg={listBgColor}
        w={"100%"}
        borderRadius={10}
        display="flex"
        flexDirection="row"
        px={5}
        py={5}
        key={i}
        my={2}
        onPress={() =>
          navigation.navigate("DetailList", {
            listId: item._id,
            listBgColor,
            categoryBgColor,
            categoryName,
          })
        }
      >
        <Box flex={2}>
          <Text
            fontWeight="bold"
            fontSize={20}
            textDecorationLine={item.is_done == 0 ? "none" : "line-through"}
          >
            {cutSentence(item.name, 15)}
          </Text>
          <Text
            color="muted.500"
            flex={1}
            textDecorationLine={item.is_done == 0 ? "none" : "line-through"}
          >
            {cutSentence(item.description, 20)}
          </Text>
          <Text color="muted.500" display="flex" alignItems="center">
            <FontAwesome
              name="calendar"
              size={15}
              color="muted.500"
              style={{ marginRight: 5 }}
            />
            {moment(item.date).format(" DD MMMM YYYY")}
          </Text>
        </Box>
        <Box flex={1}>
          <Box
            p={1}
            borderRadius={10}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={categoryBgColor}
          >
            <Text color="white" fontWeight="bold">
              {categoryName}
            </Text>
          </Box>
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              bg={listBgColor}
              borderRadius={100}
              _hover={{ backgroundColor: { listBgColor } }}
              _pressed={{ backgroundColor: { listBgColor } }}
              mt={2}
              onPress={(e) => handleUpdateIsDone(e, item._id, item.is_done)}
            >
              {item.is_done ? (
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/dw5o96n4e/image/upload/v1672641175/checklist_yis30j.png",
                  }}
                  w={50}
                  h={50}
                  resizeMode="contain"
                  alt="ChecklistImage"
                />
              ) : (
                <>
                  <Button
                    bg={item.is_done ? "white" : "muted.200"}
                    borderRadius={100}
                    _hover={{ backgroundColor: "muted.300" }}
                    _pressed={{ backgroundColor: "muted.400" }}
                    w={50}
                    h={50}
                    onPress={(e) =>
                      handleUpdateIsDone(e, item._id, item.is_done)
                    }
                  ></Button>
                </>
              )}
            </Button>
          </Box>
        </Box>
      </Pressable>
    )
  }

  function handleChangeTextFilter(name, value) {
    setDataFilter({
      ...dataFilter,
      [name]: value,
    })
  }

  function handleChangeTextTempFilter(name, value) {
    setTempDataFilter({
      ...tempDataFilter,
      [name]: value,
    })
  }

  return (
    <Box display="flex" flex={1} alignItems="center" bg="white">
      <Box display="flex" flexDirection="row" w={"85%"} mt={10} mb={5}>
        {/* profile  */}
        <Box flex={1} justifyContent="center" mx={2}>
          <Text fontWeight="bold" fontSize={30}>
            Hi {state?.data?.user?.firstName}
          </Text>
          <Text fontSize={15} color="error.500">
            {list && Object.keys(list).length} Lists
          </Text>
        </Box>
        {/* end-profile */}
        <Box flex={1} justifyContent="center" alignItems="flex-end" mx={2}>
          <Menu
            w="160"
            shouldOverlapWithTrigger={shouldOverlapWithTrigger}
            placement={"bottom right"}
            trigger={(triggerProps) => {
              return (
                <Button variant="ghost" {...triggerProps}>
                  <Image
                    source={{
                      uri: "https://res.cloudinary.com/dw5o96n4e/image/upload/v1671763211/Waysbuck/htjnqwgdfdnzktbibwjs.png",
                    }}
                    w={50}
                    h={50}
                    borderRadius={100}
                    borderWidth="2px"
                    borderColor="error.500"
                    alt="DefaultProfile"
                  />
                </Button>
              )
            }}
          >
            <Menu.Item onPress={handleLogout}>Logout</Menu.Item>
          </Menu>
        </Box>
      </Box>
      {/* kolom filter */}
      <Box display="flex" w={"85%"} flexDirection="column">
        <Box display="flex" flexDirection="row" w={"100%"}>
          <Input
            w={"100%"}
            bg="muted.200"
            placeholder="Search List..."
            py={3}
            fontSize={15}
            borderRadius="sm"
            borderColor="muted.500"
            value={dataFilter.search}
            onChangeText={(value) => handleChangeTextFilter("search", value)}
          />
        </Box>
        <Box display="flex" flexDirection="column" w={"100%"}>
          <Button
            onPress={() => setShowModalFilter(true)}
            my={3}
            bg="error.500"
            _hover={{ backgroundColor: "error.600" }}
            _pressed={{ backgroundColor: "error.700" }}
          >
            <Text
              fontSize={15}
              fontWeight="bold"
              color="white"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <AntDesign name="filter" size={20} color="white" /> Filter
            </Text>
          </Button>
          <Center>
            <Modal
              isOpen={showModalFilter}
              onClose={() => {
                setTempDataFilter({
                  ...tempDataFilter,
                  category: "",
                  status: "",
                })
                setShowModalFilter(false)
              }}
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Filter</Modal.Header>
                <Modal.Body display="flex" flexDirection="column" w={"100%"}>
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
                      onValueChange={(value) =>
                        handleChangeTextTempFilter("date", value)
                      }
                      defaultValue={dataFilter.date}
                    />
                  )}
                  <Text>Category</Text>
                  <Select
                    defaultValue={dataFilter.category}
                    placeholder="Category"
                    h={50}
                    mt={2}
                    py={3}
                    flex={1}
                    bg="muted.200"
                    fontSize={15}
                    borderRadius="sm"
                    borderColor="muted.500"
                    _selectedItem={{
                      bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("category", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    {category?.map((item, i) => (
                      <Select.Item label={item.name} value={item._id} key={i} />
                    ))}
                  </Select>
                  <Text mt={2}>Status</Text>
                  <Select
                    defaultValue={dataFilter.status}
                    placeholder="Status"
                    h={50}
                    bg="muted.200"
                    py={3}
                    mt={2}
                    flex={1}
                    fontSize={15}
                    borderRadius="sm"
                    borderColor="muted.500"
                    _selectedItem={{
                      bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("status", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    <Select.Item label={"Belum"} value={"0"} />
                    <Select.Item label={"Selesai"} value={"1"} />
                  </Select>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setTempDataFilter({
                          ...tempDataFilter,
                          category: "",
                          status: "",
                        })
                        setShowModalFilter(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={() => {
                        setDataFilter({
                          ...dataFilter,
                          date: tempDataFilter.date,
                          category: tempDataFilter.category,
                          status: tempDataFilter.status,
                        })
                        setTempDataFilter({
                          ...tempDataFilter,
                          date: "",
                          category: "",
                          status: "",
                        })
                        setShowModalFilter(false)
                      }}
                    >
                      Save
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </Box>
      </Box>
      <Box w={"85%"} display="flex" flex={1}>
        {list ? (
          <FlatList
            data={
              !dataFilter.search &&
              !dataFilter.category &&
              !dataFilter.date &&
              !dataFilter.status
                ? list
                : list.filter((item) => {
                    if (dataFilter.search) {
                      return item.name
                        .toLowerCase()
                        .includes(dataFilter.search.toLowerCase())
                    }

                    if (dataFilter.date) {
                      return item.date.toString() == dataFilter.date.toString()
                    }

                    if (dataFilter.category) {
                      let categoryId = category.find(
                        (itemCategory) => itemCategory._id === item.category_id
                      )._id
                      return (
                        categoryId.toString() == dataFilter.category.toString()
                      )
                    }

                    if (dataFilter.status) {
                      return (
                        item.is_done.toString() == dataFilter.status.toString()
                      )
                    }
                  })
            }
            renderItem={({ item, index }) => TodoComponent(item, index)}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}

export default List
