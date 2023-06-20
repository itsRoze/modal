import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import { type NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import { generateSSHelper } from "@modal/api";

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const AreaPage: NextPageWithLayout<PageProps> = ({ id }) => {
  const { data, isLoading } = api.space.getSpaceInfo.useQuery(id);
  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) return <div>404</div>;

  return (
    <article>
      <h1>{data.name}</h1>
    </article>
  );
};

interface Props {
  id: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const id = context.params?.id;
  if (typeof id !== "string") {
    throw new Error("no area ID");
  }

  const ss = generateSSHelper();
  await ss.space.getSpaceInfo.prefetch(id);

  return {
    props: {
      trpcState: ss.dehydrate(),
      id,
    },
  };
};

AreaPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AreaPage;
