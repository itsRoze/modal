import styles from "./AppLayout.module.css";
import Navbar from "./Navbar";

export interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLayout> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default AppLayout;
