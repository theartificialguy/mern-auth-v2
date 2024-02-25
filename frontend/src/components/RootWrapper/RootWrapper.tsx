import { Outlet } from "react-router-dom";
import { Navbar } from "..";
import SidePanel from "./SidePanel/SidePanel";
import styles from "./RootWrapper.module.css";

const RootWrapper = () => {
  return (
    <div className={styles.rootWrapper}>
      <SidePanel />
      <div className={styles.rootContent}>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default RootWrapper;
