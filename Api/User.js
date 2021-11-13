import axios from "axios";

export default class User {
  async get(otherUserID, userID, authToken, lat, lng, page, pageSize) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/user/get", {
          otherUserID,
          userID,
          authToken,
          lat,
          lng,
          page,
          pageSize,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          alert(error.response.data);
          reject();
        });
    });
  }
  async followAction(otherUserID, userID, authToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/user/followAction", { otherUserID, userID, authToken })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          alert(error.response.data);
          reject();
        });
    });
  }
}
