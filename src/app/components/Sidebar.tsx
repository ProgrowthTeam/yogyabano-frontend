import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { logout } from "../services/logout";
import { toast } from "react-toastify";

interface SidebarItem {
  icon: React.ReactElement;
  name: string;
  path: string;
}

interface SidebarProps {
  topItems: SidebarItem[];
  bottomItems: SidebarItem[];
  onItemClick: (item: SidebarItem) => void;
}

const DrawerStyled = styled(Drawer)({
  width: 240,
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  "& .MuiDrawer-paper": {
    width: 276,
  },
});

const YogyabanoLogo = styled("div")(({ theme }) => ({
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  marginTop: "40px",
  marginBottom: "10px",
  img: {
    maxWidth: "256px",
  },
}));

const StyledTagline = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.blueBayoux,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: "14px",
  maxWidth: "256px",
  marginBottom: "40px",
  marginLeft: "10px",
}));

const StyledListItem = styled(ListItem)<{ active: boolean }>(
  ({ active }) => ({
    display: "flex",
    justifyContent: "left",
    backgroundColor: active ? "#FFEAD9" : "inherit",
    color: active ? "#FF7500" : "inherit",
    "& .MuiListItemIcon-root": {
      color: active ? "#FF7500" : "inherit",
    },
  })
);

const ListItemContainer = styled(ListItem)(() => ({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  height: "100%",
  alignItems: "start",
}));

const handleLogout = async (item: SidebarItem) => {
  if (item.name === "Logout") {
    const { error } = await logout();
    if (error) {
      toast.error("Error logging out");
    } else {
      sessionStorage.removeItem("user");
    }
  }
};

const Sidebar: React.FC<SidebarProps> = ({ topItems, bottomItems, onItemClick }) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>("");

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.path);
    onItemClick(item);
  };

  return (
    <DrawerStyled variant="permanent">
      <YogyabanoLogo>
        <img src="assets/logo.svg" alt="Logo" />
      </YogyabanoLogo>
      <StyledTagline>
        AI Assisted Skilling Platform for Frontline Workers
      </StyledTagline>
      <ListItemContainer>
        <List sx={{ width: "100%" }}>
          {topItems.map((item, index) => (
            <Link key={index} href={item.path} passHref>
              <StyledListItem
                active={activeItem === item.path}
                onClick={() => handleItemClick(item)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </StyledListItem>
            </Link>
          ))}
        </List>
        <List sx={{ width: "100%" }}>
          <Divider />
          {bottomItems.map((item, index) => (
            <Link key={index} href={item.path} passHref>
              <StyledListItem
                active={activeItem === item.path}
                onClick={() => {
                  handleItemClick(item);
                  handleLogout(item);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </StyledListItem>
            </Link>
          ))}
        </List>
      </ListItemContainer>
    </DrawerStyled>
  );
};

export default Sidebar;