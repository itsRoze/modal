import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { inter } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterOutputs } from "@modal/api";
import { classNames } from "@modal/common";
import { createProjectSchema } from "@modal/common/schemas/project/createSchema";
import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import {
  BookOpenCheck,
  Boxes,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
  Home,
  Loader2,
  Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import styles from "./AppLayout.module.css";
import Header from "./Header";

export interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLayout> = ({ children }) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showMobileMenu, setMobileMenu] = useState(true);
  return (
    <>
      <Header
        onMenuButtonClick={() => {
          setMobileMenu((prev) => {
            setSidebarCollapsed(prev);
            return !prev;
          });
        }}
      />
      <main
        className={classNames(
          styles.main ?? "",
          collapsed
            ? "lg:grid-cols-sidebar-collapsed grid-cols-sidebar-mobile-collapsed"
            : "grid-cols-sidebar",
          "transition-[grid-template-columns] duration-300 ease-in-out",
          inter.variable,
          "font-sans",
        )}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setSidebarCollapsed}
          shown={showMobileMenu}
        />
        {children}
      </main>
    </>
  );
};

export default AppLayout;

interface ISidebar {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  shown: boolean;
}

const Sidebar: React.FC<ISidebar> = ({ collapsed, setCollapsed, shown }) => {
  const Icon = collapsed ? ChevronsRight : ChevronsLeft;

  return (
    <div
      id="sidebar"
      className={cn(
        {
          "pb-4": true,
          "fixed lg:static lg:translate-x-0": true,
          "transition-all duration-300 ease-in-out": true,
          "-translate-x-full": !shown,
          "w-screen lg:w-[300px]": !collapsed,
          "lg:w-16": collapsed,
        },
        styles.sidebar,
      )}
    >
      <div
        id="sidebar-container"
        className={cn({
          "relative z-20 h-full rounded-r-3xl border-r border-gray-100 bg-gray-50 shadow-[2px_1px_8px_rgba(0,0,0,0.25)]":
            true,
        })}
      >
        {/* Button */}
        <div
          className={cn({
            "hidden items-center lg:flex ": true,
            "justify-between p-2": !collapsed,
            "justify-center py-2": collapsed,
          })}
        >
          {!collapsed && <span className="whitespace-nowrap"></span>}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className={cn({
              "grid place-content-center": true, // position
              "hover:bg-gray-200": true, // colors
              "h-10 w-10 rounded-full": true, // shape
            })}
          >
            <Icon size={24} />
          </button>
        </div>
        {/* Menu */}
        <nav
          className={cn({
            "opacity-0": collapsed,
            "transition-opacity delay-0 duration-0": true,
            "opacity-100": !collapsed,
          })}
        >
          {/* Search bar */}
          <div className="flex justify-center">
            <Input
              type="text"
              className="w-64 max-w-full rounded-2xl border-gray-300 bg-white shadow-sm"
              placeholder="🔎 Search"
            />
          </div>
          <ul className="my-2 flex flex-col items-stretch gap-2">
            <li
              key={1}
              className={cn({
                "flex hover:bg-slate-200": true,
                "transition-colors duration-300": true,
                "gap-4 rounded-md py-2 pl-5": !collapsed,
                "h-10 w-10 rounded-full py-2 pl-5": collapsed,
              })}
            >
              <Link href="/app" className="flex w-full items-center gap-2">
                <Home size={24} className="text-fuchsia-600" />
                Dashboard
              </Link>
            </li>
            <li
              key={2}
              className={cn({
                "flex hover:bg-slate-200": true,
                "transition-colors duration-300": true,
                "gap-4 rounded-md py-2 pl-5": !collapsed,
                "h-10 w-10 rounded-full py-2 pl-5": collapsed,
              })}
            >
              <Link href="/app/history" className="flex w-full gap-2">
                <BookOpenCheck size={24} className="text-green-600" />
                History
              </Link>
            </li>
          </ul>
          <SpacesDisplay collapsed={collapsed} />
        </nav>
        <div
          className={cn({
            "absolute bottom-0 mb-2 ml-2": true,
            "opacity-0": collapsed,
            "transition-opacity delay-0 duration-0": true,
            "opacity-100": !collapsed,
          })}
        >
          <SidebarMenu />
        </div>
      </div>
    </div>
  );
};

interface ISpacesDisplay {
  collapsed: boolean;
}

const SpacesDisplay: React.FC<ISpacesDisplay> = ({ collapsed }) => {
  const { data: spaces, isLoading: spacesIsLoading } =
    api.space.getAllForUser.useQuery();

  if (!spaces || spacesIsLoading) return null;

  return (
    <ul className="my-2 flex flex-col items-stretch gap-2">
      {spaces.map((userSpace) => (
        <li
          key={userSpace.id}
          className={cn({
            "flex w-full py-2 pl-5 font-medium text-gray-500 hover:bg-slate-200":
              true,
            "transition-colors duration-300": true,
            "gap-4 rounded-md": !collapsed,
            "h-10 w-10 rounded-full ": collapsed,
          })}
        >
          <SpaceSection userSpace={userSpace} />
        </li>
      ))}
    </ul>
  );
};

type SpaceType = RouterOutputs["space"]["getAllForUser"][number];

interface ISpaceSection {
  userSpace: SpaceType;
}
const SpaceSection: React.FC<ISpaceSection> = ({ userSpace }) => {
  const [open, setOpen] = useState(true);
  const Icon = open ? ChevronDown : ChevronRight;

  return (
    <Collapsible
      className="w-full"
      open={open}
      onOpenChange={() => setOpen((val) => !val)}
    >
      <CollapsibleTrigger className="flex w-full justify-between pr-2">
        <p>{userSpace.name}</p>
        <Icon size={18} className="text-gray-500" />
      </CollapsibleTrigger>
    </Collapsible>
  );
};

const SidebarMenu = () => {
  const [showProject, setShowProject] = useState(false);
  const [showSpace, setShowSpace] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger className="bg-logo rounded-full p-2 shadow-md hover:opacity-75">
          <Plus size={32} className=" text-white" />
        </PopoverTrigger>
        <PopoverContent className={`${inter.variable} ml-2 font-sans`}>
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={() => setShowProject(true)}
              className="flex w-full items-center rounded-md p-1 hover:bg-slate-100"
            >
              <Circle size={24} className="mr-2" />
              New Project
            </button>
            <button
              className="flex w-full items-center rounded-md p-1 hover:bg-slate-100"
              onClick={() => setShowSpace(true)}
            >
              <Boxes size={24} className="mr-2" /> New Space
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <ProjectMenu open={showProject} setOpen={setShowProject} />
      <SpaceMenu open={showSpace} setOpen={setShowSpace} />
    </>
  );
};

interface IProjectMenu {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectMenu: React.FC<IProjectMenu> = ({ open, setOpen }) => {
  type Inputs = z.infer<typeof createProjectSchema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      spaceId: undefined,
    },
  });

  const onSubmit = (data: Inputs) => {
    const { spaceId, name } = data;
    const modifiedName = name.trim();
    console.log({ spaceId, name: modifiedName });
  };

  const onOpenChange = () => {
    setOpen((val) => !val);
    // form.reset();
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
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </Select>
                  </FormControl>
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
              <Button type="submit" disabled={!form.formState.isValid}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface ISpaceMenu {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpaceMenu: React.FC<ISpaceMenu> = ({ open, setOpen }) => {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.space.create.useMutation({
    onSuccess() {
      form.reset();
      void ctx.space.invalidate();
      setOpen(false);
      toast({
        variant: "success",
        title: "Space added!",
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
  const { toast } = useToast();

  type Inputs = z.infer<typeof createSpaceSchema>;

  const form = useForm<Inputs>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: Inputs) => {
    const { name } = data;
    const modifiedName = name.trim();
    mutate({ name: modifiedName });
  };

  const onOpenChange = () => {
    setOpen((val) => !val);
    form.reset();
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className={`${inter.variable} font-sans`}>
        <DialogHeader>
          <DialogTitle>Create a new space</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
