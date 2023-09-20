import axios from "axios"
import { baseUrl } from "./databaseConfig"
export const ReshuffleDeck = (deckId: string) => {
  return axios
    .get(`${baseUrl}/api/deck/${deckId}/shuffle/?remaining=true`)
    .then((response) => {
      //   console.log(response.data)
      return response
    })
    .catch((err) => {
      return err
    })
}
