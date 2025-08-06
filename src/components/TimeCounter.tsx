import { useEffect, useState } from "react";

interface TimeCounterProps {
  startDate: Date;
  compact?: boolean;
}

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const TimeCounter = ({
  startDate,
  compact = false,
}: TimeCounterProps) => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      if (diff < 0) return;

      // Calculate years, months, days, hours, minutes, seconds
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
      );
      const days = Math.floor(
        (diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ years, months, days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeElapsed();

    // Update every second
    const interval = setInterval(calculateTimeElapsed, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  if (compact) {
    // Versão compacta horizontal - como na primeira imagem
    return (
      <div className="flex justify-center gap-2 overflow-x-auto">
        <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-3 min-w-[70px] text-center shadow-lg">
          <div className="text-xl font-bold text-white">
            {timeElapsed.years.toString().padStart(2, "0")}
          </div>
          <div className="text-pink-200 text-xs font-medium">Anos</div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-3 min-w-[70px] text-center shadow-lg">
          <div className="text-xl font-bold text-white">
            {timeElapsed.months.toString().padStart(2, "0")}
          </div>
          <div className="text-pink-200 text-xs font-medium">Meses</div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-3 min-w-[70px] text-center shadow-lg">
          <div className="text-xl font-bold text-white">
            {timeElapsed.days.toString().padStart(2, "0")}
          </div>
          <div className="text-pink-200 text-xs font-medium">Dias</div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-3 min-w-[70px] text-center shadow-lg">
          <div className="text-xl font-bold text-white">
            {timeElapsed.hours.toString().padStart(2, "0")}
          </div>
          <div className="text-pink-200 text-xs font-medium">Horas</div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-3 min-w-[70px] text-center shadow-lg">
          <div className="text-xl font-bold text-white">
            {timeElapsed.minutes.toString().padStart(2, "0")}
          </div>
          <div className="text-pink-200 text-xs font-medium">Min</div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-3 min-w-[70px] text-center shadow-lg">
          <div className="text-xl font-bold text-white">
            {timeElapsed.seconds.toString().padStart(2, "0")}
          </div>
          <div className="text-pink-200 text-xs font-medium">Seg</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg border border-border/50">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">
            {timeElapsed.years}
          </div>
          <div className="text-muted-foreground">Anos</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">
            {timeElapsed.months}
          </div>
          <div className="text-muted-foreground">Meses</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">
            {timeElapsed.days}
          </div>
          <div className="text-muted-foreground">Dias</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">
            {timeElapsed.hours}
          </div>
          <div className="text-muted-foreground">Horas</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">
            {timeElapsed.minutes}
          </div>
          <div className="text-muted-foreground">Min</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">
            {timeElapsed.seconds}
          </div>
          <div className="text-muted-foreground">Seg</div>
        </div>
      </div>
    </div>
  );
};
