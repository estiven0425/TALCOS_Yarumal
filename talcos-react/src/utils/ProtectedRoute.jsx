import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const localIP = import.meta.env.VITE_LOCAL_IP;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const verifySession = async () => {
      try {
        const response = await axios.post(`http://${localIP}:3000/login/get`, {
          token,
        });
        const perfilUsuario = response.data.id_perfil_usuario;
        const restrictions = {
          1: [
            "/generatereport",
            "/generatereport/finalreport",
            "/generatereport/finishreport",
            "/generatereport/generatereportmenu",
            "/generatereport/initialreport",
            "/generatereport/noveltyoption",
            "/generatereport/noveltystrike",
            "/generatereport/noveltystrikestart",
            "/generatereport/noveltystrikestop",
            "/generatereport/noveltystrikestopfinish",
            "/generatereport/noveltyreference",
            "/generatereport/noveltyoperator",
            "/generatereport/noveltyfreighter",
            "/generatereport/noveltywindmill",
            "/generatereport/noveltymechanic",
            "/generatereport/qualitycontrol",
            "/fastinventory",
          ],
          2: [
            "/staff",
            "/user",
            "/createuser",
            "/listedituser",
            "/edituser",
            "/listdeleteuser",
            "/deleteuser",
            "/generatereport",
            "/generatereport/finalreport",
            "/generatereport/finishreport",
            "/generatereport/generatereportmenu",
            "/generatereport/initialreport",
            "/generatereport/noveltyoption",
            "/generatereport/noveltystrike",
            "/generatereport/noveltystrikestart",
            "/generatereport/noveltystrikestop",
            "/generatereport/noveltystrikestopfinish",
            "/generatereport/noveltyreference",
            "/generatereport/noveltyoperator",
            "/generatereport/noveltyfreighter",
            "/generatereport/noveltymechanic",
            "/generatereport/noveltywindmill",
            "/generatereport/qualitycontrol",
            "/fastinventory",
          ],
          3: [
            "/staff",
            "/user",
            "/createuser",
            "/listedituser",
            "/edituser",
            "/listdeleteuser",
            "/deleteuser",
            "/report",
            "/monitoring",
            "/inventory",
            "/inventory/inventorygeneral",
            "/inventory/inventoryshift",
            "/inventory/createshift",
            "/inventory/listeditshift",
            "/inventory/editshift",
            "/inventory/listdeleteshift",
            "/inventory/deleteshift",
            "/inventory/inventorywindmill",
            "/inventory/createwindmill",
            "/inventory/listeditwindmill",
            "/inventory/editwindmill",
            "/inventory/listdeletewindmill",
            "/inventory/deletewindmill",
            "/inventory/inventoryreference",
            "/inventory/createreference",
            "/inventory/listeditreference",
            "/inventory/editreference",
            "/inventory/listdeletereference",
            "/inventory/deletereference",
            "/inventory/inventorybulk",
            "/inventory/createbulk",
            "/inventory/listeditbulk",
            "/inventory/editbulk",
            "/inventory/listdeletebulk",
            "/inventory/deletebulk",
            "/inventory/inventoryrawmaterial",
            "/inventory/createrawmaterial",
            "/inventory/listeditrawmaterial",
            "/inventory/editrawmaterial",
            "/inventory/listdeleterawmaterial",
            "/inventory/deleterawmaterial",
            "/inventory/registerrawmaterial",
            "/inventory/createregisterrawmaterial",
            "/inventory/detailregisterrawmaterial",
            "/inventory/deleteregisterrawmaterial",
            "/inventory/inventoryrejectedmaterial",
            "/inventory/createrejectedmaterial",
            "/inventory/listeditrejectedmaterial",
            "/inventory/editrejectedmaterial",
            "/inventory/listdeleterejectedmaterial",
            "/inventory/deleterejectedmaterial",
            "/inventory/listreasignedrejectedmaterial",
            "/inventory/reasignedrejectedmaterial",
            "/inventory/inventoryprofile",
            "/inventory/createprofile",
            "/inventory/listeditprofile",
            "/inventory/editprofile",
            "/inventory/listdeleteprofile",
            "/inventory/deleteprofile",
            "/inventory/inventorybobcat",
            "/inventory/createbobcat",
            "/inventory/listeditbobcat",
            "/inventory/editbobcat",
            "/inventory/listdeletebobcat",
            "/inventory/deletebobcat",
          ],
          4: [
            "/staff",
            "/user",
            "/createuser",
            "/listedituser",
            "/edituser",
            "/listdeleteuser",
            "/deleteuser",
            "/report",
            "/monitoring",
            "/inventory",
            "/inventory/inventorygeneral",
            "/inventory/inventoryshift",
            "/inventory/createshift",
            "/inventory/listeditshift",
            "/inventory/editshift",
            "/inventory/listdeleteshift",
            "/inventory/deleteshift",
            "/inventory/inventorywindmill",
            "/inventory/createwindmill",
            "/inventory/listeditwindmill",
            "/inventory/editwindmill",
            "/inventory/listdeletewindmill",
            "/inventory/deletewindmill",
            "/inventory/inventoryreference",
            "/inventory/createreference",
            "/inventory/listeditreference",
            "/inventory/editreference",
            "/inventory/listdeletereference",
            "/inventory/deletereference",
            "/inventory/inventorybulk",
            "/inventory/createbulk",
            "/inventory/listeditbulk",
            "/inventory/editbulk",
            "/inventory/listdeletebulk",
            "/inventory/deletebulk",
            "/inventory/inventoryrawmaterial",
            "/inventory/createrawmaterial",
            "/inventory/listeditrawmaterial",
            "/inventory/editrawmaterial",
            "/inventory/listdeleterawmaterial",
            "/inventory/deleterawmaterial",
            "/inventory/registerrawmaterial",
            "/inventory/createregisterrawmaterial",
            "/inventory/detailregisterrawmaterial",
            "/inventory/deleteregisterrawmaterial",
            "/inventory/inventoryrejectedmaterial",
            "/inventory/createrejectedmaterial",
            "/inventory/listeditrejectedmaterial",
            "/inventory/editrejectedmaterial",
            "/inventory/listdeleterejectedmaterial",
            "/inventory/deleterejectedmaterial",
            "/inventory/listreasignedrejectedmaterial",
            "/inventory/reasignedrejectedmaterial",
            "/inventory/inventoryprofile",
            "/inventory/createprofile",
            "/inventory/listeditprofile",
            "/inventory/editprofile",
            "/inventory/listdeleteprofile",
            "/inventory/deleteprofile",
            "/inventory/inventorybobcat",
            "/inventory/createbobcat",
            "/inventory/listeditbobcat",
            "/inventory/editbobcat",
            "/inventory/listdeletebobcat",
            "/inventory/deletebobcat",
          ],
        };

        if (restrictions[perfilUsuario]?.includes(location.pathname)) {
          navigate("/home", { replace: true });
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        navigate("/", { replace: true });
      }
    };

    verifySession();
  }, [token, localIP, navigate, location.pathname]);

  return isAuthorized ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
