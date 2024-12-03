"use client";

import React from "react";
import withAuth from "../components/WithAuth";

const Dashboard: React.FC = () => {
  return (
    <div>Dashboard Page</div>
  );
};

export default withAuth(Dashboard);
