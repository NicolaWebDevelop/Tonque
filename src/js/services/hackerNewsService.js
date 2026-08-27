import axios from "axios";

const BASE_URL =
  "https://hacker-news.firebaseio.com/v0";

export async function getLatestIds() {
  const response = await axios.get(
    `${BASE_URL}/newstories.json`
  );

  return response.data;
}

export async function getNewsById(id) {
  const response = await axios.get(
    `${BASE_URL}/item/${id}.json`
  );

  return response.data;
}