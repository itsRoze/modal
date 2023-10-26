import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { inter } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTrpcClientErrorMsg } from "@modal/common";
import { createProjectSchema } from "@modal/common/schemas/project/createSchema";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { DialogHeader } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

interface IProjectMenu {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSpaceId?: string;
}

export const ProjectMenu: React.FC<IProjectMenu> = ({
  open,
  setOpen,
  defaultSpaceId,
}) => {
  const { toast } = useToast();
  const ctx = api.useContext();

  const { data: spaces, isLoading: spacesIsLoading } =
    api.space.getSpacesForUser.useQuery();

  const { mutate, isLoading } = api.project.create.useMutation({
    onSuccess() {
      setOpen(false);
      form.reset();
      void ctx.invalidate();
      toast({
        variant: "success",
        title: "Project added!",
      });
    },
    onError(error) {
      const clientErrMsg = getTrpcClientErrorMsg(error);

      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: clientErrMsg,
      });
    },
  });

  const NO_SPACE = "None";
  type Inputs = z.infer<typeof createProjectSchema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(createProjectSchema),
    values: {
      name: "",
      spaceId: defaultSpaceId,
    },
  });

  const onSubmit = (data: Inputs) => {
    const { spaceId, name } = data;
    const modifiedName = name.trim();

    mutate({
      name: modifiedName,
      spaceId: spaceId === NO_SPACE ? undefined : spaceId,
    });
  };

  const onOpenChange = () => {
    setOpen((val) => !val);
    form.reset();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className={`${inter.variable} font-sans`}>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
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
                      <SelectTrigger aria-label="Select space">
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
                      placeholder="My new project"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="float-right mt-4">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating
                </Button>
              ) : (
                <Button type="submit" disabled={!form.formState.isValid}>
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
