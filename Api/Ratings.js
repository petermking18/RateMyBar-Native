import axios from "axios";

const postReviewPhoto = async (signedUrl, image) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { "Content-Type": image.type },
    };
    axios.put(signedUrl, image, options).then(() => {
      resolve();
    });
  });
};

export default class Ratings {
  constructor(baseURL) {
    axios.defaults.baseURL = baseURL;
  }
  async getNewRatingPage(userID, authToken, lat, lng, radius) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/ratings/getNewRatingPage", {
          userID: userID,
          authToken: authToken,
          lat: lat,
          lng: lng,
          radius: radius,
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

  async postRating(
    userID,
    authToken,
    placeID,
    description,
    categoryRatings,
    tags,
    photos
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/ratings/newRating", {
          userID: userID,
          authToken: authToken,
          placeID: placeID,
          description: description,
          categoryRatings: categoryRatings,
          tags: tags,
          numPhotos: photos.length,
        })
        .then(async (response) => {
          const postUrls = response.data.postUrls;
          for (let i = 0; i < photos.length; i++) {
            //await postReviewPhoto(postUrls[i], photos[i]);
            await fetch(postUrls[i], {
              method: "PUT",
              body: photos[i].blob,
              headers: {
                "Content-Type": "image/jpg",
              },
            });
          }
          resolve({ review: response.data.review });
        })
        .catch((error) => {
          alert(error);
          reject(error);
        });
    });
  }

  async postComment(userID, authToken, reviewID, comment) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/ratings/addComment", {
          userID,
          authToken,
          reviewID,
          comment,
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

  async deleteComment(userID, authToken, reviewID, commentID) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/ratings/deleteComment", {
          userID,
          authToken,
          reviewID,
          commentID,
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

  async getRatingPage(userID, authToken, reviewID, lat, lng) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/ratings/getRatingPage", {
          userID,
          authToken,
          reviewID,
          lat,
          lng,
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

  async getBarByIDForRating(userID, authToken, barID) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/ratings/getBarByIDForRating", { userID, authToken, barID })
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
