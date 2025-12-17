const axios = require("axios");
const { baseUrl, apiKey } = require("./config");

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 5000
    });
  }

  async get(endpoint, params = {}) {
    return this.client.get(endpoint, {
      params: { key: apiKey, ...params }
    });
  }
}

module.exports = new ApiService();
