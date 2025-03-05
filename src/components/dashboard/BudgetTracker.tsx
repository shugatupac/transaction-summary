import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: "on-track" | "warning" | "over-budget";
}

interface BudgetTrackerProps {
  categories?: BudgetCategory[];
  month?: string;
  totalBudget?: number;
  totalSpent?: number;
}

const defaultCategories: BudgetCategory[] = [
  {
    id: "housing",
    name: "Housing",
    allocated: 1500,
    spent: 1450,
    remaining: 50,
    status: "on-track",
  },
  {
    id: "food",
    name: "Food & Dining",
    allocated: 600,
    spent: 580,
    remaining: 20,
    status: "warning",
  },
  {
    id: "transportation",
    name: "Transportation",
    allocated: 400,
    spent: 450,
    remaining: -50,
    status: "over-budget",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    allocated: 300,
    spent: 220,
    remaining: 80,
    status: "on-track",
  },
  {
    id: "shopping",
    name: "Shopping",
    allocated: 400,
    spent: 350,
    remaining: 50,
    status: "on-track",
  },
];

const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  categories = defaultCategories,
  month = "May 2023",
  totalBudget = 3200,
  totalSpent = 3050,
}) => {
  const [view, setView] = useState<"all" | "over-budget" | "on-track">("all");
  const [selectedMonth, setSelectedMonth] = useState(month);

  // Filter categories based on the selected view
  const filteredCategories = categories.filter((category) => {
    if (view === "all") return true;
    return category.status === view;
  });

  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = (totalSpent / totalBudget) * 100;

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-lg font-medium">Budget Tracker</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="May 2023">May 2023</SelectItem>
                <SelectItem value="April 2023">April 2023</SelectItem>
                <SelectItem value="March 2023">March 2023</SelectItem>
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track your spending against your monthly budget</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Budget Summary */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Budget</span>
            <span className="text-sm">
              ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex justify-between items-center text-sm">
            <span
              className={
                totalRemaining >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {totalRemaining >= 0 ? "Remaining: " : "Over budget: "}$
              {Math.abs(totalRemaining).toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {overallProgress.toFixed(0)}% used
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-4">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="over-budget">Over Budget</TabsTrigger>
              <TabsTrigger value="on-track">On Track</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{category.name}</span>
                  {category.status === "over-budget" && (
                    <Badge variant="destructive" className="text-xs">
                      Over Budget
                    </Badge>
                  )}
                  {category.status === "warning" && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      Warning
                    </Badge>
                  )}
                </div>
                <span className="text-sm">
                  ${category.spent.toLocaleString()} of $
                  {category.allocated.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={(category.spent / category.allocated) * 100}
                  className={`h-2 ${category.status === "over-budget" ? "bg-red-100" : category.status === "warning" ? "bg-yellow-100" : "bg-primary/20"}`}
                />
                {category.status === "over-budget" && (
                  <div className="absolute right-0 top-0 h-2 w-1 bg-red-600 rounded-r-full" />
                )}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span
                  className={`flex items-center gap-1 ${category.remaining >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {category.remaining >= 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3" />$
                      {category.remaining.toLocaleString()} remaining
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3" />$
                      {Math.abs(category.remaining).toLocaleString()} over
                    </>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {((category.spent / category.allocated) * 100).toFixed(0)}%
                  used
                </span>
              </div>
            </motion.div>
          ))}

          {filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <AlertCircle className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
              <p>
                No {view === "over-budget" ? "over budget" : "on track"}{" "}
                categories found
              </p>
            </motion.div>
          )}

          {/* Add New Budget Category Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <Button variant="outline" className="w-full" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Budget Category
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetTracker;
