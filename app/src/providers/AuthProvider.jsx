import React, { createContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRealm } from "./RealmProvider";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {realmLogin} = useRealm();

  const login = async (email, otp) => {
    try {
      const result = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: otp,
        }),
      });
      if (result.status === 400) {
        const error = await result.json();
        // console.log(error)
        toast.error(`${error.message}`);
        return
      }
      const response = await result.json();
      localStorage.setItem("token", response.token);
      setIsAuthenticated(true);
      realmLogin(response.token);
      await getUserProfile();
      return result
    } catch (err) {
      toast.error(`Invalid email or password`);
    }
  };

  const register = async (email, otp) => {
    try {
      const result = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: otp,
        }),
      });
      if (result.status === 400) {
        const error = await result.json();
        // console.log(error)
        toast.error(`${error.message}`);
        return
      }
      
      return result
    } catch (err) {
      toast.error(`Invalid email or password`);
    }
  };

  const firstTimeSetup = async (obj) => {
    try {
      const result = await fetch("http://localhost:3000/users/first-time-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
      });
      if (result.status === 400) {
        const error = await result.json();
        // console.log(error)
        toast.error(`${error.message}`);
        return
      }
      const response = await result.json();
      localStorage.setItem("token", response.token);
      return result
    } catch (err) {
      toast.error(`Fail to register`);
    }
  };

  const sendOtp = async (email) => {
    try {
      const result = await fetch("http://localhost:3000/users/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      toast.success("OTP has been sent to your email");
      return result;
    } catch (err) {
      toast.error(`Error sending OTP`);
    }
  };

  const getUserProfile = async () => {
    try {
      const result = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = await result.json();
      setUser(data.user);
      return result;
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        register,
        sendOtp,
        firstTimeSetup,
        getUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);