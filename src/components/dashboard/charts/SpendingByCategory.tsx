import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface SpendingByCategoryProps {
  data?: CategoryData[];
  title?: string;
  period?: string;
}

const defaultData: CategoryData[] = [
  { name: "Food & Dining", value: 450, color: "#FF6384" },
  { name: "Housing", value: 1200, color: "#36A2EB" },
  { name: "Transportation", value: 300, color: "#FFCE56" },
  { name: "Entertainment", value: 200, color: "#4BC0C0" },
  { name: "Shopping", value: 350, color: "#9966FF" },
  { name: "Other", value: 180, color: "#FF9F40" },
];

const SpendingByCategory = ({
  data = defaultData,
  title = "Spending by Category",
  period = "May 2023",
}: SpendingByCategoryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryData | null>(
    null,
  );

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    setHoveredCategory(data[index]);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
    setHoveredCategory(null);
  };

  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Breakdown of your spending by category for {period}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                    as={motion.path}
                    animate={{
                      scale: activeIndex === index ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-md shadow-md p-2 text-sm">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-muted-foreground">
                          ${data.value.toLocaleString()} (
                          {((data.value / totalSpending) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {hoveredCategory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 text-center"
          >
            <p className="text-lg font-medium">{hoveredCategory.name}</p>
            <p className="text-2xl font-bold">
              ${hoveredCategory.value.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {((hoveredCategory.value / totalSpending) * 100).toFixed(1)}% of
              total
            </p>
          </motion.div>
        )}

        {!hoveredCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Hover over segments for details
            </p>
            <p className="text-lg font-medium mt-1">Total Spending</p>
            <p className="text-2xl font-bold">
              ${totalSpending.toLocaleString()}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingByCategory;
