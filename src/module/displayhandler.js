import Leaderboard from './Utils.js';

const API_BASE_URL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';
const leaderboard = new Leaderboard(API_BASE_URL);

const scoreContainer = document.getElementById('list-scores');
const statusContainer = document.getElementById('message-container');

const displayScores = async () => {
  try {
    const scores = await leaderboard.getScores();

    if (scores.length > 0) {
      scoreContainer.innerHTML = '';
      scores.forEach((score) => {
        const scoreItem = document.createElement('li');
        scoreItem.classList.add('score-list');
        scoreItem.innerHTML = `<p>${score.user}: ${score.score}</p>`;
        scoreContainer.appendChild(scoreItem);
      });
      scoreContainer.classList.add('border');
    } else {
      scoreContainer.innerHTML = `<div class="empty-warning">
        <h2>Add new scores</h2>
      </div>`;
      scoreContainer.classList.remove('border');
    }
  } catch (error) {
    statusContainer.textContent = `${error}: Check your Internet`;
  }
};

const handleSubmission = async (e) => {
  e.preventDefault();
  const submitButton = e.target;

  if (submitButton.id === 'submit') {
    statusContainer.textContent = 'Submitting...';
    statusContainer.classList.remove('hidden');

    const nameInput = document.querySelector('.name');
    const scoreInput = document.querySelector('.scores');
    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);

    if (name && !Number.isNaN(score)) {
      try {
        const result = await leaderboard.addScore(name, score);
        displayScores();
        statusContainer.textContent = result;
        statusContainer.className = 'success';
        nameInput.value = '';
        scoreInput.value = '';
      } catch (error) {
        statusContainer.className = 'error';
        statusContainer.textContent = `${error}: Check your Internet`;
      }

      setTimeout(() => {
        statusContainer.className = 'hidden';
      }, 3000);
    }
  } else if (submitButton.id === 'refresh') {
    window.location.reload();
  }
};

export { displayScores, handleSubmission };
