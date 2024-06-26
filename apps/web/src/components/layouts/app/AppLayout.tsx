import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorPage from "@/components/error";
import WelcomeGuide from "@/components/featureNotifications/welcome";
import { ProjectMenu } from "@/components/forms/newProject";
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
import { useToast } from "@/components/ui/use-toast";
import Upgrade from "@/components/upgrade";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { inter } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterOutputs } from "@modal/api";
import {
  classNames,
  getRemainingTrial,
  getTrpcClientErrorMsg,
} from "@modal/common";
import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CloudMoon,
  Home,
  Inbox,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import styles from "./AppLayout.module.css";
import Header from "./Header";

export interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FC<IAppLayout> = ({ children }) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const ctx = api.useContext();

  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showMobileMenu, setMobileMenu] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const { data: userData, isLoading } = api.user.get.useQuery();
  const { data: isNewUser, isLoading: newUserLoading } =
    api.user.isNewUser.useQuery();

  const { mutate } = api.featureNotification.completeWelcome.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
    onError: (error) => {
      const clientErrorMsg = getTrpcClientErrorMsg(error);
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: clientErrorMsg,
      });
    },
  });

  useEffect(() => {
    setShowWelcome(isNewUser ?? false);
  }, [isNewUser]);

  const meta: MetaType = {
    path: "/app",
  };

  const closeWelcome = () => {
    setShowWelcome(false);
    mutate();
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

  // User is not logged in
  if (!userData && !isLoading) {
    void push("/login");
    return null;
  }

  // Loading state
  if (isLoading || newUserLoading) return <LoadingPage />;

  // Email not verified
  if (!userData.time_email_verified) {
    return <ErrorPage code={403} message="Email not verified" />;
  }

  if (isNewUser === undefined && !newUserLoading) {
    void push("/404");
    return null;
  }

  // Free trial over
  if (
    userData.stripeSubscriptionStatus !== "active" &&
    getRemainingTrial(userData.time_email_verified) <= 0
  ) {
    return (
      <main className={classNames("h-screen w-screen")}>
        <Upgrade />
      </main>
    );
  }

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
        {isNewUser ? (
          <WelcomeGuide open={showWelcome} close={closeWelcome} />
        ) : null}
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
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

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
          "": isSmallDevice,
        },
        styles.sidebar,
      )}
    >
      <div
        id="sidebar-container"
        className={cn({
          "relative z-20 overflow-x-hidden rounded-r-3xl border-r border-gray-100 bg-gray-50 shadow-[2px_1px_8px_rgba(0,0,0,0.25)]":
            true,
          "overflow-y-hidden": collapsed,
          "custom-scroll overflow-y-scroll": !collapsed,
          "h-full": !isSmallDevice,
          "h-[calc(100vh-165px)]": isSmallDevice,
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
          <label className="relative flex justify-center px-4 py-2 md:py-0">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[16rem] max-w-full rounded-2xl border-gray-300 bg-white pr-7 shadow-sm"
              placeholder="🔎 Search"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-5 md:top-3"
              >
                <X size={18} className="text-red-700" strokeWidth={3} />
              </button>
            ) : null}
          </label>
          {!debouncedSearchTerm ? (
            <>
              <ul className="my-2 flex flex-col items-stretch gap-0.5">
                <li
                  key={1}
                  className={cn({
                    "flex hover:bg-slate-200": true,
                    "transition-colors duration-300": true,
                    "gap-4 rounded-md py-1 pl-5": !collapsed,
                    "h-10 w-10 rounded-full py-1 pl-5": collapsed,
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
                    "gap-4 rounded-md py-1 pl-5": !collapsed,
                    "h-10 w-10 rounded-full py-1 pl-5": collapsed,
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
                    "gap-4 rounded-md py-1 pl-5": !collapsed,
                    "h-10 w-10 rounded-full py-1 pl-5": collapsed,
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

                <li
                  key={4}
                  className={cn({
                    "flex hover:bg-slate-200": true,
                    "transition-colors duration-300": true,
                    "gap-4 rounded-md py-1 pl-5": !collapsed,
                    "h-10 w-10 rounded-full py-1 pl-5": collapsed,
                  })}
                >
                  <Link
                    onClick={handleMobileClick}
                    href="/app/unassigned"
                    className="flex w-full items-center gap-1"
                  >
                    <Inbox size={18} className="text-rose-400" />
                    Unassigned
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
    <ul className="my-2 pl-5">
      {lists.map((list) => (
        <li
          key={list.id}
          className="flex w-full flex-col rounded-md px-1 py-1 hover:bg-slate-200"
        >
          <Link
            onClick={handleMobileClick}
            href={`/app/${list.type}/${encodeURIComponent(list.id)}`}
            className="flex items-center gap-1 font-normal text-black"
          >
            {list.type === "project" ? (
              <ProjectIcon size={18} />
            ) : (
              <SpaceIcon size={18} />
            )}
            <p className="w-64 truncate">{list.name}</p>
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
    <ul className="w-full py-1 pl-5">
      {projects.map((userProject) => (
        <li
          key={userProject.id}
          className="flex w-full flex-col rounded-md px-1 py-1 hover:bg-slate-200"
        >
          <Link
            onClick={handleMobileClick}
            key={userProject.id}
            href={`/app/project/${encodeURIComponent(userProject.id)}`}
            className="w-64 truncate font-normal text-black "
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
    <ul className="my-1 flex flex-col items-stretch gap-1">
      {spaces.map((userSpace) => (
        <li
          key={userSpace.id}
          className={cn({
            "flex w-full py-1 pl-5 font-medium text-gray-500 ": true,
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
          "flex w-full items-center gap-2 pr-2 ": true,
          "transition-colors duration-300": true,
        })}
      >
        <Icon size={18} className="text-gray-500" />
        <Link
          onClick={handleMobileClick}
          href={`/app/space/${encodeURIComponent(userSpace.id)}`}
          className="w-60 truncate rounded-md text-left hover:bg-slate-200"
        >
          {userSpace.name}
        </Link>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col py-1 pl-6">
        {userSpace.projects.map((userProject) => (
          <Link
            onClick={handleMobileClick}
            key={userProject.id}
            href={`/app/project/${encodeURIComponent(userProject.id)}`}
            className="w-56 truncate rounded-md px-1 py-1 font-normal text-black hover:bg-slate-200"
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
          className="bg-logo fixed bottom-3 right-5 rounded-full p-2 shadow-md hover:opacity-75 md:bottom-10"
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
      const clientErrorMsg = getTrpcClientErrorMsg(error);

      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: clientErrorMsg,
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
