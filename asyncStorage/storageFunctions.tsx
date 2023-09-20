import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key: string, value: string) => {
  try {
    const jsonValue = JSON.stringify(value)

    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // saving error
  }
}
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    // error reading value
  }
}
export const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    // clear error
  }

  console.log("Done.")
}