class Leaderboard {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.gameName = 'leaderboard-record';
    this.gameId = localStorage.getItem(this.gameName);
    this.errors = [];

    this.initializeGameId();
  }

  async initializeGameId() {
    if (!this.gameId) {
      try {
        this.gameId = await this.createGame(this.gameName);
        localStorage.setItem(this.gameName, this.gameId);
        this.gameIdAvailable = true;
      } catch (error) {
        this.errors.push(error);
      }
    } else {
      this.gameIdAvailable = true;
    }
  }

  async createGame(name) {
    const url = `${this.baseUrl}games/`;
    const requestData = { name };
    const response = await this.makeRequest(url, 'POST', requestData);
    return response.result;
  }

  async addScore(user, score) {
    const url = `${this.baseUrl}games/${this.gameId}/scores/`;
    const requestData = { user, score };
    const response = await this.makeRequest(url, 'POST', requestData);
    return response.result;
  }

  async getScores() {
    if (!this.gameId) return [];
    const url = `${this.baseUrl}games/${this.gameId}/scores/`;
    const response = await this.makeRequest(url);
    return response.result;
  }

  /* eslint-disable class-methods-use-this */
  async makeRequest(url, method = 'GET', requestData = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      headers,
    };

    if (requestData) {
      options.body = JSON.stringify(requestData);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }
}

export default Leaderboard;
