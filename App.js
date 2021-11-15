import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  NativeBaseProvider,
  extendTheme,
  Image,
  HStack,
  Box,
  Icon,
  TouchableOpacity,
} from "native-base";
import useCurrentLocation from "./useCurrentLocation";
import * as Location from "expo-location";
import Login from "./Components/Login/Login";
import Feed from "./Components/Feed/Feed";
import FindBars from "./Components/FindBars/FindBars";
import Profile from "./Components/Profile/Profile";
import User from "./Components/User/User";
import Rating from "./Components/Rating/Rating";
import Tag from "./Components/Tag/Tag";
import Bar from "./Components/Bar/Bar";
import Search from "./Components/Search/Search";
import Activity from "./Components/Activity/Activity";
import FollowRequests from "./Components/Activity/FollowRequests";
import LocationView from "./Components/LocationView";
import { createStackNavigator } from "@react-navigation/stack";
import { default as logo } from "./assets/logo.png";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewIsActivity, setViewIsActivity] = useState(false);

  const onNewNotification = (notification) => {
    if (!viewIsActivity) {
      //show notification here
    }
  };

  useEffect(async () => {
    const tokenString = await SecureStore.getItemAsync("currentUser");
    if (tokenString) {
      const userToken = JSON.parse(tokenString);
      setToken(userToken);
    } else {
      setToken(null);
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      Location.getCurrentPositionAsync({}).then((location) => {
        const loc = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        setLocation(loc);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const saveToken = async (userToken) => {
    await SecureStore.setItemAsync("currentUser", JSON.stringify(userToken));
    setToken(userToken);
  };
  const clearToken = async () => {
    await SecureStore.deleteItemAsync("currentUser");
    setToken(null);
  };

  const AppStack = createStackNavigator();
  const Drawers = createDrawerNavigator();

  const styles = getStyles(theme);

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props} style={{ height: "100%" }}>
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10,
            marginTop: 10,
          }}>
          <HStack alignItems="flex-end" justifyContent="flex-start" space={2}>
            <Image source={logo} alt="Logo" size="xs" resizeMode="contain" />
            <Text style={{ fontSize: 30, fontWeight: "500" }}>RateMyBar</Text>
          </HStack>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          labelStyle={{ fontSize: 20 }}
          activeTintColor={theme.colors.primary["500"]}
          onPress={() => clearToken()}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <NativeBaseProvider theme={theme}>
      {loading ? (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}>
          <HStack alignItems="flex-end" justifyContent="center" space={2}>
            <Image source={logo} alt="Logo" size="xs" resizeMode="contain" />
            <Text style={{ fontSize: 30, fontWeight: "500" }}>RateMyBar</Text>
          </HStack>
        </SafeAreaView>
      ) : token ? (
        location ? (
          <NavigationContainer>
            <AppStack.Navigator
              initialRouteName="Main"
              screenListeners={{
                state: (e) => {
                  setViewIsActivity(
                    e.data.state.routeNames[e.data.state.index] === "Activity"
                  );
                },
              }}>
              <AppStack.Screen
                name="Main"
                options={{ title: "Main", headerShown: false }}>
                {(props) => (
                  <Drawers.Navigator
                    {...props}
                    initialRouteName="Feed"
                    screenOptions={{
                      drawerActiveTintColor: theme.colors.primary["500"],
                      headerStyle: styles.headerStyle,
                      headerBackTitleVisible: false,
                      headerTintColor: "white",
                      drawerLabelStyle: {
                        fontSize: 20,
                      },
                    }}
                    drawerContent={(props) => (
                      <CustomDrawerContent {...props} />
                    )}>
                    {() => (
                      <View
                        style={{
                          height: 100,
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <Text style={{ fontSize: 32 }}>RateMyBar</Text>
                      </View>
                    )}
                    <Drawers.Screen name="Feed">
                      {(props) => (
                        <Feed {...props} token={token} location={location} />
                      )}
                    </Drawers.Screen>
                    <Drawers.Screen name="Find Bars">
                      {(props) => (
                        <FindBars
                          {...props}
                          token={token}
                          location={location}
                        />
                      )}
                    </Drawers.Screen>
                    <Drawers.Screen name="Search">
                      {(props) => (
                        <Search {...props} token={token} location={location} />
                      )}
                    </Drawers.Screen>
                    <Drawers.Screen name="Profile">
                      {(props) => (
                        <Profile {...props} location={location} token={token} />
                      )}
                    </Drawers.Screen>
                    <Drawers.Screen name="Activity">
                      {(props) => (
                        <Activity
                          {...props}
                          location={location}
                          token={token}
                          onNewNotification={onNewNotification}
                        />
                      )}
                    </Drawers.Screen>
                  </Drawers.Navigator>
                )}
              </AppStack.Screen>
              <AppStack.Screen
                name="User"
                options={{
                  title: "User",
                  headerStyle: styles.headerStyle,
                  headerBackTitleVisible: false,
                  headerTintColor: "white",
                }}>
                {(props) => (
                  <User {...props} location={location} token={token} />
                )}
              </AppStack.Screen>
              <AppStack.Screen
                name="Rating"
                options={{
                  title: "Rating",
                  headerStyle: styles.headerStyle,
                  headerBackTitleVisible: false,
                  headerTintColor: "white",
                  presentation: "modal",
                  headerBackImage: () => (
                    <MaterialIcons
                      color="white"
                      size={35}
                      style={{ marginLeft: 10 }}
                      name="expand-more"
                    />
                  ),
                }}>
                {(props) => (
                  <Rating {...props} location={location} token={token} />
                )}
              </AppStack.Screen>
              <AppStack.Screen
                name="Tag"
                options={{
                  title: "Tag",
                  headerStyle: styles.headerStyle,
                  headerBackTitleVisible: false,
                  headerTintColor: "white",
                }}>
                {(props) => (
                  <Tag {...props} location={location} token={token} />
                )}
              </AppStack.Screen>
              <AppStack.Screen
                name="Bar"
                options={{
                  title: "Bar",
                  headerStyle: styles.headerStyle,
                  headerBackTitleVisible: false,
                  headerTintColor: "white",
                }}>
                {(props) => (
                  <Bar {...props} location={location} token={token} />
                )}
              </AppStack.Screen>
              <AppStack.Screen
                options={{
                  title: "Follow Requests",
                  headerStyle: styles.headerStyle,
                  headerBackTitleVisible: false,
                  headerTintColor: "white",
                }}
                name="Follow Requests"
                component={FollowRequests}
              />
            </AppStack.Navigator>
          </NavigationContainer>
        ) : (
          <LocationView setLocation={setLocation} />
        )
      ) : (
        <Login setToken={saveToken} />
      )}
    </NativeBaseProvider>
  );
}

const getStyles = (theme) => {
  const colors = theme.colors;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    headerStyle: {
      backgroundColor: colors.primary["500"],
    },
    headerBackTitleStyle: {
      color: "white",
      fontWeight: "600",
    },
  });
  return styles;
};

const theme = extendTheme({
  colors: {
    primary: {
      50: "#fff3cd",
      100: "#fff3cd",
      200: "#FFE69C",
      300: "#FFDA6A",
      400: "#FFCD39",
      500: "#FFC107",
      600: "#CC9A06",
      700: "#997404",
      800: "#664D03",
      900: "#332701",
    },
    rmb: {
      50: "#FFC107",
      100: "#FFC107",
      200: "#FFC107",
      300: "#FFC107",
      400: "#FFC107",
      500: "#FFC107",
      600: "#FFC107",
      700: "#FFC107",
      800: "#FFC107",
      900: "#FFC107",
    },
  },
});
