import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import { api } from "@/utils/api";

import { type NextPageWithLayout } from "./_app";

const SignUp: NextPageWithLayout = () => {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.user.create.useMutation({
    onSuccess() {
      console.log("success");
      void ctx.user.invalidate();
    },
    onError(error) {
      console.log("error", error);
    },
  });

  const onSubmit = () => {
    console.log("attempting to mutate");
    mutate({
      email: "example@email.com",
    });
  };

  return (
    <article>
      <button onClick={onSubmit}>Sign up</button>
    </article>
  );
};

SignUp.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;
export default SignUp;
