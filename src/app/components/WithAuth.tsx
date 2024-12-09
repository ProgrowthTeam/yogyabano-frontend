"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import withLayout from "./withLayout";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );
    const router = useRouter();

    useEffect(() => {
      const checkAuth = () => {
        const userData = sessionStorage.getItem("user");
        const sessionData = userData ? JSON.parse(userData).session : null;
        if (sessionData) {
          const session = sessionData;
          const currentTime = Math.floor(Date.now() / 1000);
          if (session.expires_at > currentTime) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            toast.error("Session expired. Please log in again.");
            router.push("/");
          }
        } else {
          setIsAuthenticated(false);
          router.push("/");
        }
      };

      checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return withLayout(AuthComponent);
};

export default withAuth;
