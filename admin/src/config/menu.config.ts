import type { ElementType } from "react";

import {
  Building2,
  Building,
  Boxes,
  Briefcase,
  ChartColumn,
  FolderKanban,
  Globe,
  Landmark,
  LayoutDashboard,
  Map,
  MapPinned,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: ElementType;

  children?: MenuItem[];

  userTypes?: string[];
  permissions?: string[];
}

export const menu: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    id: "companies",
    title: "Companies",
    path: "/companies",
    icon: Building2,
  },



  {
    id: "modules",
    title: "Modules",
    path: "/modules",
    icon: Boxes,
  },

  {
    id: "Subscription-plan",
    title: "Subscription Plans",
    path: "/subscription-plans",
    icon: Landmark,
  },

  {
  id: "platform-roles",
  title: "Platform Roles",
  path: "/platform-roles",
  icon: ShieldCheck,
},

  {
    id: "master",
    title: "Master",
    path: "#",
    icon: Globe,
    children: [
      {
        id: "states",
        title: "States",
        path: "/master/states",
        icon: MapPinned,
      },
      {
        id: "cities",
        title: "Cities",
        path: "/master/cities",
        icon: Map,
      },
    ],
  },

  {
    id: "crm",
    title: "CRM",
    path: "#",
    icon: FolderKanban,
    children: [
      {
        id: "clients",
        title: "Clients",
        path: "/clients",
        icon: Users,
         permissions: [
          "company.client.view",
        ],
      },

      {
        id: "projects",
        title: "Projects",
        path: "/projects",
        icon: FolderKanban,
         permissions: [
          "company.project.view",
        ],
      },

      {
        id: "projects-categories",
        title: "Projects Categories",
        path: "/project-categories",
        icon: Boxes,

         permissions: [
          "company.project_category.view",
        ],
      },

       {
      id: "project-roles",
      title: "Project Roles",
      path: "/project-roles",
      icon: UserCog,
    },
    ],
  },

  {
    id: "hr",
    title: "HR",
    path: "#",
    icon: Briefcase,
    children: [
      {
        id: "departments",
        title: "Departments",
        path: "/departments",
        icon: Building,

        permissions: [
          "company.department.view",
        ],
      },
      {
        id: "designations",
        title: "Designations",
        path: "/designations",
        icon: ShieldCheck,

        permissions: [
          "company.designation.view",
        ],
      },
      {
        id: "employees",
        title: "Employees",
        path: "/employees",
        icon: Users,

         permissions: [
          "company.employee.view",
        ],
      },

      
    ],
  },

  {
    id: "inventory",
    title: "Inventory",
    path: "/inventory",
    icon: Boxes,
  },

  {
    id: "finance",
    title: "Finance",
    path: "/finance",
    icon: Landmark,
  },

  {
    id: "reports",
    title: "Reports",
    path: "/reports",
    icon: ChartColumn,
  },

  {
    id: "settings",
    title: "Settings",
    path: "#",
    icon: Settings,
    children: [
      {
        id: "platform-users",
        title: "Platform Users",
        path: "/settings/platform-users",
        icon: UsersRound,

        userTypes: ["PLATFORM_OWNER"],
      },
      {
        id: "users",
        title: "Users",
        path: "/settings/users",
        icon: UserCog,
      },

      {
        id: "company-profile",
        title: "Company Profile",
        path: "/settings/company-profile",
        icon: Building2,
      },

      {
        id: "organization-unit",
        title: "Organization Unit",
        path: "/settings/organization-units",
        icon: Building,
      },

      {
        id: "roles",
        title: "Roles",
        path: "/settings/roles",
        icon: ShieldCheck,
      },

      {
        id: "permissions",
        title: "Permissions",
        path: "/settings/permissions",
        icon: ShieldCheck,
      },

      {
        id: "user-profile",
        title: "User Profile",
        path: "/settings/profile",
        icon: UserRound,
      },
    ],
  },
];
