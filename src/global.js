export const notificationId = "keno-live-draw-alert";

export const backgroundFetchOptions = {
  taskName: "Keno Live App",
  taskTitle: "Keno Live App is running in Background",
  taskDesc: "Keno Live App is active",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: "#ff00ff",
  parameters: {
    delay: 5000,
  },
};

export const timezoneOptions = [
  { label: "NSW", value: "NSW" },
  { label: "VIC", value: "VIC" },
  { label: "QLD", value: "QLD" },
  { label: "ACT", value: "ACT" },
  { label: "TAS", value: "TAS" },
  { label: "SA", value: "SA" },
  { label: "NT", value: "NT" },
];

export const number_of_games = 50;

export const KDS_URLS = {
  NSW: "https://api-info-nsw.keno.com.au/v2/games/kds?jurisdiction=NSW",
  VIC: "https://api-info-vic.keno.com.au/v2/games/kds?jurisdiction=VIC",
  QLD: "https://api-info-qld.keno.com.au/v2/games/kds?jurisdiction=QLD",
  ACT: "https://api-info-act.keno.com.au/v2/games/kds?jurisdiction=ACT",
  TAS: "https://api-info-act.keno.com.au/v2/games/kds?jurisdiction=ACT",
  SA: "https://api-info-act.keno.com.au/v2/games/kds?jurisdiction=ACT",
  NT: "https://api-info-act.keno.com.au/v2/games/kds?jurisdiction=ACT",
};
export const HISTORY_URLS = {
  NSW: "https://api-info-nsw.keno.com.au/v2/info/history?jurisdiction=NSW",
  VIC: "https://api-info-vic.keno.com.au/v2/info/history?jurisdiction=VIC",
  QLD: "https://api-info-qld.keno.com.au/v2/info/history?jurisdiction=QLD",
  ACT: "https://api-info-act.keno.com.au/v2/info/history?jurisdiction=ACT",
  TAS: "https://api-info-act.keno.com.au/v2/info/history?jurisdiction=ACT",
  SA: "https://api-info-act.keno.com.au/v2/info/history?jurisdiction=ACT",
  NT: "https://api-info-act.keno.com.au/v2/info/history?jurisdiction=ACT",
};

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

export const fetchData = async (jurisdiction) => {
  try {
    const response_lastItem = await fetch(KDS_URLS[jurisdiction]);
    if (!response_lastItem.ok) {
      throw new Error(`HTTP error! status: ${response_lastItem.status}`);
    }

    const lastResult = await response_lastItem.json();
    const time2NextDraw = Math.abs(
      new Date(lastResult?.selling?.closing) - new Date()
    );

    let succedTofetchCurrentData =
      lastResult?.current?.draw?.length === 20 && time2NextDraw > 5000;

    let timeoutDuration = succedTofetchCurrentData
      ? time2NextDraw - 3000
      : 1000;

    if (succedTofetchCurrentData) {
      const currentNumber = parseInt(lastResult?.current["game-number"]);
      const localTime = new Date();
      const nswOffset =
        -(2 + (localTime.getMonth() > 3 && localTime.getMonth() < 9 ? 1 : 0)) *
        60;
      const nswTimeMs =
        localTime.getTime() -
        (nswOffset - localTime.getTimezoneOffset()) * 60000;
      const nswDate = new Date(nswTimeMs);
      const year = String(nswDate.getFullYear());
      const month = String(nswDate.getMonth() + 1).padStart(2, "0");
      const day = String(nswDate.getDate()).padStart(2, "0");

      const fetchHistoryUrl = `${
        HISTORY_URLS[jurisdiction]
      }&starting_game_number=${
        currentNumber - number_of_games + 1
      }&number_of_games=${number_of_games}&date=${year}-${month}-${day}&page_size=${number_of_games}&page_number=1`;

      const history_response = await fetch(fetchHistoryUrl);

      if (!history_response.ok) {
        throw new Error(`HTTP error! status: ${history_response.status}`);
      }

      console.log(`fetchHistoryUrl -2- ${fetchHistoryUrl}`);
      const json2 = await history_response.json();

      return { timeoutDuration, datas: [...json2.items].sort(
        (a, b) => b["game-number"] - a["game-number"]
      ) };
    }
    return { timeoutDuration, datas:[] };
  } catch (error) {
    return { timeoutDuration: 1000, datas: [] };
  }
};
