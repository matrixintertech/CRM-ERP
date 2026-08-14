import type {
  ElementType,
} from "react";

import type {
  AccessPortal,
} from "@/modules/profile/types/profile.types";

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

  /*
   * Application portal visibility.
   *
   * Undefined:
   * shared menu item.
   *
   * Example:
   * ["PLATFORM"]
   * ["COMPANY"]
   * ["CLIENT"]
   * ["VENDOR"]
   */
  portals?:
    AccessPortal[];

  /*
   * Temporary backward compatibility.
   * Sidebar migrate hone ke baad
   * remove kar denge.
   */
  userTypes?: string[];

  /*
   * Actual capability requirement.
   */
  permissions?: string[];
}


const PLATFORM_PORTAL:
  AccessPortal[] = [
    "PLATFORM",
  ];

const COMPANY_PORTAL:
  AccessPortal[] = [
    "COMPANY",
  ];


export const menu:
  MenuItem[] = [
  /*
   * Shared dashboard.
   *
   * Later agar har portal ka
   * separate dashboard hua to
   * isko portal-specific karenge.
   */
  {
    id:
      "dashboard",

    title:
      "Dashboard",

    path:
      "/dashboard",

    icon:
      LayoutDashboard,
  },


  /*
   * =========================
   * PLATFORM PORTAL
   * =========================
   */

  {
    id:
      "companies",

    title:
      "Companies",

    path:
      "/companies",

    icon:
      Building2,

    portals:
      PLATFORM_PORTAL,

     permissions: [
          "platform.company.view",
        ],
  },


  {
    id:
      "modules",

    title:
      "Modules",

    path:
      "/modules",

    icon:
      Boxes,

    portals:
      PLATFORM_PORTAL,

    permissions: [
          "platform.module.view",
        ],
  },


  {
    id:
      "Subscription-plan",

    title:
      "Subscription Plans",

    path:
      "/subscription-plans",

    icon:
      Landmark,

    portals:
      PLATFORM_PORTAL,
  },


  {
    id:
      "platform-roles",

    title:
      "Platform Roles",

    path:
      "/platform-roles",

    icon:
      ShieldCheck,

    portals:
      PLATFORM_PORTAL,
  },


  {
    id:
      "master",

    title:
      "Master",

    path:
      "#",

    icon:
      Globe,

    portals:
      PLATFORM_PORTAL,

    children: [
      {
        id:
          "states",

        title:
          "States",

        path:
          "/master/states",

        icon:
          MapPinned,

        portals:
          PLATFORM_PORTAL,
      },

      {
        id:
          "cities",

        title:
          "Cities",

        path:
          "/master/cities",

        icon:
          Map,

        portals:
          PLATFORM_PORTAL,
      },
    ],
  },


  /*
   * =========================
   * COMPANY PORTAL
   * =========================
   */

  {
    id:
      "crm",

    title:
      "CRM",

    path:
      "#",

    icon:
      FolderKanban,

    portals:
      COMPANY_PORTAL,

    children: [
      {
        id:
          "clients",

        title:
          "Clients",

        path:
          "/clients",

        icon:
          Users,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.client.view",
        ],
      },


      {
        id:
          "projects",

        title:
          "Projects",

        path:
          "/projects",

        icon:
          FolderKanban,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.project.view",
        ],
      },


      {
        id:
          "projects-categories",

        title:
          "Projects Categories",

        path:
          "/project-categories",

        icon:
          Boxes,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.project_category.view",
        ],
      },


      {
        id:
          "project-roles",

        title:
          "Project Roles",

        path:
          "/project-roles",

        icon:
          UserCog,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.project_role.view",
        ],
      },
    ],
  },


  {
    id:
      "hr",

    title:
      "HR",

    path:
      "#",

    icon:
      Briefcase,

    portals:
      COMPANY_PORTAL,

    children: [
      {
        id:
          "departments",

        title:
          "Departments",

        path:
          "/departments",

        icon:
          Building,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.department.view",
        ],
      },


      {
        id:
          "designations",

        title:
          "Designations",

        path:
          "/designations",

        icon:
          ShieldCheck,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.designation.view",
        ],
      },


      {
        id:
          "employees",

        title:
          "Employees",

        path:
          "/employees",

        icon:
          Users,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.employee.view",
        ],
      },
    ],
  },


  {
    id:
      "inventory",

    title:
      "Inventory",

    path:
      "/inventory",

    icon:
      Boxes,

    portals:
      COMPANY_PORTAL,
  },


  {
    id:
      "finance",

    title:
      "Finance",

    path:
      "/finance",

    icon:
      Landmark,

    portals:
      COMPANY_PORTAL,
  },


  {
    id:
      "reports",

    title:
      "Reports",

    path:
      "/reports",

    icon:
      ChartColumn,

    portals:
      COMPANY_PORTAL,
  },


  /*
   * =========================
   * MIXED SETTINGS
   * =========================
   *
   * Parent shared hai.
   * Children portal ke hisaab
   * se filter honge.
   */
  {
    id:
      "settings",

    title:
      "Settings",

    path:
      "#",

    icon:
      Settings,

    children: [
      /*
       * PLATFORM settings
       */
      {
        id:
          "platform-users",

        title:
          "Platform Users",

        path:
          "/settings/platform-users",

        icon:
          UsersRound,

        portals:
          PLATFORM_PORTAL,

        /*
         * Temporary compatibility
         * until Sidebar migration.
         */
        userTypes: [
          "PLATFORM_OWNER",
        ],
      },


      {
        id:
          "permissions",

        title:
          "Permissions",

        path:
          "/settings/permissions",

        icon:
          ShieldCheck,

        portals:
          PLATFORM_PORTAL,
      },


      /*
       * COMPANY settings
       */
      {
        id:
          "users",

        title:
          "Users",

        path:
          "/settings/users",

        icon:
          UserCog,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.user.view",
        ],
      },


      {
        id:
          "company-profile",

        title:
          "Company Profile",

        path:
          "/settings/company-profile",

        icon:
          Building2,

        portals:
          COMPANY_PORTAL,
      },


      {
        id:
          "organization-unit",

        title:
          "Organization Unit",

        path:
          "/settings/organization-units",

        icon:
          Building,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.organization_unit.view",
        ],
      },


      {
        id:
          "roles",

        title:
          "Roles",

        path:
          "/settings/roles",

        icon:
          ShieldCheck,

        portals:
          COMPANY_PORTAL,

        permissions: [
          "company.role.view",
        ],
      },


      /*
       * Shared profile.
       *
       * No portals means every
       * authenticated portal can see it.
       */
      {
        id:
          "user-profile",

        title:
          "User Profile",

        path:
          "/settings/profile",

        icon:
          UserRound,
      },
    ],
  },
];