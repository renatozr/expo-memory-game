import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Pressable,
  Image,
  Button,
  StyleSheet,
} from "react-native";
import astronautCard from "./assets/cards/astronaut-card.png";
import robotCard from "./assets/cards/robot-card.png";
import astronaut2Card from "./assets/cards/astronaut2-card.png";
import alienCard from "./assets/cards/alien-card.png";
import cardBack from "./assets/cards/card-back.png";

export default function App() {
  const [cards, setCards] = useState([
    { id: 1, name: "Astronaut", imageSrc: astronautCard, isRevealed: false },
    { id: 2, name: "Astronaut", imageSrc: astronautCard, isRevealed: false },
    { id: 3, name: "Robot", imageSrc: robotCard, isRevealed: false },
    { id: 4, name: "Robot", imageSrc: robotCard, isRevealed: false },
    { id: 5, name: "Astronaut2", imageSrc: astronaut2Card, isRevealed: false },
    { id: 6, name: "Astronaut2", imageSrc: astronaut2Card, isRevealed: false },
    { id: 7, name: "Alien", imageSrc: alienCard, isRevealed: false },
    { id: 8, name: "Alien", imageSrc: alienCard, isRevealed: false },
  ]);
  const [lastTwoRevealedCards, setLastTwoRevealedCards] = useState([]);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(shuffleCards, []);

  useEffect(checkIsPairFormed, [lastTwoRevealedCards]);

  useEffect(checkIsGameFinished, [cards]);

  function shuffleCards() {
    setCards((prevState) => shuffleArray([...prevState]));
  }

  function shuffleArray(array) {
    for (let index = array.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    }

    return array;
  }

  function checkIsPairFormed() {
    if (lastTwoRevealedCards.length === 2) {
      const [card, card2] = lastTwoRevealedCards;

      if (card.name !== card2.name) {
        setTimeout(() => {
          hideFalsePair(card.id, card2.id);
          setLastTwoRevealedCards([]);
        }, 2000);

        return;
      }

      setLastTwoRevealedCards([]);
    }
  }

  function hideFalsePair(id, id2) {
    setCards((prevState) =>
      prevState.map((card) =>
        [id, id2].includes(card.id) ? { ...card, isRevealed: false } : card
      )
    );
  }

  function checkIsGameFinished() {
    if (cards.every((card) => card.isRevealed)) setIsGameFinished(true);
  }

  function revealCard(id) {
    setCards((prevState) =>
      prevState.map((card) => {
        if (card.id === id) {
          const revealedCard = { ...card, isRevealed: true };

          setLastTwoRevealedCards((prevState) => [...prevState, revealedCard]);

          return revealedCard;
        }

        return card;
      })
    );
  }

  function hideCards() {
    setCards((prevState) =>
      prevState.map((card) => ({ ...card, isRevealed: false }))
    );
  }

  function restartGame() {
    setIsGameFinished(false);
    hideCards();
    shuffleCards();
  }

  return (
    <SafeAreaView style={styles.container}>
      {cards.map((card, i) => {
        if (i % 2 === 0) {
          const card2 = cards[i + 1];

          return (
            <View key={i} style={styles.row}>
              <Pressable
                onPress={() => revealCard(card.id)}
                disabled={card.isRevealed || lastTwoRevealedCards.length === 2}
              >
                <Image
                  source={card.isRevealed ? card.imageSrc : cardBack}
                  style={styles.card}
                />
              </Pressable>
              <Pressable
                onPress={() => revealCard(card2.id)}
                disabled={card2.isRevealed || lastTwoRevealedCards.length === 2}
              >
                <Image
                  source={card2.isRevealed ? card2.imageSrc : cardBack}
                  style={styles.card}
                />
              </Pressable>
            </View>
          );
        }

        return null;
      })}
      {isGameFinished && (
        <View style={styles.button}>
          <Button title="Play again" onPress={restartGame} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    padding: 5,
  },
  row: {
    flexDirection: "row",
  },
  card: {
    width: 110,
    height: 110,
    margin: 5,
    borderRadius: 25,
  },
  button: {
    marginTop: 20,
  },
});
