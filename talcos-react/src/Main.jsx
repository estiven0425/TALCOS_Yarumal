import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Header from "./components/Header";
import Inventory from "./pages/Inventory";
import InventoryGeneral from "./pages/InventoryGeneral";
import InventoryCreateBobCat from "./pages/InventoryCreateBobCat";
import InventoryCreateBulk from "./pages/InventoryCreateBulk";
import InventoryCreateProfile from "./pages/InventoryCreateProfile";
import InventoryCreateRawMaterial from "./pages/InventoryCreateRawMaterial";
import InventoryCreateRawMaterialRegister from "./pages/InventoryCreateRawMaterialRegister";
import InventoryCreateReference from "./pages/InventoryCreateReference";
import InventoryCreateRejectedMaterial from "./pages/InventoryCreateRejectedMaterial";
import InventoryCreateShift from "./pages/InventoryCreateShift";
import InventoryCreateWindmill from "./pages/InventoryCreateWindmill";
import InventoryDeleteBobCat from "./pages/InventoryDeleteBobCat";
import InventoryDeleteBulk from "./pages/InventoryDeleteBulk";
import InventoryDeleteProfile from "./pages/InventoryDeleteProfile";
import InventoryDeleteRawMaterial from "./pages/InventoryDeleteRawMaterial";
import InventoryDeleteReference from "./pages/InventoryDeleteReference";
import InventoryDeleteRejectedMaterial from "./pages/InventoryDeleteRejectedMaterial";
import InventoryDeleteShift from "./pages/InventoryDeleteShift";
import InventoryDeleteWindmill from "./pages/InventoryDeleteWindmill";
import InventoryEditBobCat from "./pages/InventoryEditBobCat";
import InventoryEditBulk from "./pages/InventoryEditBulk";
import InventoryEditProfile from "./pages/InventoryEditProfile";
import InventoryEditRawMaterial from "./pages/InventoryEditRawMaterial";
import InventoryEditReference from "./pages/InventoryEditReference";
import InventoryEditRejectedMaterial from "./pages/InventoryEditRejectedMaterial";
import InventoryEditShift from "./pages/InventoryEditShift";
import InventoryEditWindmill from "./pages/InventoryEditWindmill";
import InventoryListDeleteBobCat from "./pages/InventoryListDeleteBobCat";
import InventoryListDeleteBulk from "./pages/InventoryListDeleteBulk";
import InventoryListDeleteProfile from "./pages/InventoryListDeleteProfile";
import InventoryListDeleteRawMaterial from "./pages/InventoryListDeleteRawMaterial";
import InventoryListDeleteReference from "./pages/InventoryListDeleteReference";
import InventoryListDeleteRejectedMaterial from "./pages/InventoryListDeleteRejectedMaterial";
import InventoryListDeleteShift from "./pages/InventoryListDeleteShift";
import InventoryListDeleteWindmill from "./pages/InventoryListDeleteWindmill";
import InventoryListEditBobCat from "./pages/InventoryListEditBobCat";
import InventoryListEditBulk from "./pages/InventoryListEditBulk";
import InventoryListEditProfile from "./pages/InventoryListEditProfile";
import InventoryListEditRawMaterial from "./pages/InventoryListEditRawMaterial";
import InventoryListEditReference from "./pages/InventoryListEditReference";
import InventoryListEditRejectedMaterial from "./pages/InventoryListEditRejectedMaterial";
import InventoryListEditShift from "./pages/InventoryListEditShift";
import InventoryListEditWindmill from "./pages/InventoryListEditWindmill";
import InventoryBobCat from "./pages/InventoryBobCat";
import InventoryBulk from "./pages/InventoryBulk";
import InventoryProfile from "./pages/InventoryProfile";
import InventoryRawMaterial from "./pages/InventoryRawMaterial";
import InventoryRawMaterialRegister from "./pages/InventoryRawMaterialRegister";
import InventoryReference from "./pages/InventoryReference";
import InventoryRejectedMaterial from "./pages/InventoryRejectedMaterial";
import InventoryShift from "./pages/InventoryShift";
import InventoryWindmill from "./pages/InventoryWindmill";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Monitoring from "./pages/Monitoring";
import Notification from "./pages/Notification";
import Report from "./pages/Report";
import Setting from "./pages/Setting";
import SettingChangePassword from "./pages/SettingChangePassword";
import Staff from "./pages/Staff";
import StaffCreateUser from "./pages/StaffCreateUser";
import StaffDeleteUser from "./pages/StaffDeleteUser";
import StaffEditUser from "./pages/StaffEditUser";
import StaffListEditUser from "./pages/StaffListEditUser";
import StaffListDeleteUser from "./pages/StaffListDeleteUser";
import StaffUser from "./pages/StaffUser";
import "./styles/main.css";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/" element={<Header />}>
          <Route path="home" element={<Home />} />
          <Route path="staff" element={<Staff />} />
          <Route path="user" element={<StaffUser />} />
          <Route path="createuser" element={<StaffCreateUser />} />
          <Route path="listedituser" element={<StaffListEditUser />} />
          <Route path="edituser" element={<StaffEditUser />} />
          <Route path="listdeleteuser" element={<StaffListDeleteUser />} />
          <Route path="deleteuser" element={<StaffDeleteUser />} />
          <Route path="report" element={<Report />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="inventory" element={<Inventory />}>
            <Route path="inventorygeneral" element={<InventoryGeneral />} />
            <Route path="inventoryshift" element={<InventoryShift />} />
            <Route path="createshift" element={<InventoryCreateShift />} />
            <Route path="listeditshift" element={<InventoryListEditShift />} />
            <Route path="editshift" element={<InventoryEditShift />} />
            <Route
              path="listdeleteshift"
              element={<InventoryListDeleteShift />}
            />
            <Route path="deleteshift" element={<InventoryDeleteShift />} />
            <Route path="inventorywindmill" element={<InventoryWindmill />} />
            <Route
              path="createwindmill"
              element={<InventoryCreateWindmill />}
            />
            <Route
              path="listeditwindmill"
              element={<InventoryListEditWindmill />}
            />
            <Route path="editwindmill" element={<InventoryEditWindmill />} />
            <Route
              path="listdeletewindmill"
              element={<InventoryListDeleteWindmill />}
            />
            <Route
              path="deletewindmill"
              element={<InventoryDeleteWindmill />}
            />
            <Route path="inventoryreference" element={<InventoryReference />} />
            <Route
              path="createreference"
              element={<InventoryCreateReference />}
            />
            <Route
              path="listeditreference"
              element={<InventoryListEditReference />}
            />
            <Route path="editreference" element={<InventoryEditReference />} />
            <Route
              path="listdeletereference"
              element={<InventoryListDeleteReference />}
            />
            <Route
              path="deletereference"
              element={<InventoryDeleteReference />}
            />
            <Route path="inventorybulk" element={<InventoryBulk />} />
            <Route path="createbulk" element={<InventoryCreateBulk />} />
            <Route path="listeditbulk" element={<InventoryListEditBulk />} />
            <Route path="editbulk" element={<InventoryEditBulk />} />
            <Route
              path="listdeletebulk"
              element={<InventoryListDeleteBulk />}
            />
            <Route path="deletebulk" element={<InventoryDeleteBulk />} />
            <Route
              path="inventoryrawmaterial"
              element={<InventoryRawMaterial />}
            />
            <Route
              path="createrawmaterial"
              element={<InventoryCreateRawMaterial />}
            />
            <Route
              path="listeditrawmaterial"
              element={<InventoryListEditRawMaterial />}
            />
            <Route
              path="editrawmaterial"
              element={<InventoryEditRawMaterial />}
            />
            <Route
              path="listdeleterawmaterial"
              element={<InventoryListDeleteRawMaterial />}
            />
            <Route
              path="deleterawmaterial"
              element={<InventoryDeleteRawMaterial />}
            />
            <Route
              path="registerrawmaterial"
              element={<InventoryRawMaterialRegister />}
            />
            <Route
              path="createregisterrawmaterial"
              element={<InventoryCreateRawMaterialRegister />}
            />
            <Route
              path="inventoryrejectedmaterial"
              element={<InventoryRejectedMaterial />}
            />
            <Route
              path="createrejectedmaterial"
              element={<InventoryCreateRejectedMaterial />}
            />
            <Route
              path="listeditrejectedmaterial"
              element={<InventoryListEditRejectedMaterial />}
            />
            <Route
              path="editrejectedmaterial"
              element={<InventoryEditRejectedMaterial />}
            />
            <Route
              path="listdeleterejectedmaterial"
              element={<InventoryListDeleteRejectedMaterial />}
            />
            <Route
              path="deleterejectedmaterial"
              element={<InventoryDeleteRejectedMaterial />}
            />
            <Route path="inventoryprofile" element={<InventoryProfile />} />
            <Route path="createprofile" element={<InventoryCreateProfile />} />
            <Route
              path="listeditprofile"
              element={<InventoryListEditProfile />}
            />
            <Route path="editprofile" element={<InventoryEditProfile />} />
            <Route
              path="listdeleteprofile"
              element={<InventoryListDeleteProfile />}
            />
            <Route path="deleteprofile" element={<InventoryDeleteProfile />} />
            <Route path="inventorybobcat" element={<InventoryBobCat />} />
            <Route path="createbobcat" element={<InventoryCreateBobCat />} />
            <Route
              path="listeditbobcat"
              element={<InventoryListEditBobCat />}
            />
            <Route path="editbobcat" element={<InventoryEditBobCat />} />
            <Route
              path="listdeletebobcat"
              element={<InventoryListDeleteBobCat />}
            />
            <Route path="deletebobcat" element={<InventoryDeleteBobCat />} />
          </Route>
          <Route path="notification" element={<Notification />} />
          <Route path="setting" element={<Setting />} />
          <Route path="changepassword" element={<SettingChangePassword />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
