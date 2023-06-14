import { useState } from "react";
import Link from "next/link";
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
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { inter } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { classNames } from "@modal/common";
import { createSpaceSchema } from "@modal/common/schemas/space/createSchema";
import {
  BookOpenCheck,
  Boxes,
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
      className={cn({
        "pb-4": true,
        "h-full": true,
        "fixed lg:static lg:translate-x-0": true,
        "transition-all duration-300 ease-in-out": true,
        "-translate-x-full": !shown,
        "w-screen lg:w-[300px]": !collapsed,
        "lg:w-16": collapsed,
      })}
    >
      <div
        id="sidebar-container"
        className={cn({
          "z-20 rounded-r-3xl border-r border-gray-100 bg-gray-50 shadow-[2px_1px_8px_rgba(0,0,0,0.25)]":
            true,
          "h-full": true,
        })}
      >
        <div className="flex h-full flex-col justify-between">
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
              "flex-grow": true,
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
                  "mx-3 gap-4 rounded-md p-2": !collapsed,
                  "mx-3 h-10 w-10 rounded-full p-2": collapsed,
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
                  "mx-3 gap-4 rounded-md p-2": !collapsed,
                  "mx-3 h-10 w-10 rounded-full p-2": collapsed,
                })}
              >
                <Link href="/app/history" className="flex w-full gap-2">
                  <BookOpenCheck size={24} className="text-green-600" />
                  History
                </Link>
              </li>
            </ul>
          </nav>
          <div
            className={cn({
              "mb-2 ml-2": true,
              "opacity-0": collapsed,
              "transition-opacity delay-0 duration-0": true,
              "opacity-100": !collapsed,
            })}
          >
            <SidebarMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarMenu = () => {
  const [showSpace, setShowSpace] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger className="bg-logo rounded-full p-2 shadow-md hover:opacity-75">
          <Plus size={32} className=" text-white" />
        </PopoverTrigger>
        <PopoverContent className={`${inter.variable} ml-2 font-sans`}>
          <div className="flex flex-col items-start gap-2">
            <button className="flex w-full items-center rounded-md p-1 hover:bg-slate-100">
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
