document.addEventListener('DOMContentLoaded', () => {
    let runningCount = 0;
    let decks = 0;
    let totalCards, highCards, lowCards, neutralCards;
    const decksInput = document.getElementById('decks-input');
    const runningCountDisplay = document.getElementById('running-count');
    const trueCountDisplay = document.getElementById('true-count');
    const deckCountDisplay = document.getElementById('deck-count');
    const cardsLeftDisplay = document.getElementById('cards-left');

    // Function to prompt user for number of decks and initialize or update card counts
    function promptForDecksAndUpdateCounts() {
        let input = prompt("Please enter the number of decks", "1");
        input = parseInt(input, 10);
        if (!isNaN(input) && input > 0) {
            decks = input;
        } else {
            // If the input is invalid, keep prompting until a valid input is provided
            alert("Invalid input. Please enter a valid number of decks.");
            promptForDecksAndUpdateCounts();
            return;
        }
        decksInput.value = decks; // Reflect this in the input field as well
        initializeCardCounts();
    }

    // Initialize or reset card counts
    function initializeCardCounts() {
        totalCards = decks * 52;
        highCards = lowCards = decks * 20;
        neutralCards = decks * 12;
        updateCounts();
    }

    // Prompt for decks on load
    promptForDecksAndUpdateCounts();

    // Update deck count when manually changed
    decksInput.addEventListener('change', function() {
        decks = parseInt(this.value, 10);
        if (!isNaN(decks) && decks > 0) {
            resetAndRecalculate(); // Call the new reset function
        } else {
            alert("Please enter a valid number of decks.");
            this.value = decks; // Reset to the previous valid number of decks if the input is invalid
        }
        initializeCardCounts();
    });

    document.getElementById('reset-button').addEventListener('click', function() {
        location.reload();
    });
    
    // Handle card button clicks
    document.getElementById('card-buttons').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const cardValue = e.target.getAttribute('data-value');
            switch (cardValue) {
                case 'low':
                    runningCount += 1;
                    lowCards--;
                    break;
                case 'neutral':
                    neutralCards--;
                    break;
                case 'high':
                    runningCount -= 1;
                    highCards--;
                    break;
            }
            totalCards--;
            updateCounts();

            // Check if 52 cards have been dispensed and decrease deck count
            if ((decks * 52 - totalCards) % 52 === 0) {
                decks--;
            }
        }
    });

    function updateCounts() {
        runningCountDisplay.textContent = `Running Count: ${runningCount}`;
        const trueCount = decks ? (runningCount / decks).toFixed(2) : 0;
        trueCountDisplay.textContent = `True Count: ${trueCount}`;
        deckCountDisplay.textContent = `Decks Left: ${decks}`;
        cardsLeftDisplay.textContent = `Cards Left: ${totalCards}`; // Update cards left display
    
        // If decks left goes to 0, prompt the user to update the number of decks
        if (decks <= 0) {
            location.reload();
            promptForDecksAndUpdateCounts();
        }
        
        // Update likelihoods logic remains the same
        updateLikelihoods();
    }
    

    function updateLikelihoods() {
        const highLikelihood = ((highCards / totalCards) * 100).toFixed(2);
        const lowLikelihood = ((lowCards / totalCards) * 100).toFixed(2);
        const neutralLikelihood = ((neutralCards / totalCards) * 100).toFixed(2);

        const highLikelihoodBar = document.getElementById('high-likelihood');
        const lowLikelihoodBar = document.getElementById('low-likelihood');
        const neutralLikelihoodBar = document.getElementById('neutral-likelihood');

        highLikelihoodBar.style.width = `${highLikelihood}%`;
        highLikelihoodBar.textContent = `${highLikelihood}%`;

        lowLikelihoodBar.style.width = `${lowLikelihood}%`;
        lowLikelihoodBar.textContent = `${lowLikelihood}%`;

        neutralLikelihoodBar.style.width = `${neutralLikelihood}%`;
        neutralLikelihoodBar.textContent = `${neutralLikelihood}%`;
}

    function resetAndRecalculate() {
        // Reset running count
        runningCount = 0;

        // Re-initialize card counts based on the new deck count
        initializeCardCounts();

        // Update UI elements to reflect the reset
        updateCounts();
    }

});
