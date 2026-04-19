import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";

interface Props {
  targetDate: string;
  home_style?: boolean;
}

const Countdown: FC<Props> = ({ targetDate, home_style }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date(targetDate).getTime();
    const calculatetTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    const timer = setInterval(calculatetTimeLeft, 1000);

    calculatetTimeLeft();

    return () => clearInterval(timer);
  }, [targetDate]);
  return (
    <div
      className={cn("text-orange-500 leading-4", {
        "text-white": home_style,
      })}
    >
      <div
        className={cn("inline-block text-xs", {
          "text-2xl font-bold": home_style,
        })}
      >
        <span className="mr-1">Ends in:</span>
        <div className="inline-block">
          <span
            className={cn(
              "bg-orange-500 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": home_style,
              },
            )}
          >
            {timeLeft.days.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span
            className={cn(
              "bg-orange-500 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": home_style,
              },
            )}
          >
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span
            className={cn(
              "bg-orange-500 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": home_style,
              },
            )}
          >
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="mx-1">:</span>
          <span
            className={cn(
              "bg-orange-500 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center",
              {
                "p-2 bg-white text-black mr-1": home_style,
              },
            )}
          >
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
