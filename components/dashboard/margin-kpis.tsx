"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarginKpis } from "@/types/analytics";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

interface MarginKpisProps {
  kpis: MarginKpis;
}

interface SparkPoint {
  x: number;
  value: number;
}

function buildSparkline(seed: number): SparkPoint[] {
  const safeSeed = Math.max(seed, 1);
  const factors = [0.85, 0.93, 0.9, 1.01, 0.96, 1.08, 1.02, 1.12];

  return factors.map((factor, index) => ({
    x: index,
    value: Math.max(safeSeed * factor, 0)
  }));
}

export function MarginKpisCards({ kpis }: MarginKpisProps): JSX.Element {
  const items = [
    {
      title: "Marge moyenne (C05b)",
      value: formatCurrency(kpis.average),
      icon: Coins,
      tone: "from-blue-500/20 to-cyan-400/10",
      sparkColor: "#2563eb",
      sparkData: buildSparkline(kpis.average)
    },
    {
      title: "Marge minimale",
      value: formatCurrency(kpis.min),
      icon: TrendingDown,
      tone: "from-teal-500/20 to-emerald-400/10",
      sparkColor: "#0f766e",
      sparkData: buildSparkline(kpis.min)
    },
    {
      title: "Marge maximale",
      value: formatCurrency(kpis.max),
      icon: TrendingUp,
      tone: "from-indigo-500/20 to-sky-400/10",
      sparkColor: "#4f46e5",
      sparkData: buildSparkline(kpis.max)
    },
    {
      title: "Lignes analytiques",
      value: formatNumber(kpis.totalRows),
      icon: Coins,
      tone: "from-violet-500/20 to-blue-400/10",
      sparkColor: "#7c3aed",
      sparkData: buildSparkline(kpis.totalRows)
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.05 }}
        >
          <Card className="relative overflow-hidden">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.tone}`} />
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                {item.title}
                <span className="rounded-full bg-white/80 p-2">
                  <item.icon className="h-4 w-4 text-accent" />
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <p className="text-3xl font-semibold tracking-tight text-foreground">{item.value}</p>
              <div className="h-14 rounded-xl bg-white/55 p-1 dark:bg-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.sparkData}>
                    <defs>
                      <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={item.sparkColor} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={item.sparkColor} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={item.sparkColor}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#spark-${index})`}
                      dot={false}
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
