import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";

import { type NextPageWithLayout } from "../_app";

const SignInPage: NextPageWithLayout = () => {
  return <article></article>;
};

SignInPage.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;

export default SignInPage;
