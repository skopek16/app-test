import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native"

import EditScreenInfo from "../../components/EditScreenInfo"
import { Text, View, useThemeColor } from "../../components/Themed"
import { GetDeck } from "../../axios/GetNewDeck"
import { useEffect, useState } from "react"
import {
  clearAll,
  getData,
  storeData,
} from "../../asyncStorage/storageFunctions"
import { DrawCard } from "../../axios/DrawCard"
import { ReshuffleDeck } from "../../axios/ReshuffleDeck"
import { verticalScale } from "react-native-size-matters"
type deckType = {
  deck_id: string
  remaining: number
  shuffled: boolean
  success: boolean
}
export default function TabOneScreen() {
  const colorScheme = useColorScheme()
  const { width } = useWindowDimensions()
  const [guessChoice, setGuess] = useState(-1)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [deck, setDeck] = useState<deckType>({
    deck_id: "",
    remaining: 0,
    shuffled: false,
    success: true,
  })
  const [currentCard, setCurrentCard] = useState({
    code: "",
    image: "",
    images: {
      svg: "",
      png: "",
    },
    value: "",
    suit: "",
  })
  const fetchDeck = async () => {
    let savedDeckId = await getData("deckId")
    let savedGuesses = await getData("correctGuesses")

    if (savedGuesses) {
      setCorrectGuesses(parseInt(savedGuesses))
    }
    if (savedDeckId) {
      let savedCard = await getData("savedCard")

      if (savedCard) {
        setCurrentCard(savedCard)
      }
    } else {
      setCurrentCard({
        code: "",
        image: "",
        images: {
          svg: "",
          png: "",
        },
        value: "",
        suit: "",
      })
    }
    const response = await GetDeck(savedDeckId)
    if (response.status == 200) {
      setDeck(response.data)
      storeData("deckId", response.data.deck_id)
    } else {
    }
  }
  const drwaCard = async () => {
    const response = await DrawCard(deck.deck_id)
    if (response.status == 200) {
      if (response.data.cards.length != 0) {
        if (response.data.cards[0] < currentCard.value && guessChoice == -1) {
          setCorrectGuesses(correctGuesses + 1)
          storeData("correctGuesses", (correctGuesses + 1).toString())
        }
        if (response.data.cards[0] == currentCard.value && guessChoice == 0) {
          setCorrectGuesses(correctGuesses + 1)
          storeData("correctGuesses", (correctGuesses + 1).toString())
        }
        if (response.data.cards[0] > currentCard.value && guessChoice == 1) {
          setCorrectGuesses(correctGuesses + 1)
          storeData("correctGuesses", (correctGuesses + 1).toString())
        }

        setCurrentCard(response.data.cards[0])
      } else {
        alert("Deck is empty draw new a new one.")
      }
      storeData("savedCard", response.data.cards[0])
      setDeck({ ...deck, remaining: response.data.remaining })
    } else {
    }
  }
  const reshuffleDeck = async () => {
    let savedDeckId = await getData("deckId")
    if (savedDeckId) {
      const response = await ReshuffleDeck(savedDeckId)
      setDeck(response.data)
    } else {
      fetchDeck()
    }
  }
  useEffect(() => {
    fetchDeck()
  }, [])
  return (
    <View style={styles.container}>
      {deck.deck_id != "" ? (
        <>
          <Text style={styles.title}>Cards left in deck: {deck.remaining}</Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <View style={styles.deckControlContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                await clearAll()
                fetchDeck()
              }}
            >
              <Text style={styles.buttonText}>Draw new not shuffled deck</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                reshuffleDeck()
              }}
            >
              <Text style={styles.buttonText}>Reshuffle current deck</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.deckControlContainer}>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <Text style={styles.buttonText}>Draw new shuffled deck</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                clearAll()
              }}
            >
              <Text style={styles.buttonText}>clear store</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            {currentCard.code != "" ? (
              <Image
                style={{
                  flex: 1,
                  width: (width * 3) / 5,
                  resizeMode: "stretch",
                }}
                source={{ uri: currentCard.image }}
              />
            ) : (
              <Image
                style={{
                  flex: 1,
                  width: (width * 3) / 5,
                  resizeMode: "stretch",
                }}
                source={{
                  uri: "https://deckofcardsapi.com/static/img/back.png",
                }}
              />
            )}
          </View>
          <View style={styles.cardOptionsContainer}>
            <Text style={styles.guessTitle}>
              Guess if next card will be higher,lower or equal?
            </Text>
            <View style={styles.guessContainer}>
              <TouchableOpacity
                style={[
                  styles.guessButton,
                  guessChoice == -1 && styles.guessButtonChecked,
                ]}
                onPress={() => {
                  setGuess(-1)
                }}
              >
                <Text
                  style={[
                    styles.guessButtonText,
                    (guessChoice == -1 || colorScheme == "dark") &&
                      styles.guessButtonTextChecked,
                  ]}
                >
                  Lower
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.guessButton,
                  guessChoice == 0 && styles.guessButtonChecked,
                ]}
                onPress={() => {
                  setGuess(0)
                }}
              >
                <Text
                  style={[
                    styles.guessButtonText,
                    (guessChoice == 0 || colorScheme == "dark") &&
                      styles.guessButtonTextChecked,
                  ]}
                >
                  Equal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.guessButton,
                  guessChoice == 1 && styles.guessButtonChecked,
                ]}
                onPress={() => {
                  setGuess(1)
                }}
              >
                <Text
                  style={[
                    styles.guessButtonText,
                    (guessChoice == 1 || colorScheme == "dark") &&
                      styles.guessButtonTextChecked,
                  ]}
                >
                  Higher
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.guessTitle}>
              Correct guesses: {correctGuesses}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                drwaCard()
              }}
            >
              <Text style={styles.buttonText}>Draw a card</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  guessContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  guessButtonChecked: {
    backgroundColor: "green",
  },
  guessButton: {
    width: "30%",
    height: verticalScale(30),
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "green",
  },
  guessButtonText: {
    color: "black",
    fontSize: verticalScale(12),
  },
  guessButtonTextChecked: {
    color: "white",
    fontSize: 12,
  },
  button: {
    width: "40%",
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  cardContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardOptionsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },

  deckControlContainer: {
    width: "100%",
    height: verticalScale(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  guessTitle: {
    height: verticalScale(20),
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
})
