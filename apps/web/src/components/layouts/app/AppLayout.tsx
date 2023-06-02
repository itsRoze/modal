import Navbar from "./Navbar";

export interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLayout> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
