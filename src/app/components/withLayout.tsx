import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar"; // Import Navbar
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
  subItems?: ActiveItem[];
}

const defaultIcon: ActiveItem = {
  icon: <GridView />,
  name: "Dashboard",
  path: "/dashboard",
};

const topItems: ActiveItem[] = [
  { icon: <GridView />, name: "Dashboard", path: "/dashboard" },
  {
    icon: <Dvr />,
    name: "Create Course",
    path: "/create-course",
    subItems: [
      {
        icon: <></>,
        name: "New Course",
        path: "/create-course/new-course",
      },
    ],
  },
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
  const WrappedComponent = (props: any) => {
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState<ActiveItem>(defaultIcon);

    useEffect(() => {
      const allItems = [...topItems, ...bottomItems];
      const findActiveItem = (items: ActiveItem[]): ActiveItem | undefined => {
        for (const item of items) {
          if (item.path === pathname) {
            return item;
          }
          if (item.subItems) {
            const subItem = findActiveItem(item.subItems);
            if (subItem) {
              return subItem;
            }
          }
        }
        return undefined;
      };
      const currentItem = findActiveItem(allItems) || defaultIcon;
      setActiveItem(currentItem);
    }, [pathname]);

    const handleSidebarItemClick = (item: ActiveItem) => {
      setActiveItem(item);
    };

    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ width: "275px", height: "100%" }}>
          <Sidebar
            topItems={topItems}
            bottomItems={bottomItems}
            onItemClick={handleSidebarItemClick}
          />
        </div>
        <div style={{ flexGrow: 1, height: "100%" }}>
          <Navbar activeItem={activeItem} />
          <Component {...props} />
        </div>
      </div>
    );
  };

  WrappedComponent.displayName = `withLayout(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
};

export default withLayout;
