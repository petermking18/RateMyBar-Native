import axios from "axios";

export default class Search {
  async search(userID, authToken, search) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/search/search", { userID, authToken, search })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          alert(error);
          reject(error);
        });
    });
  }
}
