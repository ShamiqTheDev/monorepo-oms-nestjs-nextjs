"use client";

interface GreetProps {}

function greetUser(hour: number): string {
  if (hour >= 0 && hour < 12) {
    return "Good Morning!";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon!";
  } else if (hour >= 17 && hour <= 23) {
    return "Good Evening!";
  } else {
    return "Hello!";
  }
}

export default function Greet({}: GreetProps) {
  return greetUser(new Date().getHours());
}
