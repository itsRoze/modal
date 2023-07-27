import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Divider from "@/components/divider";
import ProjectIcon from "@/components/icons/project";
import ActionBar from "@/components/layouts/app/ActionBar";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import TodoList from "@/components/todolist";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Title from "@/components/ui/title";
import { useToast } from "@/components/ui/use-toast";
import useAppContext from "@/hooks/useAppContext";
import { type NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterOutputs } from "@modal/api";
import { editSpaceSchema } from "@modal/common/schemas/space/editSchema";
import { Boxes, Loader2, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

const SpacePage: NextPageWithLayout = () => {
  const { setListInfo } = useAppContext();
  const { query } = useRouter();
  const id = query.id as string;

  useEffect(() => {
    setListInfo({ type: "space", id });

    return () => {
      setListInfo(undefined);
    };
  }, [id, setListInfo]);

  const { data, isLoading } = api.space.getSpaceInfo.useQuery(id);
  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) return <div>404</div>;

  return (
    <article id="space-page" className="relative flex flex-col">
      <div className="flex items-center">
        <Title title={data.name} Icon={Boxes} />
        <Menu data={data} />
      </div>
      <div className="custom-scroll ml-5 flex h-full flex-col overflow-y-scroll">
        <div className="py-2">
          <h2 className="text-gray-500">Projects</h2>
          <Divider widthMargin="mx-1" heightPadding="my-2" />
          <ProjectsView projects={data.projects} />
        </div>
        <div className="flex-grow py-2">
          <h2 className="text-gray-500">Tasks</h2>
          <Divider widthMargin="mx-1" heightPadding="my-2" />
          <TodoList listType="space" listId={id} />
        </div>
      </div>
      <ActionBar />
    </article>
  );
};

interface IData {
  data: RouterOutputs["space"]["getSpaceInfo"];
}

const Menu: React.FC<IData> = ({ data }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <MoreHorizontal size={24} />
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="w-full rounded-sm p-1 text-left hover:bg-slate-100"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="w-full rounded-sm p-1 text-left text-red-500 hover:bg-slate-100"
            >
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <EditForm open={showEdit} setOpen={setShowEdit} data={data} />
      <DeleteForm open={showDelete} setOpen={setShowDelete} data={data} />
    </>
  );
};

interface IForm extends IData {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditForm: React.FC<IForm> = ({ open, setOpen, data }) => {
  const ctx = api.useContext();
  const { toast } = useToast();

  const { mutate, isLoading } = api.space.update.useMutation({
    onSuccess(newData) {
      form.reset({ name: newData.name });
      void ctx.invalidate();
      setOpen(false);
      toast({
        variant: "success",
        title: "Space saved!",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: error.message ?? "Something went wrong",
      });
    },
  });

  type Inputs = z.infer<typeof editSpaceSchema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(editSpaceSchema),
    values: {
      id: data.id,
      name: data.name,
    },
  });

  const nameValue = form.watch("name");

  const onSubmit = (formValues: Inputs) => {
    const { name } = formValues;
    const modifiedName = name.trim();
    mutate({ id: data.id, name: modifiedName });
  };

  const onOpenChange = () => {
    setOpen((val) => !val);
    form.reset({ name: data.name });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="My new category"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.formState.errors.name ? (
              <p className="text-destructive text-sm font-medium">
                {form.formState.errors.name?.message}
              </p>
            ) : null}
            <div className="float-right mt-4">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || !nameValue}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteForm: React.FC<IForm> = ({ open, setOpen, data }) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate, isLoading } = api.space.remove.useMutation({
    onSuccess() {
      void ctx.invalidate();
      toast({
        variant: "success",
        title: "Space deleted!",
      });
      void push("/app");
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: error.message ?? "Something went wrong",
      });
    },
  });

  const onSubmit = () => {
    setOpen(false);
    mutate({ id: data.id });
  };

  const onOpenChange = () => {
    setOpen((val) => !val);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            This will delete all projects and tasks within this space too. Are you sure
            you want to delete <span className="italic">{data.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="float-right space-x-4">
            <Button
              disabled={isLoading}
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting
              </Button>
            ) : (
              <Button variant="destructive" onClick={onSubmit}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface IProjects {
  projects: RouterOutputs["space"]["getSpaceInfo"]["projects"];
}

const ProjectsView: React.FC<IProjects> = ({ projects }) => {
  if (projects.length === 0)
    return <p className="ml-5 italic text-gray-400">No projects</p>;
  return (
    <>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex w-full rounded-md px-2 py-2 text-lg hover:bg-slate-50"
          >
            <Link
              href={`/app/project/${encodeURIComponent(project.id)}`}
              className="flex items-center gap-2"
            >
              <ProjectIcon size={28} />
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

SpacePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default SpacePage;
