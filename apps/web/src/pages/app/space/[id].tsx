import { useState } from "react";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/app/AppLayout";
import { LoadingPage } from "@/components/loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Title from "@/components/ui/title";
import { type NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import { Boxes, MoreHorizontal } from "lucide-react";

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
        <Menu />
      </div>
    </article>
  );
};

const Menu = () => {
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
      <EditForm open={showEdit} setOpen={setShowEdit} />
      <DeleteForm open={showDelete} setOpen={setShowDelete} />
    </>
  );
};

interface IForm {
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
