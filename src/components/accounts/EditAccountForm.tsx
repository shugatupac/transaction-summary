import React, { useState, useEffect } from "react";
import { CreditCard, PiggyBank, Wallet, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
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

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  currency: string;
  accountNumber: string;
  institution: string;
  color?: string;
}

interface EditAccountFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  account?: Account | null;
  onSaveAccount?: (account: Account) => void;
}

const EditAccountForm: React.FC<EditAccountFormProps> = ({
  open = false,
  onOpenChange = () => {},
  account = null,
  onSaveAccount = () => {},
}) => {
  const [formData, setFormData] = useState<Partial<Account>>({
    name: "",
    balance: 0,
    institution: "",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        balance: account.balance,
        institution: account.institution,
      });
    }
  }, [account]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const updatedAccount = {
      ...account,
      ...formData,
    };

    onSaveAccount(updatedAccount);
    onOpenChange(false);
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Update your account details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div>
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

            <div>
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

            <div>
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
              <p className="text-xs text-muted-foreground mt-1">
                Update your current balance manually
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountForm;
