import { Tabs } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Inventory from "./Inventory/Inventory";
import Donar from "./Donar";
import Hospitals from "./Hospitals";
import Organizations from "./Organizations";
import InventoryTable from "../components/InventoryTable";

function Profile() {
  const { currentUser } = useSelector((state) => state.users);
  return (
    <div>
      <Tabs>
        {currentUser.userType === "organization" && (
          <>
            <Tabs.TabPane tab="Inventory" key="1">
                <Inventory/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Donars" key="2">
              <Donar/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Hospitals" key="3">
              <Hospitals/>
            </Tabs.TabPane>
          </>
        )}
        {currentUser.userType === "donar" && (
          <>
          <Tabs.TabPane tab="Donations" key="1">
            <InventoryTable/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Organization" key="2">
            <Organizations/>
          </Tabs.TabPane>
          </>
        )}
        {currentUser.userType === "hospital" && (
          <>
          <Tabs.TabPane tab="Consumptions" key="1">
            <InventoryTable/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Organization" key="2">
            <Organizations userType="hospital"/>
          </Tabs.TabPane>
          </>
        )}
      </Tabs>
    </div>
  );
}

export default Profile;
