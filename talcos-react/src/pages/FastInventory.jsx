import FastInventoryRawMaterial from "../components/FastInventoryRawMaterial";
import FastInventoryReference from "../components/FastInventoryReference";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/fast-inventory.module.css";

function FastInventory() {
  return (
    <ProtectedRoute>
      <section className={Style.fastInventory}>
        <section className={Style.fastInventoryRawMaterial}>
          <FastInventoryRawMaterial />
        </section>
        <section className={Style.fastInventoryReference}>
          <FastInventoryReference />
        </section>
      </section>
    </ProtectedRoute>
  );
}

export default FastInventory;
