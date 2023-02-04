import React, { useEffect, useState } from 'react';

interface useTimerProps {
  interval: number;
}

interface returnProps {
  countDown: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    date?: Date;
  };
}

const useTimer = ({ interval }: useTimerProps) => {
  const [countDown, setCountDown] = useState({
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    date: new Date(),
  });

  useEffect(() => {
    const countDownInterval = setInterval(() => {
      let currentDate = new Date();
      return setCountDown({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDay(),
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
        second: currentDate.getSeconds(),
        date: currentDate,
      });
    }, interval);

    return function cleanup() {
      clearInterval(countDownInterval);
    };
  }, [interval]);

  return countDown;
};

export default useTimer;
