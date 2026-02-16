"use client";

import { motion } from "framer-motion";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarginKpis } from "@/types/analytics";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

interface MarginKpisProps {
  kpis: MarginKpis;
}

export function MarginKpisCards({ kpis }: MarginKpisProps): JSX.Element {
  const items = [
    { title: "Marge moyenne (C05b)", value: formatCurrency(kpis.average), icon: Coins },
    { title: "Marge minimale", value: formatCurrency(kpis.min), icon: TrendingDown },
    { title: "Marge maximale", value: formatCurrency(kpis.max), icon: TrendingUp },
    { title: "Lignes analytiques", value: formatNumber(kpis.totalRows), icon: Coins }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.04 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                {item.title}
                <item.icon className="h-4 w-4 text-accent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
