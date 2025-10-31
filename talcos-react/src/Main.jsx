import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  Error,
  FastInventory,
  GenerateFinalReport,
  GenerateFinishReport,
  GenerateInitialReport,
  GenerateNovelty,
  GenerateNoveltyChangeMechanic,
  GenerateNoveltyChangeFreighter,
  GenerateNoveltyChangeOperator,
  GenerateNoveltyChangeReference,
  GenerateNoveltyStrike,
  GenerateNoveltyStrikeStart,
  GenerateNoveltyStrikeStop,
  GenerateNoveltyStrikeStopFinish,
  GenerateNoveltyWindmill,
  GenerateQualityControl,
  GenerateReport,
  GenerateReportMenu,
  Home,
  Inventory,
  InventoryGeneral,
  InventoryCreateAggregate,
  InventoryCreateBobCat,
  InventoryCreateBulk,
  InventoryCreateCommercialBudget,
  InventoryCreateCommercialDispatche,
  InventoryCreateDispatche,
  InventoryCreateInventoryAp,
  InventoryCreateProfile,
  InventoryCreateRawMaterial,
  InventoryCreateRawMaterialRegister,
  InventoryCreateReference,
  InventoryCreateRejectedMaterial,
  InventoryCreateShift,
  InventoryCreateTypeStrike,
  InventoryCreateWindmill,
  InventoryCreateWindmillAp,
  InventoryDeleteAggregate,
  InventoryDeleteBobCat,
  InventoryDeleteBulk,
  InventoryDeleteCommercialBudget,
  InventoryDeleteCommercialDispatche,
  InventoryDeleteDispatche,
  InventoryDeleteInventoryAp,
  InventoryDeleteProfile,
  InventoryDeleteRawMaterial,
  InventoryDeleteRawMaterialRegister,
  InventoryDeleteReference,
  InventoryDeleteRejectedMaterial,
  InventoryDeleteShift,
  InventoryDeleteTypeStrike,
  InventoryDeleteWindmill,
  InventoryDeleteWindmillAp,
  InventoryEditBobCat,
  InventoryEditBulk,
  InventoryEditCommercialBudget,
  InventoryEditCommercialDispatche,
  InventoryEditDispatche,
  InventoryEditInventoryAp,
  InventoryEditProfile,
  InventoryEditRawMaterial,
  InventoryEditReasignedRejectedMaterial,
  InventoryEditReference,
  InventoryEditRejectedMaterial,
  InventoryEditShift,
  InventoryEditTypeStrike,
  InventoryEditWindmill,
  InventoryEditWindmillAp,
  InventoryListDeleteBobCat,
  InventoryListDeleteBulk,
  InventoryListDeleteCommercialBudget,
  InventoryListDeleteCommercialDispatche,
  InventoryListDeleteDispatche,
  InventoryListDeleteInventoryAp,
  InventoryListDeleteProfile,
  InventoryListDeleteRawMaterial,
  InventoryListDeleteReference,
  InventoryListDeleteRejectedMaterial,
  InventoryListDeleteShift,
  InventoryListDeleteTypeStrike,
  InventoryListDeleteWindmill,
  InventoryListDeleteWindmillAp,
  InventoryListEditBobCat,
  InventoryListEditBulk,
  InventoryListEditCommercialBudget,
  InventoryListEditCommercialDispatche,
  InventoryListEditDispatche,
  InventoryListEditInventoryAp,
  InventoryListEditProfile,
  InventoryListEditRawMaterial,
  InventoryListEditReference,
  InventoryListEditRejectedMaterial,
  InventoryListEditShift,
  InventoryListEditTypeStrike,
  InventoryListEditWindmill,
  InventoryListEditWindmillAp,
  InventoryListReasignedRejectedMaterial,
  InventoryAggregate,
  InventoryAggregateDetail,
  InventoryBobCat,
  InventoryBulk,
  InventoryCommercialBudget,
  InventoryCommercialDispatche,
  InventoryDispatche,
  InventoryInventoryAp,
  InventoryProfile,
  InventoryRawMaterial,
  InventoryRawMaterialRegister,
  InventoryRawMaterialRegisterDetail,
  InventoryReference,
  InventoryRejectedMaterial,
  InventoryShift,
  InventoryTypeStrike,
  InventoryWindmill,
  InventoryWindmillAp,
  Login,
  Logout,
  Monitoring,
  MonitoringMain,
  MonitoringView,
  Notification,
  Report,
  ReportMain,
  ReportDetail,
  Setting,
  SettingChangePassword,
  Staff,
  StaffCreateUser,
  StaffDeleteUser,
  StaffEditUser,
  StaffListEditUser,
  StaffListDeleteUser,
  StaffUser,
} from "./pages";
import { StrictMode } from "react";

import Header from "./components/Header";

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
          <Route path="report" element={<Report />}>
            <Route path="mainreport" element={<ReportMain />} />
            <Route path="detailreport" element={<ReportDetail />} />
          </Route>
          <Route path="generatereport" element={<GenerateReport />}>
            <Route path="generatereportmenu" element={<GenerateReportMenu />} />
            <Route path="initialreport" element={<GenerateInitialReport />} />
            <Route path="noveltyoption" element={<GenerateNovelty />} />
            <Route path="noveltystrike" element={<GenerateNoveltyStrike />} />
            <Route
              path="noveltystrikestart"
              element={<GenerateNoveltyStrikeStart />}
            />
            <Route
              path="noveltystrikestop"
              element={<GenerateNoveltyStrikeStop />}
            />
            <Route
              path="noveltystrikestopfinish"
              element={<GenerateNoveltyStrikeStopFinish />}
            />
            <Route
              path="noveltyreference"
              element={<GenerateNoveltyChangeReference />}
            />
            <Route
              path="noveltyoperator"
              element={<GenerateNoveltyChangeOperator />}
            />
            <Route
              path="noveltyfreighter"
              element={<GenerateNoveltyChangeFreighter />}
            />
            <Route
              path="noveltymechanic"
              element={<GenerateNoveltyChangeMechanic />}
            />
            <Route
              path="noveltywindmill"
              element={<GenerateNoveltyWindmill />}
            />
            <Route path="qualitycontrol" element={<GenerateQualityControl />} />
            <Route path="finalreport" element={<GenerateFinalReport />} />
            <Route path="finishreport" element={<GenerateFinishReport />} />
          </Route>
          <Route path="monitoring" element={<Monitoring />}>
            <Route path="mainmonitoring" element={<MonitoringMain />} />
            <Route path="viewmonitoring" element={<MonitoringView />} />
          </Route>
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
            <Route
              path="inventorywindmillap"
              element={<InventoryWindmillAp />}
            />
            <Route
              path="createwindmillap"
              element={<InventoryCreateWindmillAp />}
            />
            <Route
              path="listeditwindmillap"
              element={<InventoryListEditWindmillAp />}
            />
            <Route
              path="editwindmillap"
              element={<InventoryEditWindmillAp />}
            />
            <Route
              path="listdeletewindmillap"
              element={<InventoryListDeleteWindmillAp />}
            />
            <Route
              path="deletewindmillap"
              element={<InventoryDeleteWindmillAp />}
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
              path="detailregisterrawmaterial"
              element={<InventoryRawMaterialRegisterDetail />}
            />
            <Route
              path="deleteregisterrawmaterial"
              element={<InventoryDeleteRawMaterialRegister />}
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
            <Route
              path="listreasignedrejectedmaterial"
              element={<InventoryListReasignedRejectedMaterial />}
            />
            <Route
              path="reasignedrejectedmaterial"
              element={<InventoryEditReasignedRejectedMaterial />}
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
            <Route
              path="inventorycommercialbudget"
              element={<InventoryCommercialBudget />}
            />
            <Route
              path="createcommercialbudget"
              element={<InventoryCreateCommercialBudget />}
            />
            <Route
              path="listeditcommercialbudget"
              element={<InventoryListEditCommercialBudget />}
            />
            <Route
              path="editcommercialbudget"
              element={<InventoryEditCommercialBudget />}
            />
            <Route
              path="listdeletecommercialbudget"
              element={<InventoryListDeleteCommercialBudget />}
            />
            <Route
              path="deletecommercialbudget"
              element={<InventoryDeleteCommercialBudget />}
            />
            <Route path="inventorydispatche" element={<InventoryDispatche />} />
            <Route
              path="createdispatche"
              element={<InventoryCreateDispatche />}
            />
            <Route
              path="listeditdispatche"
              element={<InventoryListEditDispatche />}
            />
            <Route path="editdispatche" element={<InventoryEditDispatche />} />
            <Route
              path="listdeletedispatche"
              element={<InventoryListDeleteDispatche />}
            />
            <Route
              path="deletedispatche"
              element={<InventoryDeleteDispatche />}
            />

            <Route
              path="inventorycommercialdispatche"
              element={<InventoryCommercialDispatche />}
            />
            <Route
              path="createcommercialdispatche"
              element={<InventoryCreateCommercialDispatche />}
            />
            <Route
              path="listeditcommercialdispatche"
              element={<InventoryListEditCommercialDispatche />}
            />
            <Route
              path="editcommercialdispatche"
              element={<InventoryEditCommercialDispatche />}
            />
            <Route
              path="listdeletecommercialdispatche"
              element={<InventoryListDeleteCommercialDispatche />}
            />
            <Route
              path="deletecommercialdispatche"
              element={<InventoryDeleteCommercialDispatche />}
            />
            <Route path="inventoryaggregate" element={<InventoryAggregate />} />
            <Route
              path="createaggregate"
              element={<InventoryCreateAggregate />}
            />
            <Route
              path="detailaggregate"
              element={<InventoryAggregateDetail />}
            />
            <Route
              path="deleteaggregate"
              element={<InventoryDeleteAggregate />}
            />
            <Route path="inventoryap" element={<InventoryInventoryAp />} />
            <Route
              path="createinventoryap"
              element={<InventoryCreateInventoryAp />}
            />
            <Route
              path="listeditinventoryap"
              element={<InventoryListEditInventoryAp />}
            />
            <Route
              path="editinventoryap"
              element={<InventoryEditInventoryAp />}
            />
            <Route
              path="listdeleteinventoryap"
              element={<InventoryListDeleteInventoryAp />}
            />
            <Route
              path="deleteinventoryap"
              element={<InventoryDeleteInventoryAp />}
            />
            <Route path="inventoryparo" element={<InventoryTypeStrike />} />
            <Route
              path="createinventoryparo"
              element={<InventoryCreateTypeStrike />}
            />
            <Route
              path="listeditinventoryparo"
              element={<InventoryListEditTypeStrike />}
            />
            <Route
              path="editinventoryparo"
              element={<InventoryEditTypeStrike />}
            />
            <Route
              path="listdeleteinventoryparo"
              element={<InventoryListDeleteTypeStrike />}
            />
            <Route
              path="deleteinventoryparo"
              element={<InventoryDeleteTypeStrike />}
            />
          </Route>
          <Route path="fastinventory" element={<FastInventory />} />
          <Route path="notification" element={<Notification />} />
          <Route path="setting" element={<Setting />} />
          <Route path="changepassword" element={<SettingChangePassword />} />
          <Route path="logout" element={<Logout />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
