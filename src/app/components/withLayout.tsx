"use client";

import { JSX } from "react";
import Sidebar from "../components/Sidebar";
import { AppBar , Toolbar } from "@mui/material";
import {
  AccountCircle,
  ContentPaste,
  Dvr,
  GridView,
  Logout,
  Slideshow,
} from "@mui/icons-material";

import Typography from '@mui/material/Typography';

const Navbar = () => {
    return (
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Navbar
          </Typography>
        </Toolbar>
      </AppBar>
    );
  };

const withLayout = (Component: React.ComponentType) => {
  return (props: any) => (
    <div style={{ display: "flex" }}>
      <div style={{ width: "275px" }}>
        <Sidebar
          topItems={[
            { icon: <GridView />, name: "Dashboard", path: "/dashboard" },
            { icon: <Dvr />, name: "Create Course", path: "/create-course" },
            {
              icon: <ContentPaste />,
              name: "Create Evaluation",
              path: "/create-evaluation",
            },
            {
              icon: <Slideshow />,
              name: "Create Video",
              path: "/create-video",
            },
          ]}
          bottomItems={[
            { icon: <AccountCircle />, name: "Profile", path: "/profile" },
            { icon: <Logout />, name: "Logout", path: "/" },
          ]}
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        <Navbar />
        <Component {...props} />
      </div>
    </div>
  );
};

export default withLayout;
