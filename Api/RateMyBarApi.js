import axios from "axios";
import Auth from "./Auth";
import Bars from "./Bars";
import Profile from "./Profile";
import User from "./User";
import Activity from "./Activity";
import Ratings from "./Ratings";
import Feed from "./Feed";
import Search from "./Search";

const baseUrl = "http://" + "192.168.1.73" + ":3050";
// const baseUrl = "http://" + "10.8.69.90" + ":3050";
// const baseUrl = "http://" + "10.8.71.179" + ":3050";

export class RateMyBarApi {
  auth = new Auth(baseUrl);
  bars = new Bars(baseUrl);
  profile = new Profile(baseUrl);
  user = new User();
  activity = new Activity();
  ratings = new Ratings(baseUrl);
  feed = new Feed();
  search = new Search();
}
