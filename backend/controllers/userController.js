import { USERS } from "../mockData.js";

export function getUsers(req, res) {
  res.json(USERS);
}
