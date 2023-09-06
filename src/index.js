import './module/style.css';

document.addEventListener('DOMContentLoaded', () => {
  const baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';
  let gameId;
  const scoresList = document.getElementById('list-scores');
  const messageContainer = document.getElementById('message-container');

  // Function to display a message in the HTML document and auto-hide it after 3 seconds
  const displayMessage = (message, isError = false) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    if (isError) {
      messageElement.classList.add('error-message');
    }
    messageContainer.appendChild(messageElement);

    // Remove the message element after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  };

  // Function to get scores for the created game
  const getScores = async () => {
    try {
      const response = await fetch(`${baseURL}games/${gameId}/scores`);
      const data = await response.json();
      scoresList.innerHTML = ''; // Clear previous scores
      data.result.forEach((score) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${score.user} : ${score.score}`;
        scoresList.appendChild(listItem);
      });
    } catch (error) {
      displayMessage('Error fetching scores', true);
    }
  };

  // Immediately fetch scores when the page is loaded
  getScores();

  // Function to create a new game
  const displayScores = async () => {
    try {
      const response = await fetch(`${baseURL}games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Leaderboard' }), // Replace with your game name
      });
      const data = await response.json();
      gameId = data.result;
      getScores(); // Fetch and display scores after creating the game
    } catch (error) {
      displayMessage('Error creating game', true);
    }
  };
  // Function to submit a score for the created game
  const submitScore = async (name, score) => {
    try {
      await fetch(`${baseURL}games/${gameId}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: name, score: parseInt(score, 10) }), // Added radix parameter
      });

      // Display success message and refresh scores
      displayMessage('Scores submitted successfully');
      getScores(); // Refresh scores after submission
    } catch (error) {
      displayMessage('Error submitting score', true);
    }
  };

  // Event listeners
  document.querySelector('.refresh').addEventListener('click', () => {
    window.location.reload();
  });

  document.querySelector('#form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.querySelector('.name').value;
    const score = document.querySelector('.Scores').value;
    if (name && score) {
      // Use await here to ensure submission completes before refreshing
      await submitScore(name, score);
      // Clear input fields after submission
      document.querySelector('.name').value = '';
      document.querySelector('.Scores').value = '';
    } else {
      displayMessage('Please enter both name and score', true);
    }
  });

  // Initialize the game and fetch scores when the page is loaded
  displayScores();
  getScores();
});
