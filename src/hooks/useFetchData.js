import React, {useState, useEffect} from 'react';

const useFetchData = () => {
  const throttle = (func, duration) => {
    var lasttime = new Date();
    return text => {
      if (lasttime > new Date() + duration * 1000) {
        func(text);
        lasttime = new Date();
      }
    };
  };

  const number_of_games = 50;

  const [datas, setDatas] = useState([]);
  const [error, setError] = useState(null);
  const [disableError, setDisableError] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleError = throttle(text => {
    setError(text), 60;
  });

  const fetchData = async () => {
    try {
      const response_lastItem = await fetch(
        'https://api-info-nsw.keno.com.au/v2/games/kds?jurisdiction=NSW',
      );
      if (!response_lastItem.ok) {
        throw new Error(`HTTP error! status: ${response_lastItem.status}`);
      }

      const lastResult = await response_lastItem.json();
      const time2NextDraw = Math.abs(
        new Date(lastResult?.selling?.closing) - new Date(),
      );

      let succedTofetchCurrentData =
        lastResult?.current?.draw?.length === 20 && time2NextDraw > 5000;

      let timeoutDuration = succedTofetchCurrentData
        ? time2NextDraw - 3000
        : 1000;

      if (succedTofetchCurrentData) {
        const currentNumber = parseInt(lastResult?.current['game-number']);
        const localTime = new Date();
        const nswOffset =
          -(
            2+ (localTime.getMonth() > 3 && localTime.getMonth() < 9 ? 1 : 0)
          ) * 60;
        const nswTimeMs =
          localTime.getTime() -
          (nswOffset - localTime.getTimezoneOffset()) * 60000;
        const nswDate = new Date(nswTimeMs);
        const year = String(nswDate.getFullYear());
        const month = String(nswDate.getMonth() + 1).padStart(2, '0');
        const day = String(nswDate.getDate()).padStart(2, '0');
        
        if (datas.length < number_of_games) {
          const fetchHistoryUrl = `https://api-info-nsw.keno.com.au/v2/info/history?jurisdiction=NSW&starting_game_number=${
            currentNumber - number_of_games + 1
          }&number_of_games=${number_of_games}&date=${year}-${month}-${day}&page_size=${number_of_games}&page_number=1`;
          const history_response = await fetch(fetchHistoryUrl);

          if (!history_response.ok) {
            throw new Error(`HTTP error! status: ${history_response.status}`);
          }
      // console.log(fetchHistoryUrl)
          const json2 = await history_response.json();

          if (json2.items?.length === number_of_games) {
            setDatas(
              [...json2.items].sort(
                (a, b) => b['game-number'] - a['game-number'],
              ),
            );
            // console.log(json2.items.length)
            setDisableError(false);
            setError(null);
          } else {
            throw new Error('History Fetch error');
          }
        }
      } else {
        throw new Error('Live Draw Fetch error');
      }

      if (timeoutId) clearTimeout(timeoutId);

      const newTimeoutId = setTimeout(fetchData, timeoutDuration);
      setTimeoutId(newTimeoutId);
    } catch (error) {
      if (!disableError) handleError(new Error(error).message);
      const newTimeoutId = setTimeout(fetchData, 1000);
      setTimeoutId(newTimeoutId);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const cancelModal = () => {
    setError(null);
    setDisableError(true);
  };

  return {datas, error, fetchData, cancelModal};
};

export default useFetchData;
