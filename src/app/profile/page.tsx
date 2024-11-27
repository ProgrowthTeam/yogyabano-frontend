"use client";

import React from "react";
import withAuth from "../components/WithAuth";

const Profile: React.FC = () => {
  return (
    <div>Profile Page</div>
  );
};

export default withAuth(Profile);
