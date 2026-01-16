
import axios from "axios"; 
import { baseUrl, apiKey } from "./config.js";

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

export default new ApiService();
