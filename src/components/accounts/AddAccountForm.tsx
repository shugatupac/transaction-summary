import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, PiggyBank, Wallet, TrendingUp, X } from "lucide-react";

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

interface AddAccountFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddAccount?: (account: any) => void;
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({
  open = true,
  onOpenChange = () => {},
  onAddAccount = () => {},
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "checking",
    balance: "",
    currency: "USD",
    accountNumber: "",
    institution: "",
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

    // Create a new account object
    const newAccount = {
      id: `acc-${Date.now()}`,
      ...formData,
      balance: parseFloat(formData.balance) || 0,
      accountNumber:
        formData.accountNumber ||
        `****${Math.floor(1000 + Math.random() * 9000)}`,
      color: getColorForAccountType(formData.type),
      lastTransaction: null,
    };

    onAddAccount(newAccount);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: "",
      type: "checking",
      balance: "",
      currency: "USD",
      accountNumber: "",
      institution: "",
    });
  };

  const getColorForAccountType = (type: string) => {
    switch (type) {
      case "checking":
        return "#3b82f6";
      case "savings":
        return "#10b981";
      case "credit":
        return "#f43f5e";
      case "investment":
        return "#8b5cf6";
      default:
        return "#3b82f6";
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-5 w-5" />;
      case "savings":
        return <PiggyBank className="h-5 w-5" />;
      case "credit":
        return <Wallet className="h-5 w-5" />;
      case "investment":
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Enter your account details to add it to your dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Main Checking"
                required
              />
            </div>

            <div className="col-span-4">
              <Label htmlFor="institution">Financial Institution</Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="e.g. Chase Bank"
                required
              />
            </div>

            <div className="col-span-4">
              <Label htmlFor="type">Account Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-4">
              <Label htmlFor="balance">Current Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  $
                </span>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.balance}
                  onChange={handleInputChange}
                  className="pl-6"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="col-span-4">
              <Label htmlFor="accountNumber">
                Account Number (Last 4 digits)
              </Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="e.g. 1234"
                maxLength={4}
                pattern="[0-9]{4}"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only enter the last 4 digits for security
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountForm;
