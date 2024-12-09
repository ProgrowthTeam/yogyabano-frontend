import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
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
import Image from "next/image";
import YogyabanoLogo from "../../../public/assets/logo.png"; // Updated to PNG

interface SidebarItem {
  icon: React.ReactElement;
  name: string;
  path: string;
  subItems?: SidebarItem[];
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

const StyledYogyabanoLogo = styled(Box)(() => ({
  padding: "40px 10px 0 10px",
}));

const StyledTagline = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.blueBayoux,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: "14px",
  maxWidth: "256px",
  marginBottom: "40px",
  marginLeft: "10px",
}));

const StyledListItem = styled(ListItem)<{ active: boolean }>(({ active }) => ({
  display: "flex",
  justifyContent: "left",
  backgroundColor: active ? "#FFEAD9" : "inherit",
  color: active ? "#FF7500" : "inherit",
  "& .MuiListItemIcon-root": {
    color: active ? "#FF7500" : "inherit",
  },
}));

const StyledSubItemText = styled(ListItemText)<{ active: boolean }>(
  ({ active }) => ({
    color: active ? "#FF7500" : "inherit",
  })
);

const ListItemContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  height: "100%",
  alignItems: "start",
}));

const SubItemContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "left",
  justifyContent: "left",
  marginLeft: "75px",
  borderLeft: "1px solid rgba(79, 109, 122, 0.2)",
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

const Sidebar: React.FC<SidebarProps> = ({
  topItems,
  bottomItems,
  onItemClick,
}) => {
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
      <StyledYogyabanoLogo>
        {" "}
        <Image
          src={YogyabanoLogo}
          alt="Yogyabano Logo"
          width={256}
          height={38}
        />
      </StyledYogyabanoLogo>
      <StyledTagline>
        AI Assisted Skilling Platform for Frontline Workers
      </StyledTagline>
      <ListItemContainer>
        <List sx={{ width: "100%" }}>
          {topItems.map((item, index) => (
            <React.Fragment key={index}>
              <Link href={item.path} passHref>
                <StyledListItem
                  active={activeItem === item.path}
                  onClick={() => handleItemClick(item)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </StyledListItem>
              </Link>
              {item.subItems &&
                item.subItems.map((subItem, subIndex) => (
                  <SubItemContainer key={subIndex}>
                    <Link href={subItem.path} passHref>
                      <StyledSubItemText
                        active={activeItem === subItem.path}
                        onClick={() => handleItemClick(subItem)}
                        sx={{ pl: 4 }}
                      >
                        {subItem.name}
                      </StyledSubItemText>
                    </Link>
                  </SubItemContainer>
                ))}
            </React.Fragment>
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
