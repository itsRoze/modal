import AppLayout from "@/components/layouts/app/AppLayout";
import { type NextPageWithLayout } from "@/pages/_app";

const ProjectPage: NextPageWithLayout = () => {
  return (
    <article>
      <h1>Area</h1>
    </article>
  );
};

ProjectPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ProjectPage;
