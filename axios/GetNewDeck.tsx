import axios from "axios"
import { baseUrl } from "./databaseConfig"
export const GetDeck = (deckId: string) => {
  return axios
    .get(`${baseUrl}/api/deck/${deckId != null ? deckId : "new"}/`)
    .then((response) => {
      //   console.log(response.data)
      return response
    })
    .catch((err) => {
      return err
    })
}
