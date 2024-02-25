import styles from "./FPLoader.module.css";
import LoaderGif from "../../../assets/loader.gif";

const FPLoader = () => {
  return (
    <div className={styles.fpLoaderWrapper}>
      <img src={LoaderGif} alt="loader-gif" className={styles.loaderGif} />
    </div>
  );
};

export default FPLoader;
