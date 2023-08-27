import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectIcon } from "@/components/icons/project";
import { SpaceIcon } from "@/components/icons/space";
import { LoadingPage } from "@/components/loading";
import Metadata, { type MetaType } from "@/components/metadata";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Upgrade from "@/components/upgrade";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { inter } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterOutputs } from "@modal/api";
import { classNames, getRemainingTrial } from "@modal/common";
import { createProjectSchema } from "@modal/common/schemas/project/createSchema";
import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import {
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CloudMoon,
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
  const { data: userData, isLoading } = api.user.get.useQuery();

  const meta: MetaType = {
    path: "/app",
  };

  const onMenuButtonClick = () => {
    setMobileMenu((prev) => {
      setSidebarCollapsed(prev);
      return !prev;
    });
  };

  const handleMobileClick = () => {
    if (window.innerWidth < 1024) {
      onMenuButtonClick();
    }
  };

  // Loading state
  if (isLoading) return <LoadingPage />;

  // Potential Errors
  if (!userData && !isLoading) return <div>404</div>;
  if (!userData.time_email_verified) return <div>404</div>;

  // Free trial over
  if (
    userData.stripeSubscriptionStatus !== "active" &&
    getRemainingTrial(userData.time_email_verified) <= 0
  )
    return (
      <main className={classNames("h-screen w-screen")}>
        <Upgrade />
      </main>
    );

  return (
    <div className="h-full overflow-hidden">
      <Metadata meta={meta} />
      <Header userData={userData} onMenuButtonClick={onMenuButtonClick} />
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
          handleMobileClick={handleMobileClick}
        />
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

interface ISidebar {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  shown: boolean;
  handleMobileClick: () => void;
}

const Sidebar: React.FC<ISidebar> = ({
  collapsed,
  setCollapsed,
  shown,
  handleMobileClick,
}) => {
  const Icon = collapsed ? ChevronsRight : ChevronsLeft;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleNavClick = () => {
    handleMobileClick();
    setSearchTerm("");
  };

  return (
    <div
      id="sidebar"
      className={cn(
        {
          "z-50 pb-4": true,
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
          "relative z-20 h-full overflow-x-hidden rounded-r-3xl border-r border-gray-100 bg-gray-50 shadow-[2px_1px_8px_rgba(0,0,0,0.25)]":
            true,
          "overflow-y-hidden": collapsed,
          "custom-scroll overflow-y-auto": !collapsed,
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
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed((prev) => !prev)}
            className={cn({
              "grid place-content-center": true, // position
              "hover:bg-gray-200": true, // colors
              "h-10 w-10 rounded-full": true, // shape
            })}
          >
            <Icon size={24} aria-hidden />
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
          <div className="flex justify-center px-4 py-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[16rem] max-w-full rounded-2xl border-gray-300 bg-white shadow-sm"
              placeholder="🔎 Search"
            />
          </div>
          {!debouncedSearchTerm ? (
            <>
              <ul className="my-2 flex flex-col items-stretch gap-1">
                <li
                  key={1}
                  className={cn({
                    "flex hover:bg-slate-200": true,
                    "transition-colors duration-300": true,
                    "gap-4 rounded-md py-2 pl-5": !collapsed,
                    "h-10 w-10 rounded-full py-2 pl-5": collapsed,
                  })}
                >
                  <Link
                    onClick={handleMobileClick}
                    href={"/app"}
                    className="flex w-full items-center gap-1"
                  >
                    <Home size={18} className="text-fuchsia-600" />
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
                  <Link
                    onClick={handleMobileClick}
                    href="/app/history"
                    className="flex w-full items-center gap-1"
                  >
                    <BookOpenCheck size={18} className="text-green-600" />
                    History
                  </Link>
                </li>
                <li
                  key={3}
                  className={cn({
                    "flex hover:bg-slate-200": true,
                    "transition-colors duration-300": true,
                    "gap-4 rounded-md py-2 pl-5": !collapsed,
                    "h-10 w-10 rounded-full py-2 pl-5": collapsed,
                  })}
                >
                  <Link
                    onClick={handleMobileClick}
                    href="/app/someday"
                    className="flex w-full items-center gap-1"
                  >
                    <CloudMoon size={18} className="text-indigo-300" />
                    Someday
                  </Link>
                </li>
              </ul>
              <SpacesDisplay
                collapsed={collapsed}
                handleMobileClick={handleMobileClick}
              />
              <ProjectsDisplay handleMobileClick={handleMobileClick} />
            </>
          ) : (
            <SearchResults
              searchTerm={debouncedSearchTerm}
              handleMobileClick={handleNavClick}
            />
          )}
        </nav>
        {!searchTerm ? (
          <div
            className={cn({
              "fixed bottom-3 mb-2 ml-2": true,
              "opacity-0": collapsed,
              "transition-opacity delay-0 duration-0": true,
              "opacity-100": !collapsed,
            })}
          >
            <SidebarMenu />
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface ISearchResults {
  searchTerm: string;
  handleMobileClick: () => void;
}
const SearchResults: React.FC<ISearchResults> = ({
  searchTerm,
  handleMobileClick,
}) => {
  const {
    data: lists,
    isLoading,
    isFetching,
  } = api.user.findList.useQuery(searchTerm);

  if (isLoading) return <LoadingPage />;
  if (!lists && !isLoading) return null;
  if (lists.length === 0 && !isLoading && !isFetching)
    return <p className="pl-5 text-sm">No results found</p>;

  return (
    <ul className="pl-5">
      {lists.map((list) => (
        <li
          key={list.id}
          className="flex w-full flex-col rounded-md px-1 py-2 hover:bg-slate-200"
        >
          <Link
            onClick={handleMobileClick}
            href={`/app/${list.type}/${encodeURIComponent(list.id)}`}
            className="w-full font-normal text-black "
          >
            {list.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

interface IProjectsDisplay {
  handleMobileClick: () => void;
}

const ProjectsDisplay: React.FC<IProjectsDisplay> = ({ handleMobileClick }) => {
  const { data: projects, isLoading: projectsIsLoading } =
    api.project.getAllForUser.useQuery();

  if (!projects || projectsIsLoading) return null;

  return (
    <ul className="w-full pl-5">
      {projects.map((userProject) => (
        <li
          key={userProject.id}
          className="flex w-full flex-col rounded-md px-1 py-2 hover:bg-slate-200"
        >
          <Link
            onClick={handleMobileClick}
            key={userProject.id}
            href={`/app/project/${encodeURIComponent(userProject.id)}`}
            className="w-full font-normal text-black "
          >
            {userProject.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

interface ISpacesDisplay {
  collapsed: boolean;
  handleMobileClick: () => void;
}

const SpacesDisplay: React.FC<ISpacesDisplay> = ({
  collapsed,
  handleMobileClick,
}) => {
  const { data: spaces, isLoading: spacesIsLoading } =
    api.space.getAllForUser.useQuery();

  if (!spaces || spacesIsLoading) return null;

  return (
    <ul className="my-2 flex flex-col items-stretch gap-2">
      {spaces.map((userSpace) => (
        <li
          key={userSpace.id}
          className={cn({
            "flex w-full py-2 pl-5 font-medium text-gray-500 ": true,
            "gap-4": !collapsed,
            "h-10 w-10": collapsed,
          })}
        >
          <SpaceSection
            userSpace={userSpace}
            handleMobileClick={handleMobileClick}
          />
        </li>
      ))}
    </ul>
  );
};

type SpaceType = RouterOutputs["space"]["getAllForUser"][number];

interface ISpaceSection {
  userSpace: SpaceType;
  handleMobileClick: () => void;
}

const SpaceSection: React.FC<ISpaceSection> = ({
  userSpace,
  handleMobileClick,
}) => {
  const [open, setOpen] = useState(true);
  const Icon = open ? ChevronDown : ChevronRight;

  return (
    <Collapsible
      className="w-full"
      open={open}
      onOpenChange={() => setOpen((val) => !val)}
    >
      <CollapsibleTrigger
        className={cn({
          "flex w-full justify-between rounded-md pr-2 hover:bg-slate-200":
            true,
          "transition-colors duration-300": true,
        })}
      >
        <Link
          onClick={handleMobileClick}
          href={`/app/space/${encodeURIComponent(userSpace.id)}`}
          className="flex-grow text-left"
        >
          {userSpace.name}
        </Link>
        <Icon size={18} className="text-gray-500" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col py-2">
        {userSpace.projects.map((userProject) => (
          <Link
            onClick={handleMobileClick}
            key={userProject.id}
            href={`/app/project/${encodeURIComponent(userProject.id)}`}
            className="rounded-md px-1 py-2 font-normal text-black hover:bg-slate-200"
          >
            {userProject.name}
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const SidebarMenu = () => {
  const [showProject, setShowProject] = useState(false);
  const [showSpace, setShowSpace] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger
          aria-label="New list"
          className="bg-logo rounded-full p-2 shadow-md hover:opacity-75"
        >
          <Plus aria-hidden size={32} className=" text-white" />
        </PopoverTrigger>
        <PopoverContent className={`${inter.variable} ml-2 font-sans`}>
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={() => setShowProject(true)}
              className="flex w-full items-center gap-1 rounded-md p-1 hover:bg-slate-100"
            >
              <ProjectIcon size={24} />
              New Project
            </button>
            <button
              className="flex w-full items-center gap-1 rounded-md p-1 hover:bg-slate-100"
              onClick={() => setShowSpace(true)}
            >
              <SpaceIcon size={24} /> New Space
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
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: error.message ?? "Something went wrong",
      });
    },
  });

  const NO_SPACE = "None";
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
                    defaultValue={field.value}
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

interface ISpaceMenu {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpaceMenu: React.FC<ISpaceMenu> = ({ open, setOpen }) => {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.space.create.useMutation({
    onSuccess() {
      form.reset();
      void ctx.invalidate();
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
