"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupedSeriesItem } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils/format";

interface UnitCostChartProps {
  data: GroupedSeriesItem[];
}

export function UnitCostChart({ data }: UnitCostChartProps): JSX.Element {
  const chartData = data.slice(0, 10);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-foreground">Couts moyens par unite de mesure</CardTitle>
          <CardDescription>Top 10 unites. Association montant commande / produits repetes.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 12, left: -4, bottom: 24 }}>
              <defs>
                <linearGradient id="unitBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d7deec" />
              <XAxis
                dataKey="key"
                tickLine={false}
                axisLine={false}
                angle={-14}
                textAnchor="end"
                interval={0}
                height={60}
                tick={{ fontSize: 12, fill: "#475569" }}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #d9e2f0",
                  background: "rgba(255,255,255,0.96)",
                  boxShadow: "0 18px 35px -26px rgba(30,50,120,0.45)"
                }}
              />
              <Bar dataKey="average" radius={[10, 10, 0, 0]} fill="url(#unitBar)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
