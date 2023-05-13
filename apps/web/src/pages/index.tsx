import { api } from "@/utils/api";

const Home = () => {
  // const { data, isLoading } = api.example.hello.useQuery({ text: "Hello!!" });
  const { data, isLoading } = api.example.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && !data) return <div>Something went wrong</div>;
  return <div className="text-xl text-red-300">{data.count}</div>;
};

export default Home;
