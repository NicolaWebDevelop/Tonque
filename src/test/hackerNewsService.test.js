import {
  describe,
  it,
  expect,
  vi,
  afterEach
} from "vitest";

import axios from "axios";

import {
  getLatestIds,
  getNewsById
} from "../js/services/hackerNewsService.js";

vi.mock("axios");

describe("hackerNewsService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("recupera gli ID delle ultime news", async () => {
    const ids = [1, 2, 3];

    axios.get.mockResolvedValue({
      data: ids
    });

    const result = await getLatestIds();

    expect(result).toEqual(ids);

    expect(axios.get).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/newstories.json"
    );
  });

  it("recupera una news tramite ID", async () => {
    const news = {
      id: 123,
      title: "News di prova",
      time: 1756116000
    };

    axios.get.mockResolvedValue({
      data: news
    });

    const result = await getNewsById(123);

    expect(result).toEqual(news);

    expect(axios.get).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/item/123.json"
    );
  });

  it("propaga un errore se il recupero degli ID fallisce", async () => {
    axios.get.mockRejectedValue(
      new Error("Errore di rete")
    );

    await expect(
      getLatestIds()
    ).rejects.toThrow("Errore di rete");
  });

  it("propaga un errore se il recupero della news fallisce", async () => {
    axios.get.mockRejectedValue(
      new Error("News non disponibile")
    );

    await expect(
      getNewsById(123)
    ).rejects.toThrow("News non disponibile");
  });
});