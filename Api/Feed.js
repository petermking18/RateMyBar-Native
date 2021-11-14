import axios from "axios";

export default class Feed {
  constructor(baseUrl) {
    axios.defaults.baseURL = baseUrl;
  }
  async getFeed(
    userID,
    authToken,
    lat,
    lng,
    view,
    sortBy,
    radius,
    page,
    pageSize
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/feed/getFeed", {
          userID,
          authToken,
          lat,
          lng,
          view,
          sortBy,
          radius,
          page,
          pageSize,
        })
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
