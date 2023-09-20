import axios from "axios"
import { baseUrl } from "./databaseConfig"
export const DrawCard = (deckId: string) => {
  return axios
    .get(`${baseUrl}/api/deck/${deckId}/draw/?count=1`)
    .then((response) => {
      //   console.log(response.data)
      return response
    })
    .catch((err) => {
      return err
    })
}
