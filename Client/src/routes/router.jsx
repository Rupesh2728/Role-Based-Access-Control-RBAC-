import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignIn from "../components/Accounts/SignIn";
import SignUp from "../components/Accounts/SignUp";
import Homepage from "../components/Dashboard/Home/HomePage";
import { Users } from "../components/Dashboard/Users/Users";
import Dashboard from "../components/Dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "home",
            element: <Homepage />,
          },

          {
            path: "users",
            element: <Users />,
          },
        ],
      },

      {
        path : '*',
        element: <Error/>,
      }
    ],
  },
]);

export default router;
