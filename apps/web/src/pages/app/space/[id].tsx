import { useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { type NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterOutputs } from "@modal/api";
import { editSpaceSchema } from "@modal/common/schemas/space/editSchema";
import { Boxes, Loader2, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

const SpacePage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const id = query.id as string;

  const { data, isLoading } = api.space.getSpaceInfo.useQuery(id);
  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) return <div>404</div>;

  return (
    <article>
      <div className="flex items-center">
        <Title title={data.name} Icon={Boxes} />
        <Menu data={data} />
      </div>
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

const DeleteForm: React.FC<IForm> = ({ open, setOpen }) => {
  const onOpenChange = () => {
    setOpen((val) => !val);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

SpacePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default SpacePage;
