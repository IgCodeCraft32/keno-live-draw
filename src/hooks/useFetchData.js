import { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { KDS_URLS, HISTORY_URLS, number_of_games } from "../global";

const useFetchData = (jurisdiction = "NSW") => {
  const throttle = (func, duration) => {
    var lasttime = new Date();
    return (text) => {
      if (lasttime > new Date() + duration * 1000) {
        func(text);
        lasttime = new Date();
      }
    };
  };

  const [appState, setAppState] = useState(AppState.currentState);
  const [enableFetch, setEnableFetch] = useState(true);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        setEnableFetch(true);
      } else if (nextAppState === "background") {
        setEnableFetch(false);
      }
      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      // Cleanup the event listener on unmount
      subscription.remove();
    };
  }, [appState]);

  const [datas, setDatas] = useState([]);
  const [error, setError] = useState(null);
  const [disableError, setDisableError] = useState(false);
  const timeoutIdRef = useRef(null);

  const handleError = throttle((text) => {
    setError(text), 60;
  });

  const fetchData = async () => {
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

      console.log(
        `${jurisdiction} ${KDS_URLS[jurisdiction]}`,
        parseInt(lastResult?.current["game-number"]),
        succedTofetchCurrentData,
        lastResult?.current?.draw?.length
      );
      if (succedTofetchCurrentData) {
        const currentNumber = parseInt(lastResult?.current["game-number"]);
        const localTime = new Date();
        const nswOffset =
          -(
            2 + (localTime.getMonth() > 3 && localTime.getMonth() < 9 ? 1 : 0)
          ) * 60;
        const nswTimeMs =
          localTime.getTime() -
          (nswOffset - localTime.getTimezoneOffset()) * 60000;
        const nswDate = new Date(nswTimeMs);
        const year = String(nswDate.getFullYear());
        const month = String(nswDate.getMonth() + 1).padStart(2, "0");
        const day = String(nswDate.getDate()).padStart(2, "0");

        console.log("datas", datas.length);
        const fetchHistoryUrl = `${
          HISTORY_URLS[jurisdiction]
        }&starting_game_number=${
          currentNumber - number_of_games + 1
        }&number_of_games=${number_of_games}&date=${year}-${month}-${day}&page_size=${number_of_games}&page_number=1`;

        console.log("fetchHistoryUrl", fetchHistoryUrl);

        const history_response = await fetch(fetchHistoryUrl);

        if (!history_response.ok) {
          throw new Error(`HTTP error! status: ${history_response.status}`);
        }

        console.log(`fetchHistoryUrl ${fetchHistoryUrl}`);
        const json2 = await history_response.json();

        console.log("json2.items?.length", json2.items?.length);
        // if (json2.items?.length === number_of_games) {
        setDatas(
          [...json2.items].sort((a, b) => b["game-number"] - a["game-number"])
        );
        setDisableError(false);
        setError(null);
        // } else {
        //   throw new Error("History Fetch error");
        // }
      } else {
        throw new Error("Live Draw Fetch error");
      }

      if (timeoutIdRef.current) {
        // console.log("timerRef", timeoutIdRef.current, 1);
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      timeoutIdRef.current = setTimeout(fetchData, timeoutDuration);
    } catch (error) {
      if (!disableError) handleError(new Error(error).message);

      if (timeoutIdRef.current) {
        console.log("timerRef", timeoutIdRef.current, 2);
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      timeoutIdRef.current = setTimeout(fetchData, 1000);
    }
  };

  useEffect(() => {
    if (timeoutIdRef.current) {
      console.log("timerRef", timeoutIdRef.current, 3);
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;

      setDatas([]);
      setError(null);
    }

    if (enableFetch) fetchData();
  }, [jurisdiction, enableFetch]);

  const cancelModal = () => {
    setError(null);
    setDisableError(true);
  };

  return { datas, error, fetchData, cancelModal };
};

export default useFetchData;
