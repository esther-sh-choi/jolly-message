import React, { useState, useEffect } from 'react';

import useTimer from '../../hooks/useTimer';

import styles from './Countdown.module.scss';

interface countdownProps {
  openingDate: Date;
  className?: string;
  onTimeout: (params: any) => any;
  spacing?: string;
}

const Countdown: React.FC<countdownProps> = ({
  openingDate,
  className,
  onTimeout,
  spacing = '5px',
}) => {
  const { year, month, day, hour, minute, second, date } = useTimer({
    interval: 1000,
  });

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: '',
    minutes: '',
    seconds: '',
  });

  const openingDateTime = openingDate.getTime();
  let currentDate = new Date().getTime();

  const addZero = (num: number, totalLength: number) => {
    return String(num).padStart(totalLength, '0');
  };

  useEffect(() => {
    const timeRemaining = openingDateTime - currentDate;
    if (timeRemaining > 1000 * 60 * 60 * 24) {
      setCountdown({
        ...countdown,
        days: Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)),
        hours: addZero(
          Math.floor(
            (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          2
        ),
        minutes: addZero(
          Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
          2
        ),
        seconds: addZero(Math.floor((timeRemaining % (1000 * 60)) / 1000), 2),
      });
    } else if (timeRemaining <= 1000 * 60 * 60 * 24 && timeRemaining >= 0) {
      setCountdown({
        days: 0,
        hours: addZero(Math.floor(timeRemaining / (1000 * 60 * 60)), 2),
        minutes: addZero(
          Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
          2
        ),
        seconds: addZero(Math.floor((timeRemaining % (1000 * 60)) / 1000), 2),
      });
    }
    if (timeRemaining <= 0) {
      onTimeout(true);
    }
  }, [day, hour, minute, second]);

  const format = {
    day: (
      <div className={styles.countdownContainer}>
        <section className={styles.timeContainer} id='days'>
          <h2>{countdown.days}</h2>
          <p className={styles.timeLabel}>days</p>
        </section>
        <p style={{ fontSize: '20px', padding: `0 ${spacing}` }}>:</p>
        <section className={styles.timeContainer} id='hours'>
          <h2>{countdown.hours}</h2>
          <p className={styles.timeLabel}>hrs</p>
        </section>
        <p style={{ fontSize: '20px', padding: `0 ${spacing}` }}>:</p>
        <section className={styles.timeContainer} id='minutes'>
          <h2>{countdown.minutes}</h2>
          <p className={styles.timeLabel}>min</p>
        </section>
      </div>
    ),
    hour: (
      <div className={styles.countdownContainer}>
        <section className={styles.timeContainer} id='hours'>
          <h2>{countdown.hours}</h2>
          <p className={styles.timeLabel}>hrs</p>
        </section>
        <p style={{ fontSize: '20px', padding: `0 ${spacing}` }}>:</p>
        <section className={styles.timeContainer} id='minutes'>
          <h2>{countdown.minutes}</h2>
          <p className={styles.timeLabel}>min</p>
        </section>
        <p style={{ fontSize: '20px', padding: `0 ${spacing}` }}>:</p>
        <section className={styles.timeContainer} id='seconds'>
          <h2>{countdown.seconds}</h2>
          <p className={styles.timeLabel}>sec</p>
        </section>
      </div>
    ),
  };

  const renderRemainingTime = () => {
    if (countdown.days > 0) {
      return format.day;
    } else {
      return format.hour;
    }
  };

  return <div className={className}>{renderRemainingTime()}</div>;
};

export default Countdown;
