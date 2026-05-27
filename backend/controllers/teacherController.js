import { TEACHERS } from "../mockData.js";

export function listTeachers(req, res) {
  res.json(TEACHERS);
}
