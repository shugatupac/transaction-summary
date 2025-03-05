import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Edit, Trash2, Check, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

interface FinancialGoalsProps {
  goals?: Goal[];
}

const defaultGoals: Goal[] = [
  {
    id: "g1",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: "2023-12-31",
    color: "#3b82f6",
  },
  {
    id: "g2",
    name: "Vacation",
    targetAmount: 3000,
    currentAmount: 1200,
    deadline: "2023-08-15",
    color: "#10b981",
  },
  {
    id: "g3",
    name: "New Laptop",
    targetAmount: 2000,
    currentAmount: 1800,
    deadline: "2023-07-01",
    color: "#8b5cf6",
  },
];

const FinancialGoals: React.FC<FinancialGoalsProps> = ({
  goals = defaultGoals,
}) => {
  const [userGoals, setUserGoals] = useState<Goal[]>(goals);
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showEditGoalDialog, setShowEditGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  const handleAddGoal = () => {
    const goal: Goal = {
      id: `g-${Date.now()}`,
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount) || 0,
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline,
      color: getRandomColor(),
    };

    setUserGoals([...userGoals, goal]);
    setShowAddGoalDialog(false);
    setNewGoal({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
    });
  };

  const handleEditGoal = () => {
    if (!selectedGoal) return;

    const updatedGoals = userGoals.map((goal) =>
      goal.id === selectedGoal.id ? selectedGoal : goal,
    );

    setUserGoals(updatedGoals);
    setShowEditGoalDialog(false);
    setSelectedGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    setUserGoals(userGoals.filter((goal) => goal.id !== id));
  };

  const getRandomColor = () => {
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#f59e0b"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Financial Goals</CardTitle>
        <Button
          size="sm"
          className="gap-1"
          onClick={() => setShowAddGoalDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No financial goals yet</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1"
                onClick={() => setShowAddGoalDialog(true)}
              >
                <Plus className="h-4 w-4" />
                Add Your First Goal
              </Button>
            </div>
          ) : (
            userGoals.map((goal) => {
              const progress = calculateProgress(
                goal.currentAmount,
                goal.targetAmount,
              );
              const daysRemaining = calculateDaysRemaining(goal.deadline);

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Target: {formatCurrency(goal.targetAmount)} by{" "}
                        {formatDate(goal.deadline)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowEditGoalDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {formatCurrency(goal.currentAmount)} of{" "}
                        {formatCurrency(goal.targetAmount)}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2"
                      style={
                        {
                          backgroundColor: `${goal.color}20`,
                          "--progress-background": goal.color,
                        } as any
                      }
                    />
                    <div className="flex justify-between text-xs">
                      <span
                        className={`${daysRemaining < 0 ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        {daysRemaining < 0
                          ? `${Math.abs(daysRemaining)} days overdue`
                          : `${daysRemaining} days remaining`}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}{" "}
                        to go
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>

      {/* Add Goal Dialog */}
      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Financial Goal</DialogTitle>
            <DialogDescription>
              Set a new financial goal to track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                value={newGoal.name}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, name: e.target.value })
                }
                placeholder="e.g. Emergency Fund"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  $
                </span>
                <Input
                  id="targetAmount"
                  type="number"
                  className="pl-6"
                  value={newGoal.targetAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetAmount: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  $
                </span>
                <Input
                  id="currentAmount"
                  type="number"
                  className="pl-6"
                  value={newGoal.currentAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, currentAmount: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Target Date</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, deadline: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={showEditGoalDialog} onOpenChange={setShowEditGoalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Financial Goal</DialogTitle>
            <DialogDescription>
              Update your financial goal details.
            </DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Goal Name</Label>
                <Input
                  id="edit-name"
                  value={selectedGoal.name}
                  onChange={(e) =>
                    setSelectedGoal({
                      ...selectedGoal,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-targetAmount">Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="edit-targetAmount"
                    type="number"
                    className="pl-6"
                    value={selectedGoal.targetAmount}
                    onChange={(e) =>
                      setSelectedGoal({
                        ...selectedGoal,
                        targetAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-currentAmount">Current Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="edit-currentAmount"
                    type="number"
                    className="pl-6"
                    value={selectedGoal.currentAmount}
                    onChange={(e) =>
                      setSelectedGoal({
                        ...selectedGoal,
                        currentAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-deadline">Target Date</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={selectedGoal.deadline}
                  onChange={(e) =>
                    setSelectedGoal({
                      ...selectedGoal,
                      deadline: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FinancialGoals;
