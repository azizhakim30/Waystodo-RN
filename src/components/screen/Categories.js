import { Box, Button, Input, Text } from "native-base"
import { useState } from "react"
import { showMessage } from "react-native-flash-message"
import { useMutation, useQuery } from "react-query"
import { API } from "../../config/Api"

function Category({ navigation }) {
  const [dataCategory, setDataCategory] = useState({
    name: "",
  })

  let { data: category, refetch: categoryRefetch } = useQuery(
    "categoryCaches",
    async () => {
      let categoryResponse = await API.get("/Categories")
      return categoryResponse.data
    }
  )

  function handleChangeText(name, value) {
    setDataCategory({
      ...dataCategory,
      [name]: value,
    })
  }

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

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault()
    try {
      if (dataCategory.name.trim() == "") {
        return showMessage({
          message: "Category name must be filled!",
          type: "danger",
        })
      }
      const response = await API.post("/Categories", dataCategory)
      showMessage({
        message: "Category success added!",
        type: "success",
      })
      setDataCategory({
        name: "",
      })
      categoryRefetch()
    } catch (err) {
      showMessage({
        message: "failed add category!",
        type: "danger",
      })
    }
  })

  return (
    <Box display="flex" flex={1} px={3} py={5} w={"100%"} alignItems="center">
      <Box display="flex" w={"90%"} mt={5}>
        <Text fontSize="2xl" fontWeight={800}>
          Add Category
        </Text>
        <Box display="flex" w={"100%"} mt={5}>
          <Input
            placeholder="Name"
            p={3}
            h={52}
            bg="muted.200"
            borderRadius={8}
            borderWidth={2}
            borderColor="muted.400"
            mb={5}
            w="100%"
            fontSize="md"
            name="name"
            type="text"
            value={dataCategory.name}
            onChangeText={(value) => handleChangeText("name", value)}
          />
          <Button
            backgroundColor="#FF5555"
            py={3}
            _text={{
              fontWeight: "bold",
            }}
            onPress={(e) => handleSubmit.mutate(e)}
          >
            Add Category
          </Button>
        </Box>
        <Text fontSize="2xl" fontWeight={800} mt={10}>
          List Category
        </Text>

        <Box
          mt={5}
          display="flex"
          flexDirection="row"
          flex={1}
          w={"100%"}
          flexWrap={"wrap"}
        >
          {category?.map((item, i) => {
            return (
              <Box
                borderRadius={10}
                display="flex"
                alignItems="center"
                justifyContent="center"
                key={i}
                mr={2}
                my={2}
                h="8"
                px="3"
                bg={
                  categoryColor?.find(
                    (item) => item?.index === i % categoryColor.length
                  ).bgColor
                }
              >
                <Text color="white" fontSize={16}>
                  {item.name}
                </Text>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default Category
