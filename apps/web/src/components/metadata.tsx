import Head from "next/head";
import { useRouter } from "next/router";

export type MetaType = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
};

interface Props {
  meta?: MetaType;
}

const Metadata: React.FC<Props> = ({ meta }) => {
  const router = useRouter();
  const defaultMeta: MetaType = {
    title: "Modal | Task Management Simplified",
    description:
      "Task management simplified. Workflow streamlined. An app designed around simplicity. Don't be burdened with complex configuration.",
    path: router.pathname,
    image: "/images/Logo.png",
    type: "website",
  };

  const finalMeta = { ...defaultMeta, ...meta };
  const { title, description, path, image, type } = finalMeta;

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="author" content="Code Stache LLC" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://usemodal.com${path}`} />
      <meta property="og:image" content={`https://usemodal.com${image}`} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://usemodal.com${image}`} />
      <link rel="canonical" href={`https://usemodal.com${path}`} />
    </Head>
  );
};

export default Metadata;
