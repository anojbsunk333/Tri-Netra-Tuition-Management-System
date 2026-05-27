import { BATCHES } from "../mockData.js";

export function listBatches(req, res) {
  res.json(BATCHES);
}
