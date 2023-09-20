import axios from "axios"
import { baseUrl } from "./databaseConfig"
export const GetNewShuffledDeck = () => {
  return axios
    .get(`${baseUrl}/api/deck/new/shuffle/?deck_count=1`)
    .then((response) => {
      //   console.log(response.data)
      return response
    })
    .catch((err) => {
      return err
    })
}
