import FastInventoryRawMaterial from "../components/FastInventoryRawMaterial";
import FastInventoryReference from "../components/FastInventoryReference";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/fast-inventory.module.css";

function FastInventory() {
  return (
    <ProtectedRoute>
      <section className={Style.fastInventory}>
        <aside className={Style.fastInventoryRawMaterial}>
          <FastInventoryRawMaterial />
        </aside>
        <aside className={Style.fastInventoryReference}>
          <FastInventoryReference />
        </aside>
      </section>
    </ProtectedRoute>
  );
}

export default FastInventory;
