"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

export default function AppDrawer({ isOpen, toggleDrawer }: DrawerProps) {
  const router = useRouter();

  const menuItems = [
    { text: "Main", icon: <HomeIcon />, path: "/Main" },
    { text: "Management", icon: <SettingsIcon />, path: "/Management" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    toggleDrawer();
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
