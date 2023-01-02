import { FontAwesome } from "@expo/vector-icons"
import {
  Box,
  Button,
  Image,
  Text,
  Stack,
  HStack,
  VStack,
  Badge,
  FlatList,
} from "native-base"
import { showMessage } from "react-native-flash-message"
import { useQuery } from "react-query"
import ChecklistImage from "../../../assets/images/checklist.png"
import { API } from "../../config/Api"
import moment from "moment"

function Detail({ route, navigation }) {
  let { listId, listBgColor, categoryBgColor, categoryName } = route.params

  let { data: list, refetch: listRefetchs } = useQuery(
    "listDetailCaches",
    async () => {
      let listResponse = await API.get(`/Todo/${listId}`)
      return listResponse.data
    }
  )

  let { data: listResponse, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/Todo")
      return listResponse.data
    }
  )

  async function handleUpdateIsDone(e, id_todo, current_status) {
    e.preventDefault()
    try {
      await API.patch(`/Todo/${id_todo}`, {
        is_done: current_status == 0 ? 1 : 0,
      })
      listRefetch()
      listRefetchs()
    } catch (err) {
      showMessage({
        message: "Failed to change status todo!",
        type: "danger",
      })
    }
  }

  return (
    <Box maxH={"82%"}>
      <Stack m={"3"} w={"93%"} rounded="sm" bg={listBgColor} pb={5}>
        <HStack justifyContent={"space-between"} p="3" pb={0}>
          <Box justifyContent={"center"} w={"50%"}>
            <Text
              fontSize={"3xl"}
              fontWeight="bold"
              textDecorationLine={list?.is_done == 0 ? "none" : "line-through"}
            >
              {list?.name}
            </Text>

            <Text
              textDecorationLine={list?.is_done == 0 ? "none" : "line-through"}
            >
              {moment(list?.date).format("dddd, DD MMMM YYYY")}
            </Text>
          </Box>
          <VStack w="32" mt={"3"} space="2">
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
            <Button
              bg={listBgColor}
              borderRadius={100}
              _hover={{ backgroundColor: { listBgColor } }}
              _pressed={{ backgroundColor: { listBgColor } }}
              mt={2}
              onPress={(e) => handleUpdateIsDone(e, list?._id, list?.is_done)}
            >
              {list?.is_done ? (
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
                    bg={list?.is_done ? "white" : "muted.200"}
                    borderRadius={100}
                    _hover={{ backgroundColor: "muted.300" }}
                    _pressed={{ backgroundColor: "muted.400" }}
                    w={50}
                    h={50}
                    onPress={(e) =>
                      handleUpdateIsDone(e, list?._id, list?.is_done)
                    }
                  ></Button>
                </>
              )}
            </Button>
          </VStack>
        </HStack>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text
              fontSize={"xs"}
              m="3"
              color={"gray.600"}
              textDecorationLine={list?.is_done == 0 ? "none" : "line-through"}
            >
              {list?.description}
            </Text>
          }
          renderItem={() => {
            list?.description
          }}
        />
      </Stack>
    </Box>
  )
}

export default Detail
