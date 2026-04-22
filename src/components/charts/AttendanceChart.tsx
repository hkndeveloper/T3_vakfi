"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AttendanceChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full bg-slate-50/50 animate-pulse rounded-2xl border border-slate-100" />
    );
  }

  return (
    <div className="h-full w-full font-source-sans min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "currentColor", fontSize: 10, fontWeight: 700 }}
            className="text-slate-400 dark:text-slate-600"
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "currentColor", fontSize: 10, fontWeight: 700 }}
            className="text-slate-400 dark:text-slate-600"
          />
          <Tooltip 
            cursor={{ fill: "rgba(37, 99, 235, 0.05)" }}
            contentStyle={{ 
              backgroundColor: "white",
              borderRadius: "12px", 
              border: "1px solid #e2e8f0", 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              padding: "12px"
            }}
            itemStyle={{
              color: "#0f172a",
              fontSize: "12px",
              fontWeight: "900"
            }}
            labelStyle={{
              color: "#64748b",
              fontSize: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px"
            }}
          />
          <Bar 
            dataKey="value" 
            fill="url(#barGradient)" 
            radius={[6, 6, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
