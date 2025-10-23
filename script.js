let decks = JSON.parse(localStorage.getItem("studycards_decks")) || [];
let currentStudyDeck = null;
let currentCardIndex = 0;
let currentEditingDeck = null;
let currentEditingCard = null;
let tempCards = []; // For deck creation
let deleteTarget = null; // For deletion confirmation
let shuffledCards = []; // For randomized study order

/**
 * Saves the current state of decks to localStorage and re-renders the deck list.
 */
function save() {
  localStorage.setItem("studycards_decks", JSON.stringify(decks));
  renderDecks();
}

/**
 * Shows the Create/Edit Deck modal, initializing form for creation.
 */
function showCreateDeckModal() {
  document.getElementById('deckModalTitle').textContent = 'Create New Deck';
  document.getElementById('deckName').value = '';
  currentEditingDeck = null;
  tempCards = [];
  renderTempCards();
  document.getElementById('deckModal').classList.add('active');
  document.getElementById('deckName').focus();
}

/**
 * Closes the Create/Edit Deck modal and resets temporary data.
 */
function closeDeckModal() {
  document.getElementById('deckModal').classList.remove('active');
  tempCards = [];
  currentEditingDeck = null;
}

/**
 * Shows the Add/Edit Card modal.
 * @param {boolean} isEdit - True if editing an existing card, false for new card.
 * @param {number|null} cardIndex - Index of the card in tempCards if editing.
 */
function showCardModal(isEdit = false, cardIndex = null) {
  if (isEdit && cardIndex !== null) {
    const card = tempCards[cardIndex];
    document.getElementById('cardModalTitle').textContent = 'Edit Card';
    document.getElementById('cardFront').value = card.front;
    document.getElementById('cardBack').value = card.back;
    currentEditingCard = cardIndex;
  } else {
    document.getElementById('cardModalTitle').textContent = 'Add New Card';
    document.getElementById('cardFront').value = '';
    document.getElementById('cardBack').value = '';
    currentEditingCard = null;
  }
  document.getElementById('cardModal').classList.add('active');
  document.getElementById('cardFront').focus();
}

/**
 * Closes the Add/Edit Card modal.
 */
function closeCardModal() {
  document.getElementById('cardModal').classList.remove('active');
}

/**
 * Handler for the 'Add Card' button inside the Deck Modal.
 */
function addCardToDeck() {
  showCardModal();
}

/**
 * Renders the list of cards currently being created or edited in the Deck Modal.
 */
function renderTempCards() {
  const cardsList = document.getElementById('cardsList');
  if (tempCards.length === 0) {
    cardsList.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 20px;">No cards added yet</p>';
    return;
  }

  cardsList.innerHTML = tempCards.map((card, index) => `
    <div class="card-item">
      <div class="card-content">
        <div class="card-front">${card.front}</div>
        <div class="card-back">→ ${card.back}</div>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-small" onclick="showCardModal(true, ${index})">Edit</button>
        <button type="button" class="btn btn-small btn-hard" onclick="removeTempCard(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

/**
 * Removes a card from the temporary card list.
 * @param {number} index - Index of the card to remove.
 */
function removeTempCard(index) {
  tempCards.splice(index, 1);
  renderTempCards();
}

/**
 * Shows the Delete Confirmation modal.
 * @param {string} type - Type of item to delete ('deck').
 * @param {number} index - Index of the item in the respective array.
 * @param {string} name - Name of the item to display in the message.
 */
function showDeleteModal(type, index, name) {
  deleteTarget = { type, index, name };
  document.getElementById('deleteMessage').textContent = `Delete "${name}"?`;
  document.getElementById('deleteModal').classList.add('active');
}

/**
 * Closes the Delete Confirmation modal.
 */
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('active');
  deleteTarget = null;
}

/**
 * Executes the deletion based on the deleteTarget.
 */
function confirmDelete() {
  if (deleteTarget) {
    if (deleteTarget.type === 'deck') {
      decks.splice(deleteTarget.index, 1);
      save();
    }
    closeDeleteModal();
  }
}

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Deck Form handler
document.getElementById('deckForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('deckName').value.trim();
  
  if (!name) {
    alert('Please enter a deck name!');
    return;
  }
  
  if (tempCards.length === 0) {
    alert('Please add at least one card to your deck!');
    return;
  }

  if (currentEditingDeck !== null) {
    // Editing deck
    decks[currentEditingDeck].name = name;
    decks[currentEditingDeck].cards = [...tempCards];
    decks[currentEditingDeck].updatedAt = new Date().toISOString();
  } else {
    // new deck
    const newDeck = {
      id: Date.now(),
      name: name,
      cards: [...tempCards],
      createdAt: new Date().toISOString(),
      studyCount: 0
    };
    decks.push(newDeck);
  }
  
  save();
  closeDeckModal();
});

// Card Form handler
document.getElementById('cardForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const front = document.getElementById('cardFront').value.trim();
  const back = document.getElementById('cardBack').value.trim();
  
  if (front && back) {
    const card = {
      id: Date.now(),
      front: front,
      back: back,
      createdAt: new Date().toISOString()
    };

    if (currentEditingCard !== null) {
      tempCards[currentEditingCard] = card;
    } else {
      tempCards.push(card);
    }
    
    renderTempCards();
    closeCardModal();
  }
});

/**
 * Renders the list of all decks on the main screen.
 */
function renderDecks() {
  const container = document.getElementById('decks-container');
  
  if (decks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h2 class="empty-title">No decks yet</h2>
        <p>Create your first flashcard deck to start learning!</p>
      </div>
    `;
    return;
  }

  // Ensure the grid container exists after initial empty state is gone
  if (!document.getElementById('decks-grid')) {
    container.innerHTML = `<div class="decks-grid" id="decks-grid"></div>`;
  }
  
  const grid = document.getElementById('decks-grid');
  grid.innerHTML = decks.map((deck, index) => {
    // Escape single quotes in deck name for onclick function
    const escapedName = deck.name.replace(/'/g, "\\'");
    return `
      <div class="deck-card" onclick="studyDeck(${index})">
        <div class="deck-header">
          <div>
            <div class="deck-title">${deck.name}</div>
            <div class="deck-stats">
              <span class="stat-badge">${deck.cards.length} cards</span>
              <span class="stat-badge">${deck.studyCount || 0} sessions</span>
            </div>
          </div>
        </div>
        <div class="deck-actions" onclick="event.stopPropagation()">
          <button class="btn btn-small" onclick="editDeck(${index})">Edit</button>
          <button class="btn btn-small" onclick="showDeleteModal('deck', ${index}, '${escapedName}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Loads a deck for editing.
 * @param {number} index - Index of the deck in the decks array.
 */
function editDeck(index) {
  const deck = decks[index];
  document.getElementById('deckModalTitle').textContent = 'Edit Deck';
  document.getElementById('deckName').value = deck.name;
  currentEditingDeck = index;
  tempCards = [...deck.cards];
  renderTempCards();
  document.getElementById('deckModal').classList.add('active');
  document.getElementById('deckName').focus();
}

/**
 * Initializes the study mode for a selected deck.
 * @param {number} deckIndex - Index of the deck in the decks array.
 */
function studyDeck(deckIndex) {
  if (decks[deckIndex].cards.length === 0) {
    alert("This deck has no cards to study!");
    return;
  }

  currentStudyDeck = deckIndex;
  currentCardIndex = 0;
  
  // Shuffle cards 
  shuffledCards = shuffleArray(decks[deckIndex].cards);
  
  decks[deckIndex].studyCount = (decks[deckIndex].studyCount || 0) + 1;
  save(); // Save study count
  renderStudyMode();
}

/**
 * Renders the study screen with the current flashcard.
 */
function renderStudyMode() {
  const deck = decks[currentStudyDeck];
  const card = shuffledCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / shuffledCards.length) * 100;

  document.getElementById('app-content').innerHTML = `
    <div class="study-container">
      <div class="study-header">
        <h2 class="study-title">${deck.name}</h2>
        <div class="deck-stats">
          <span class="stat-badge">Card ${currentCardIndex + 1} of ${shuffledCards.length}</span>
          <span class="stat-badge">${Math.round(progress)}% Complete</span>
        </div>
        <div class="study-progress">
          <div class="study-progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>
      
      <div class="flashcard-container">
        <div class="flashcard" onclick="flipCard()">
          <div class="flashcard-inner" id="flashcard-inner">
            <div class="flashcard-face">
              <div>${card.front}</div>
            </div>
            <div class="flashcard-face flashcard-back">
              <div>${card.back}</div>
            </div>
          </div>
        </div>
      </div>
      
      <p class="flip-hint">Click the card to reveal the answer</p>
      
      <div class="difficulty-buttons" id="difficulty-buttons" style="display: none;">
        <button class="btn btn-easy" onclick="markDifficulty('easy')">😊 Easy (1)</button>
        <button class="btn" onclick="markDifficulty('medium')">🤔 Medium (2)</button>
        <button class="btn btn-hard" onclick="markDifficulty('hard')">😰 Hard (3)</button>
      </div>
      
      <div class="study-controls">
        <button class="btn btn-secondary" onclick="backToDecks()">← Back</button>
      </div>
    </div>
  `;
}

/**
 * Toggles the 'flipped' class on the flashcard and shows difficulty buttons.
 */
function flipCard() {
  const card = document.querySelector('.flashcard');
  card.classList.toggle('flipped');
  
  // Show difficulty buttons after flip
  const difficultyButtons = document.getElementById('difficulty-buttons');
  if (card.classList.contains('flipped')) {
    difficultyButtons.style.display = 'flex';
  } else {
    // Hide if unflipped (e.g., if re-flipped quickly)
    difficultyButtons.style.display = 'none';
  }
}

/**
 * Marks a card's difficulty and advances to the next card.
 * @param {string} difficulty - The marked difficulty ('easy', 'medium', 'hard').
 */
function markDifficulty(difficulty) {
  // Logic for space repetition (Spaced Repetition System - SRS) would go here.
  // For now, it simply advances to the next card.
  
  if (currentCardIndex < shuffledCards.length - 1) {
    currentCardIndex++;
    renderStudyMode();
  } else {
    // Study session complete
    alert('🎉 Great job! You\'ve completed this deck!');
    backToDecks();
  }
}

/**
 * Resets study state and returns to the deck list view.
 */
function backToDecks() {
  currentStudyDeck = null;
  shuffledCards = [];
  // Re-inject initial HTML content
  document.getElementById('app-content').innerHTML = `
    <div class="welcome-section">
      <h1 class="welcome-title">Welcome to StudyCards</h1>
      <div class="cta-buttons">
        <button class="btn" onclick="showCreateDeckModal()">
          Create New Deck
        </button>
      </div>
    </div>
    <div id="decks-container">
      <div class="decks-grid" id="decks-grid"></div>
    </div>
  `;
  renderDecks();
}

// Close modals when clicking outside (on the overlay)
document.getElementById('deckModal').addEventListener('click', function(e) {
  if (e.target === this) closeDeckModal();
});

document.getElementById('cardModal').addEventListener('click', function(e) {
  if (e.target === this) closeCardModal();
});

document.getElementById('deleteModal').addEventListener('click', function(e) {
  if (e.target === this) closeDeleteModal();
});

// Keyboard shortcuts for study mode
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeDeckModal();
    closeCardModal();
    closeDeleteModal();
  }
  
  if (currentStudyDeck !== null && !document.querySelector('.modal-overlay.active')) {
    switch(e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        flipCard();
        break;
      case '1':
        e.preventDefault();
        if (document.getElementById('difficulty-buttons').style.display !== 'none') {
          markDifficulty('easy');
        }
        break;
      case '2':
        e.preventDefault();
        if (document.getElementById('difficulty-buttons').style.display !== 'none') {
          markDifficulty('medium');
        }
        break;
      case '3':
        e.preventDefault();
        if (document.getElementById('difficulty-buttons').style.display !== 'none') {
          markDifficulty('hard');
        }
        break;
    }
  }
});

// Initialize app on load
renderDecks();
