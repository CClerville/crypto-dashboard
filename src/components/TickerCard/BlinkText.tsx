"use client";

import { useEffect, useState } from "react";

import styles from "./BlinkText.module.css";

let timeoutId: number;

type BlinkTextProps = {
  text: string;
  data: string | number | Object;
};

const BlinkText = ({ text, data }: BlinkTextProps) => {
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  useEffect(() => {
    setIsBlinking(true);
    new Promise((resolve, reject) => {
      timeoutId = setTimeout(resolve, 1000) as unknown as number;
    }).finally(() => {
      setIsBlinking(false);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [data]);

  return (
    <>{text && <div className={isBlinking ? styles.blink : ""}>{text}</div>}</>
  );
};

export default BlinkText;
