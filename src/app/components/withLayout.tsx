import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import Sidebar from "../components/Sidebar";
import { AppBar, Toolbar, Typography } from "@mui/material";
import {
  AccountCircle,
  ContentPaste,
  Dvr,
  GridView,
  Logout,
  Slideshow,
} from "@mui/icons-material";

interface ActiveItem {
  icon: JSX.Element;
  name: string;
  path: string;
}

interface NavbarProps {
  activeItem: ActiveItem;
}

const Navbar: React.FC<NavbarProps> = ({ activeItem }) => (
  <AppBar
    position="static"
    color="transparent"
    elevation={0}
    sx={{ borderBottom: "1px solid #B9C5CA" }}
  >
    <Toolbar>
      {activeItem.icon}
      <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 2 }}>
        {activeItem.name}
      </Typography>
    </Toolbar>
  </AppBar>
);

const defaultIcon: ActiveItem = {
  icon: <GridView />,
  name: "Dashboard",
  path: "/dashboard",
};

const topItems: ActiveItem[] = [
  { icon: <GridView />, name: "Dashboard", path: "/dashboard" },
  { icon: <Dvr />, name: "Create Course", path: "/create-course" },
  {
    icon: <ContentPaste />,
    name: "Create Evaluation",
    path: "/create-evaluation",
  },
  { icon: <Slideshow />, name: "Create Video", path: "/create-video" },
];

const bottomItems: ActiveItem[] = [
  { icon: <AccountCircle />, name: "Profile", path: "/profile" },
  { icon: <Logout />, name: "Logout", path: "/" },
];

const withLayout = (Component: React.ComponentType) => {
  return (props: any) => {
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState<ActiveItem>(defaultIcon);

    useEffect(() => {
      const allItems = [...topItems, ...bottomItems];
      const currentItem =
        allItems.find((item) => item.path === pathname) || defaultIcon;
      setActiveItem(currentItem);
    }, [pathname]);

    const handleSidebarItemClick = (item: ActiveItem) => {
      setActiveItem(item);
    };

    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "275px" }}>
          <Sidebar
            topItems={topItems}
            bottomItems={bottomItems}
            onItemClick={handleSidebarItemClick}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          <Navbar activeItem={activeItem} />
          <Component {...props} />
        </div>
      </div>
    );
  };
};

export default withLayout;
