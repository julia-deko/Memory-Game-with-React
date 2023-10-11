import { useEffect, useMemo, useState } from 'react';
import './App.css'
import SingleCard from './components/SingleCard';


const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false},
  { "src": "/img/ring-1.png", matched: false},
  { "src": "/img/scroll-1.png", matched: false},
  { "src": "/img/shield-1.png", matched: false},
  { "src": "/img/sword-1.png", matched: false},
  { "src": "/img/emoji-icon.png", matched: false },
  { "src": "/img/sadd.jpeg", matched: false }
];

function App() {
  const [ cards, setCards ] = useState([]);
  const [ turns, setTurns ] = useState(0); 
  const [ choiceOne, setChoiceOne ] = useState(null);
  const [ choiceTwo, setChoiceTwo ] = useState(null);
  const [ disabled, setDisabled ] = useState(false);
  const [ cardsNumber, setCardsNumber ] = useState(8);
 

  const shuffleCards = () => {
    const cardsArr = cardImages.slice(0, cardsNumber / 2);
    const shuffeledCards = [...cardsArr, ...cardsArr]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
      setChoiceOne(null);
      setChoiceTwo(null);
      setCards(shuffeledCards);
      setTurns(0);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  
  useEffect(() => {
    if(choiceOne && choiceTwo) {
      setDisabled(true);
      if(choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
         return prevCards.map(card => {
          if(card.src === choiceOne.src) {
            return { ...card , matched: true }
          } else {
            return card;
          }
         });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const ended = useMemo(() => cards.every(card => card.matched), [cards]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns+1);
    setDisabled(false);
  }

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleChange = (e) => {
    setCardsNumber(e.target.value);
  };

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className='cards-amount'>
        <label for="cardsAmount">Cards Amount: </label>
        <select name="cardsAmount" onChange={handleChange}>
          <option value="8">8</option>
          <option value="12">12</option>
          <option value="16">16</option>
        </select>
      </div>
      <div className={ended ? "" : "hidden"}> 
        <div className='win'>
          <h2>You win! You made {turns} turns!</h2>
          <button onClick={shuffleCards}>Play Again</button>
        </div>
      </div>
      <div className='card-grid'>
        { cards.map(card => (
            <SingleCard  
              key={card.id} 
              card={card} 
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
        )) }
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;