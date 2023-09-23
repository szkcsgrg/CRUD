import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Update from "./Update";
import Add from "./Add";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/update/:id",
    element: <Update />,
  },
  {
    path: "/add",
    element: <Add />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
