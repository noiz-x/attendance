// Frontend/src/components/Navbar.jsx

"use client";

import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Menu as MenuIcon, Bell, Terminal } from "lucide-react";
import AccountService from "../services/accountService";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const backendResponse = {
  courses: "http://127.0.0.1:8000/courses/",
  lectures: "http://127.0.0.1:8000/lectures/",
  registrations: "http://127.0.0.1:8000/registrations/",
  attendance: "http://127.0.0.1:8000/attendance/",
};

const navigation = Object.entries(backendResponse).map(([key, url]) => {
  const path = new URL(url).pathname.replace(/\/$/, "");
  const name = key.charAt(0).toUpperCase() + key.slice(1);
  return { name, href: path };
});

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // Only show Navbar if a token exists.
  if (!token) return null;

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
          {/* Mobile Navigation using NavigationMenu */}
          <NavigationMenu className="sm:hidden">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <MenuIcon className="h-6 w-6" />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid gap-2 p-4">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-200 "
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Logo and Desktop Navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/">
              <img
                className="block h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </Link>
            <NavigationMenu className="hidden sm:block ml-6">
              <NavigationMenuList className="flex space-x-4">
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.name}
                      </Link>
                      {/* <DropdownMenuSeparator/> */}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side: Notifications & Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer p-1">
                <Bell className="h-6 w-6 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white w-[70%] md:w-full mx-auto">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the CLI.
                </AlertDescription>
              </Alert>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
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
              <DropdownMenuSeparator className="bg-black" />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black" />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
