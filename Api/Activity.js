import axios from "axios";

export default class Activity {
  constructor(baseUrl) {
    axios.defaults.baseURL = baseUrl;
  }
  async get(userID, authToken) {
    return new Promise(function (resolve, reject) {
      axios
        .post("/api/activity/get", { userID, authToken })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          alert(error.response.data);
          reject();
        });
    });
  }
  async declineFollowRequest(friendID, userID, authToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/activity/declineFollowRequest", {
          friendID,
          userID,
          authToken,
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
  async approveFollowRequest(friendID, userID, authToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/activity/approveFollowRequest", {
          friendID,
          userID,
          authToken,
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
  async markNotificationSeen(notificationID, userID, authToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/activity/markNotificationSeen", {
          notificationID,
          userID,
          authToken,
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
  async deleteNotification(notificationID, userID, authToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/activity/deleteNotification", {
          notificationID,
          userID,
          authToken,
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
}
