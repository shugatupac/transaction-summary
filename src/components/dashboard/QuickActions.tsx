import React from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PiggyBank,
  BarChart,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  onAddTransaction?: () => void;
  onAddAccount?: () => void;
  onAddBudget?: () => void;
  onAddGoal?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddTransaction = () => {},
  onAddAccount = () => {},
  onAddBudget = () => {},
  onAddGoal = () => {},
  actions,
}) => {
  const defaultActions: QuickAction[] = [
    {
      id: "add-transaction",
      title: "Add Transaction",
      description: "Record a new expense or income",
      icon: <PlusCircle className="h-5 w-5" />,
      color: "#3b82f6",
      onClick: onAddTransaction,
    },
    {
      id: "add-account",
      title: "Add Account",
      description: "Connect a new bank account",
      icon: <CreditCard className="h-5 w-5" />,
      color: "#10b981",
      onClick: onAddAccount,
    },
    {
      id: "add-budget",
      title: "Create Budget",
      description: "Set up a new spending budget",
      icon: <Wallet className="h-5 w-5" />,
      color: "#f59e0b",
      onClick: onAddBudget,
    },
    {
      id: "add-goal",
      title: "Set Financial Goal",
      description: "Create a new savings goal",
      icon: <PiggyBank className="h-5 w-5" />,
      color: "#8b5cf6",
      onClick: onAddGoal,
    },
  ];

  const quickActions = actions || defaultActions;

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={action.onClick}
            >
              <div className="border rounded-lg p-4 h-full hover:border-primary/50 hover:shadow-sm transition-all">
                <div
                  className="p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <div style={{ color: action.color }}>{action.icon}</div>
                </div>
                <h3 className="font-medium mb-1">{action.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
