import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Divider from "@/components/divider";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Title from "@/components/ui/title";
import { useToast } from "@/components/ui/use-toast";
import useAppContext from "@/hooks/useAppContext";
import { type NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import { inter } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterOutputs } from "@modal/api";
import { editProjectSchema } from "@modal/common/schemas/project/editSchema";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Circle, Loader2, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

const ProjectPage: NextPageWithLayout = () => {
  const { setListInfo } = useAppContext();
  const { query } = useRouter();
  const id = query.id as string;

  useEffect(() => {
    setListInfo({ type: "project", id });

    return () => {
      setListInfo(undefined);
    };
  }, [id, setListInfo]);

  const { data, isLoading } = api.project.getProjectInfo.useQuery(id);
  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) return <div>404</div>;

  return (
    <article id="project-page" className="relative flex flex-col">
      <div className="flex items-center gap-1">
        <Title title={data.name} Icon={Circle} />
        <Menu data={data} />
      </div>
      <div className="custom-scroll flex h-[calc(100%-150px)] flex-col overflow-y-scroll md:h-[calc(100%-69px)]">
        <div className="flex-grow py-2">
          <h2 className="text-gray-500">Tasks</h2>
          <Divider widthMargin="mx-1" heightPadding="my-2" />
          <TodoList listType="project" listId={id} />
        </div>
      </div>
      <ActionBar />
    </article>
  );
};

interface IData {
  data: RouterOutputs["project"]["getProjectInfo"];
}

const Menu: React.FC<IData> = ({ data }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger aria-label="Project Menu">
          <MoreHorizontal aria-hidden size={isSmallDevice ? 18 : 24} />
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
  const { toast } = useToast();
  const ctx = api.useContext();

  const { data: spaces, isLoading: spacesIsLoading } =
    api.space.getSpacesForUser.useQuery();

  const { mutate, isLoading } = api.project.update.useMutation({
    onSuccess() {
      setOpen(false);
      form.reset();
      void ctx.invalidate();
      toast({
        variant: "success",
        title: "Project saved!",
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

  const NO_SPACE = "None";

  type Inputs = z.infer<typeof editProjectSchema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(editProjectSchema),
    values: {
      id: data.id,
      name: data.name,
      spaceId: data.spaceId,
    },
  });

  const nameValue = form.watch("name");

  const onSubmit = (formValues: Inputs) => {
    const { name, spaceId } = formValues;
    const modifiedName = name.trim();
    mutate({
      id: data.id,
      name: modifiedName,
      spaceId: spaceId === NO_SPACE ? undefined : spaceId,
    });
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
            {/* Project Space */}
            <FormField
              control={form.control}
              name="spaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? NO_SPACE}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </FormControl>
                    {spaces && !spacesIsLoading ? (
                      <SelectContent className={`${inter.variable} font-sans`}>
                        <SelectItem value={NO_SPACE}>None</SelectItem>
                        {spaces.map((userSpace) => (
                          <SelectItem key={userSpace.id} value={userSpace.id}>
                            {userSpace.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    ) : null}
                  </Select>
                </FormItem>
              )}
            />

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

  const { mutate, isLoading } = api.project.remove.useMutation({
    onSuccess() {
      void ctx.invalidate();
      toast({
        variant: "success",
        title: "Project deleted!",
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
            This will delete all tasks associated with this project. Are you
            sure you want to delete <span className="italic">{data.name}</span>?
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

ProjectPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ProjectPage;
