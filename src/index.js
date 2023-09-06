import './module/style.css';
import { displayScores, handleSubmission } from './module/displayhandler.js';

const initialize = () => {
  document.addEventListener('click', handleSubmission);
  displayScores();
};

window.addEventListener('DOMContentLoaded', initialize);
