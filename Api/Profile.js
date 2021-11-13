import axios from "axios";
import FormData from "form-data";

export default class Profile {
  constructor(baseURL) {
    axios.defaults.baseURL = baseURL;
  }
  async get(userID, authToken, lat, lng, page, pageSize) {
    return new Promise((resolve, reject) => {
      axios
        .post(`/api/profile/get`, {
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
  async updateProfileInfo(userID, authToken, name, school, bio, privacy) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/profile/profileInfo", {
          userID,
          authToken,
          name,
          school,
          bio,
          privacy,
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
  async unfollowUser(userID, authToken, friendID) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/profile/unfollowUser", {
          userID,
          authToken,
          friendID,
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

  async deleteRating(
    userID,
    authToken,
    reviewID,
    lat,
    lng,
    page = 0,
    pageSize = 5
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/profile/deleteRating", {
          userID,
          authToken,
          reviewID,
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

  async changeProfilePhoto(userID, authToken, file, fileType) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/profile/profilePhotoUploadSign", {
          userID,
          authToken,
          fileType,
        })
        .then(async (response) => {
          const signedUrl = response.data;
          const options = {
            headers: {
              "Content-Type": fileType,
            },
          };
          await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": fileType,
            },
          });
          axios
            .post("/api/profile/getProfilePhotoSign", { userID, authToken })
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              alert(error);
              reject();
            });
          // axios
          //   .put(signedUrl, file, options)
          //   .then((response) => {
          //     axios
          //       .post("/api/profile/getProfilePhotoSign", { userID, authToken })
          //       .then((response) => {
          //         resolve(response.data);
          //       });
          //   })
          //   .catch((error) => {
          //     alert(error);
          //     reject();
          //   });
        })
        .catch((error) => {
          alert(error);
          reject(error);
        });
    });
  }
}
