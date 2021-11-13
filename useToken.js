import { useState } from "react";
import { sessionStorage } from "./Storage";
import * as SecureStore from "expo-secure-store";

export default async function useToken() {
  const retrieveToken = () => {
    return new Promise((resolve, reject) => {
      SecureStore.getItemAsync("currentUser")
        .then((tokenString) => {
          if (tokenString) {
            const userToken = JSON.parse(tokenString);
            resolve(userToken);
          } else {
            resolve(null);
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    });
  };

  // const retrieveToken = () => {
  //   const tokenString = sessionStorage.getItem("currentUser");
  //   if (tokenString) {
  //     const userToken = JSON.parse(tokenString);
  //     return userToken;
  //   } else {
  //     return null;
  //   }
  // };
  const retrievedToken = await retrieveToken();
  const [token, setToken] = useState(retrievedToken);

  const saveToken = (userToken) => {
    setToken(userToken);
    SecureStore.setItemAsync("currentUser", JSON.stringify(userToken)).then(
      () => {
        //setToken(userToken);
      }
    );
  };

  // const saveToken = (userToken) => {
  //   sessionStorage.setItem("currentUser", JSON.stringify(userToken));
  //   setToken(userToken);
  // };

  const removeToken = async () => {
    await SecureStore.deleteItemAsync("currentUser");
    setToken(null);
  };

  // const removeToken = () => {
  //   sessionStorage.removeItem("currentUser");
  //   setToken(null);
  // };

  return {
    setToken: saveToken,
    clearToken: removeToken,
    getToken: retrieveToken,
    token,
  };
}
