import axios from "axios";

export default class Auth {
  constructor(baseURL) {
    axios.defaults.baseURL = baseURL;
  }
  async register(newUser) {
    return new Promise((resolve, reject) => {
      newUser.deviceType = "Mobile";
      axios.post("/api/auth/register", newUser).then((response) => {
        if (response.data.code == 200) {
          resolve(response.data.result);
        } else {
          alert(response.data.message);
        }
      });
    });
  }
  async login(username, password, expoPushToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/auth/login", {
          username: username,
          password: password,
          deviceType: "Mobile",
          expoPushToken: expoPushToken,
        })
        .then((response) => {
          if (response.data.code == 200) {
            resolve(response.data.result);
          } else {
            reject(response.data.message);
          }
        })
        .catch((error) => {
          alert(error);
        });
    });
  }
  async logout(userToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/auth/logout", { user: userToken, deviceType: "Mobile" })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          alert(error);
          reject();
        });
    });
  }
  async getAllUsernames() {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/auth/usernames")
        .then((response) => {
          resolve(response.data.result);
        })
        .catch((error) => {
          alert(error.response.data);
          reject();
        });
    });
  }
}
