import { useEffect } from "react";
import { fetchAuthAction } from "./store/store";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { FPLoader } from "./components";
import Routes from "./routes/Routes";
import styles from "./App.module.css";

const App = () => {
  const dispatch = useAppDispatch();
  const isAuthLoading = useAppSelector((state) => state.auth.isLoading);

  useEffect(() => {
    dispatch(fetchAuthAction());
  }, []);

  return (
    <main className={styles.appWrapper}>
      {isAuthLoading ? <FPLoader /> : <Routes />}
    </main>
  );
};

export default App;
