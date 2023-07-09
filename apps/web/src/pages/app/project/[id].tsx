import { useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Title from "@/components/ui/title";
import { useToast } from "@/components/ui/use-toast";
import { type NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@modal/api";
import { Circle, Loader2, MoreHorizontal } from "lucide-react";

const ProjectPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data, isLoading } = api.project.getProjectInfo.useQuery(id);

  if (isLoading) return <LoadingPage />;
  if (!data && !isLoading) return <div>404</div>;

  return (
    <article>
      <div className="flex items-center">
        <Title title={data.name} Icon={Circle} />
        <Menu data={data} />
      </div>
    </article>
  );
};

interface IData {
  data: RouterOutputs["project"]["getProjectInfo"];
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

const EditForm: React.FC<IForm> = ({ open, setOpen }) => {
  const onOpenChange = () => {
    setOpen((val) => !val);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
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
