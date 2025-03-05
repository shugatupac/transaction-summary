import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Menu,
  Search,
  User,
  X,
  ChevronDown,
  LogOut,
  Settings,
  CreditCard,
  BarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

const Header = ({
  userName = "Jane Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  notificationCount = 3,
  onNotificationClick = () => {},
  onProfileClick = () => {},
  onLogout = () => {},
}: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full h-[72px] bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo and Mobile Menu */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col h-full">
              <div className="py-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-bold text-xl"
                >
                  <CreditCard className="h-6 w-6 text-primary" />
                  <span>FinTrack</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-1">
                <SheetClose asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/accounts"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Accounts</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/transactions"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Transactions</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/budgets"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Budgets</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SheetClose>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">FinTrack</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        <Link
          to="/"
          className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
        >
          Dashboard
        </Link>
        <Link
          to="/accounts"
          className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
        >
          Accounts
        </Link>
        <Link
          to="/transactions"
          className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
        >
          Transactions
        </Link>
        <Link
          to="/budgets"
          className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
        >
          Budgets
        </Link>
      </nav>

      {/* Search and User Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Search */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span className="sr-only">Search</span>
          </Button>

          {isSearchOpen && (
            <motion.div
              className="absolute right-0 top-full mt-2 w-[300px] bg-white rounded-md shadow-lg p-2 border border-gray-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search transactions, accounts..."
                  className="flex-1 h-9"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={onNotificationClick}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {notificationCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline font-medium">{userName}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onProfileClick}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
