import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Popover,
} from "@mui/material";
import {
  AccountCircle,
  ContentPaste,
  Dvr,
  GridView,
  Logout,
  Slideshow,
  Notifications,
  NotificationsNone,
  ArrowBackIosNew,
} from "@mui/icons-material";

interface ActiveItem {
  icon: JSX.Element;
  name: string;
  path: string;
  subItems?: ActiveItem[];
}

interface NavbarProps {
  activeItem: ActiveItem;
}

const Navbar: React.FC<NavbarProps> = ({ activeItem }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setNotificationsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setNotificationsOpen(false);
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    router.push("/create-course");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorEl && !anchorEl.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [anchorEl]);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #B9C5CA" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {activeItem.path.startsWith("/create-course/") && (
            <IconButton color="inherit" onClick={handleBackClick}>
              <ArrowBackIosNew />
            </IconButton>
          )}
          {activeItem.icon}
          <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 2 }}>
            {activeItem.name}
          </Typography>
        </div>
        <IconButton color="inherit" onClick={handleNotificationsClick}>
          {notificationsOpen ? <Notifications /> : <NotificationsNone />}
        </IconButton>
        <Popover
          open={notificationsOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Typography sx={{ p: 2 }}>Notifications</Typography>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;