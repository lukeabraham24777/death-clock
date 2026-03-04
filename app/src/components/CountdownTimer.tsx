import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface Props {
  targetDate: string;
}

interface TimeLeft {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Live countdown timer that updates every second
export default function CountdownTimer({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <TimeUnit value={timeLeft.years} label="YEARS" />
      <Text style={styles.separator}>:</Text>
      <TimeUnit value={timeLeft.days} label="DAYS" />
      <Text style={styles.separator}>:</Text>
      <TimeUnit value={timeLeft.hours} label="HRS" />
      <Text style={styles.separator}>:</Text>
      <TimeUnit value={timeLeft.minutes} label="MIN" />
      <Text style={styles.separator}>:</Text>
      <TimeUnit value={timeLeft.seconds} label="SEC" />
    </View>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.value}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const years = Math.floor(totalDays / 365.25);
  const remainingDays = Math.floor(totalDays - years * 365.25);

  return {
    years,
    days: remainingDays,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unit: {
    alignItems: 'center',
    minWidth: 48,
  },
  value: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 9,
    color: theme.colors.textDim,
    letterSpacing: 1,
    marginTop: 2,
  },
  separator: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    fontWeight: '300',
    marginHorizontal: 2,
    marginBottom: 14, // Align with numbers, not labels
  },
});
