import React, { useState } from "react";
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface AddBudgetFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddBudget?: (budget: any) => void;
  month?: string;
}

const categories = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Housing",
  "Bills & Utilities",
  "Health & Fitness",
  "Travel",
  "Education",
  "Personal Care",
  "Gifts & Donations",
  "Other",
];

const AddBudgetForm: React.FC<AddBudgetFormProps> = ({
  open = false,
  onOpenChange = () => {},
  onAddBudget = () => {},
  month = "May 2023",
}) => {
  const [formData, setFormData] = useState({
    category: "",
    allocated: "",
    spent: "0",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allocated = parseFloat(formData.allocated) || 0;
    const spent = parseFloat(formData.spent) || 0;
    const remaining = allocated - spent;

    // Determine status based on spending
    let status = "on-track";
    if (spent > allocated) {
      status = "over-budget";
    } else if (spent / allocated > 0.9) {
      status = "warning";
    }

    // Create a new budget object
    const newBudget = {
      id: `budget-${Date.now()}`,
      name: formData.category,
      allocated,
      spent,
      remaining,
      status,
      month,
    };

    onAddBudget(newBudget);
    onOpenChange(false);

    // Reset form
    setFormData({
      category: "",
      allocated: "",
      spent: "0",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Budget</DialogTitle>
          <DialogDescription>
            Create a budget category for {month}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="allocated">Budget Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  $
                </span>
                <Input
                  id="allocated"
                  name="allocated"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.allocated}
                  onChange={handleInputChange}
                  className="pl-6"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                How much do you want to allocate for this category?
              </p>
            </div>

            <div>
              <Label htmlFor="spent">Current Spending (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  $
                </span>
                <Input
                  id="spent"
                  name="spent"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.spent}
                  onChange={handleInputChange}
                  className="pl-6"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                If you've already spent money in this category this month
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Budget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetForm;
