"use client";

import Sidebar from "../components/Sidebar";
import withAuth from "../components/WithAuth";
import { AccountCircle, ContentPaste, Dvr, GridView, Logout, Slideshow } from "@mui/icons-material";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        topItems={[
          { icon: <GridView />, name: "Dashboard", path: "/dashboard" },
          { icon: <Dvr />, name: "Create Course", path: "/create-course"},
          { icon: <ContentPaste />, name: "Create Evaluation", path: "/create-evaluation"},
          { icon: <Slideshow />, name: "Create Video", path: "/create-video" },
        ]}

        bottomItems={[
          { icon: <AccountCircle />, name: "Profile",  path: "/profile" },
          { icon: <Logout />, name: "Logout", path: "/" },
        ]}
      />
      {/* <div style={{ flex: 1, padding: "20px" }}>
        <Component {...pageProps} />
      </div> */}
    </div>
  );
}

export default withAuth(Dashboard);