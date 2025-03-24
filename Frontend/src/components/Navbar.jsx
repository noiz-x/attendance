// Frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu as MenuIcon, X as XIcon, Bell } from "lucide-react"; // using lucide-react for icons
import AccountService from "../services/accountService";

// Import shadcn UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const backendResponse = {
  courses: "http://127.0.0.1:8000/courses/",
  lectures: "http://127.0.0.1:8000/lectures/",
  registrations: "http://127.0.0.1:8000/registrations/",
  attendance: "http://127.0.0.1:8000/attendance/",
};

const navigation = Object.entries(backendResponse).map(([key, url]) => {
  // Parse the URL and remove any trailing slash from the pathname
  const path = new URL(url).pathname.replace(/\/$/, "");
  // Capitalize the key for a nicer display name
  const name = key.charAt(0).toUpperCase() + key.slice(1);
  return { name, href: path };
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // Only show Navbar if a token exists.
  if (!token) return null;

  // State for user details.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details on mount.
  useEffect(() => {
    AccountService.getUser()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user details", err);
        setLoading(false);
      });
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <header className="bg-gray-100 mb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu using Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="sm:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:hidden">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo and Desktop Navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/">
              <img
                className="block h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </Link>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    "rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side: Notifications & Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="p-1">
              <Bell className="h-6 w-6 text-gray-600" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User Avatar"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white w-48">
                <DropdownMenuItem asChild>
                  <Link to="/accounts/user/" className="flex items-center">
                    {loading
                      ? "Loading..."
                      : user
                      ? user.username
                      : "Your Profile"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black"/>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black"/>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
