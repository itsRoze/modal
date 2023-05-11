import { api } from "~/utils/api";

const Home = () => {
  const { data, isLoading } = api.example.hello.useQuery({ text: "Hello!!" });
  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && !data) return <div>Something went wrong</div>;
  return <div className="text-xl text-red-300">{data.greeting}</div>;
};

export default Home;
