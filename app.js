document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  const timerDisplay = document.querySelector('#timer');
  const bestTimeDisplay = document.querySelector('#best-time');
  const difficultySelector = document.querySelector('#difficulty');
  const startGameButton = document.querySelector('#start-game');

  let timer = null;
  let elapsedTime = 0;
  let bestTime = localStorage.getItem('bestTime') || Infinity; // Get best time from local storage
  bestTimeDisplay.textContent = bestTime === Infinity ? '--' : `${bestTime} seconds`; // Display best time (or '--' if not available)

  const cardSets = {
    easy: 8,
    medium: 12,
    hard: 16,
  };

  let cardArray = [];
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];

  function initializeGame() {
    const numCards = cardSets[difficultySelector.value];
    cardArray = generateCardArray(numCards);
    createBoard();
    resetGame();
  }

  function generateCardArray(numCards) {
    const baseCards = [
      { name: 'fries', img: 'images/fries.png' },
      { name: 'cheeseburger', img: 'images/cheeseburger.png' },
      { name: 'ice-cream', img: 'images/ice-cream.png' },
      { name: 'pizza', img: 'images/pizza.png' },
      { name: 'milkshake', img: 'images/milkshake.png' },
      { name: 'hotdog', img: 'images/hotdog.png' },
    ];

    const selectedCards = baseCards.slice(0, numCards / 2);
    return [...selectedCards, ...selectedCards].sort(() => 0.5 - Math.random());
  }

  function createBoard() {
    grid.innerHTML = '';
    cardArray.forEach((card, index) => {
      const cardElement = document.createElement('img');
      cardElement.setAttribute('src', 'images/blank.png');
      cardElement.setAttribute('data-id', index);
      cardElement.addEventListener('click', flipCard);
      grid.appendChild(cardElement);
    });

    grid.style.gridTemplateColumns = `repeat(${Math.sqrt(cardArray.length)}, 120px)`;
  }

  function resetGame() {
    clearInterval(timer);
    elapsedTime = 0;
    timerDisplay.textContent = elapsedTime;
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];
    resultDisplay.textContent = 0;
    timer = setInterval(() => {
      elapsedTime++;
      timerDisplay.textContent = elapsedTime;
    }, 1000);
  }

  function checkForMatch() {
    const cards = document.querySelectorAll('img');
    const [optionOneId, optionTwoId] = cardsChosenId;

    if (cardsChosen[0] === cardsChosen[1]) {
      cards[optionOneId].setAttribute('src', 'images/white.png');
      cards[optionTwoId].setAttribute('src', 'images/white.png');
      cardsWon.push(cardsChosen);
    } else {
      cards[optionOneId].setAttribute('src', 'images/blank.png');
      cards[optionTwoId].setAttribute('src', 'images/blank.png');
    }

    cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;

    if (cardsWon.length === cardArray.length / 2) {
      clearInterval(timer);

      // Check if the current game time is better than the best time
      if (elapsedTime < bestTime || bestTime === Infinity) {
        bestTime = elapsedTime;
        localStorage.setItem('bestTime', bestTime); // Save the best time to localStorage
        bestTimeDisplay.textContent = `${bestTime} seconds`; // Update the best time on the page
      }

      alert(`Congratulations! You found all matches in ${elapsedTime} seconds.`);
    }
  }

  function flipCard() {
    const cardId = this.getAttribute('data-id');
    if (!cardsChosenId.includes(cardId)) {
      cardsChosen.push(cardArray[cardId].name);
      cardsChosenId.push(cardId);
      this.setAttribute('src', cardArray[cardId].img);
      if (cardsChosen.length === 2) {
        setTimeout(checkForMatch, 500);
      }
    }
  }

  startGameButton.addEventListener('click', initializeGame);
  initializeGame();
});
