import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Admin from "./components/Admin.jsx";
import Profile from "./components/Profile.jsx";
import CreateJob from "./components/CreateJob.jsx";
import CreateParth from "./components/CreateParth.jsx";
import EditJob from "./components/EditJob.jsx";
import SeeDetailJob from "./components/SeeDetailJob.jsx";
import ShowApplicate from "./components/ShowApplicate.jsx";
import SavedJobToSee from "./components/SavedJobToSee.jsx";
import AdminToChangeStatus from "./components/AdminToChangeStatus.jsx";

import UserContextProvider from "./context/UserContextProvider.jsx";
import JobContextProvider from "./context/JobContextProvider.jsx";
import WishListContextProvider from "./context/WishListContextProvider.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Your Google Client ID
const GOOGLE_CLIENT_ID = "523156746392-n9hr4aiev403ev6i9ujjr5m1gbm7kro1.apps.googleusercontent.com";

// Fixed router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="register" element={<Register />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="admin" element={<Admin />} />
      <Route path="profile" element={<Profile />} />
      <Route path="createJob" element={<CreateJob />} />
      <Route path="partOf" element={<CreateParth />} />
      <Route path="editJob/:id" element={<EditJob />} />
      <Route path="job/:id" element={<SeeDetailJob />} />
      <Route path="applicated" element={<ShowApplicate />} />
      <Route path="later" element={<SavedJobToSee />} />
      <Route path="changeApp" element={<AdminToChangeStatus />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContextProvider>
        <JobContextProvider>
          <WishListContextProvider>
            <RouterProvider router={router} />
          </WishListContextProvider>
        </JobContextProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
