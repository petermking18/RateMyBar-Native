import axios from "axios";

const getMeters = (miles) => {
  return miles * 1609.34;
};
const getMiles = (meters) => {
  return meters / 1609.34;
};

export default class Bars {
  constructor(baseURL) {
    axios.defaults.baseURL = baseURL;
  }
  async newRatingAutocomplete(
    text,
    lat,
    lng,
    radiusMiles,
    userID,
    authToken,
    sessionToken
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/barAndPlaceAutocomplete", {
          text,
          lat,
          lng,
          radiusMiles,
          userID,
          authToken,
          sessionToken,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          alert(err);
          reject(err);
        });
    });
  }

  async getCoordinates(address) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/getCoordinates", { address: address })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          alert(err);
          reject(err);
        });
    });
  }

  async findNewBar(name, location, radius) {
    radius = getMeters(radius);
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/find", {
          name: name,
          location: location,
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

  async getNearbyBars(userID, authToken, lat, lng, radius) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/getNearbyBars", {
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
          reject();
        });
    });
  }

  async placeAutocomplete(text, location, radiusMiles, sessionToken) {
    const radiusMeters = getMeters(radiusMiles);
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/placeAutocomplete", {
          text: text,
          lat: location.lat,
          lng: location.lng,
          radiusMeters: radiusMeters,
          sessionToken: sessionToken,
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

  async addFoundBar(name, addressOneLine, placeID, userID, authToken) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/addFoundBar", {
          name: name,
          addressOneLine: addressOneLine,
          placeID: placeID,
          userID: userID,
          authToken: authToken,
        })
        .then((response) => {
          resolve(response.data.bar);
        })
        .catch((error) => {
          alert(error);
          reject(error);
        });
    });
  }

  async getFindBarsPage(
    userID,
    authToken,
    sortBy,
    radius,
    lat,
    lng,
    page,
    pageSize
  ) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/getFindBarsPage", {
          userID,
          authToken,
          sortBy,
          radius,
          lat,
          lng,
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

  async getBarPage(userID, authToken, barID, lat, lng, sortBy, page, pageSize) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/getBarPage", {
          userID,
          authToken,
          barID,
          lat,
          lng,
          sortBy,
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

  async getTagPage(userID, authToken, tag, lat, lng, sortBy, page, pageSize) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/bars/getTagPage", {
          userID,
          authToken,
          tag,
          lat,
          lng,
          sortBy,
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
