import type { ElementType } from "react";


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
  },
  {
    id: "companies",
    title: "Companies",
    path: "/companies",
  },

   {
  id: "modules",
  title: "Modules",
  path: "/modules",
},

 {
    id: "Subscription-plan",
    title: "Subscription Plans",
    path: "/subscription-plans",
  },


  {
  id: "master",
  title: "Master",
  path: "#",
  children: [
    {
      id: "states",
      title: "States",
      path: "/master/states",
    },
    {
      id: "cities",
      title: "Cities",
      path: "/master/cities",
    },
  ],
},



  {
    id: "hr",
    title: "HR",
    path: "#",
    children: [
      {
        id: "departments",
        title: "Departments",
        path: "/departments",
      },
      {
        id: "designations",
        title: "Designations",
        path: "/designations",
      },
      {
        id: "employees",
        title: "Employees",
        path: "/employees",
      },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    path: "/projects",
  },
  {
    id: "inventory",
    title: "Inventory",
    path: "/inventory",
  },
  {
    id: "finance",
    title: "Finance",
    path: "/finance",
  },
  {
    id: "reports",
    title: "Reports",
    path: "/reports",
  },
  {
    id: "settings",
    title: "Settings",
    path: "/settings",
  },
];