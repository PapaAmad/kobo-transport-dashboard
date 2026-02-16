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
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Couts moyens par unite de mesure</CardTitle>
          <CardDescription>Association du montant de commande aux produits repetes</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbe3ee" />
              <XAxis
                dataKey="key"
                tickLine={false}
                axisLine={false}
                angle={-14}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="average" radius={[10, 10, 0, 0]} fill="#1d4ed8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
