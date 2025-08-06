import { useEffect, useState } from 'react';

interface TimeCounterProps {
  startDate: Date;
}

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const TimeCounter = ({ startDate }: TimeCounterProps) => {
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
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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

  return (
    <div className="bg-card rounded-2xl p-4 shadow-lg border border-border/50">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
        Juntos há:
      </h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">{timeElapsed.years}</div>
          <div className="text-muted-foreground">Anos</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">{timeElapsed.months}</div>
          <div className="text-muted-foreground">Meses</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">{timeElapsed.days}</div>
          <div className="text-muted-foreground">Dias</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">{timeElapsed.hours}</div>
          <div className="text-muted-foreground">Horas</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">{timeElapsed.minutes}</div>
          <div className="text-muted-foreground">Min</div>
        </div>
        <div className="counter-box">
          <div className="text-lg font-bold text-primary">{timeElapsed.seconds}</div>
          <div className="text-muted-foreground">Seg</div>
        </div>
      </div>
    </div>
  );
};