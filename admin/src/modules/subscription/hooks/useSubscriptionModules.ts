import { useState } from "react";

import {
  assignSubscriptionModules,
  getModules,
  getSubscriptionModules,
} from "../api/subscription.api";

import type {
  Module,
} from "../types/subscription-module.types";

export const useSubscriptionModules =
  () => {
    const [loading, setLoading] =
      useState(false);

    const [modules, setModules] =
      useState<Module[]>([]);

    const [
      selectedModules,
      setSelectedModules,
    ] = useState<string[]>([]);

    const fetchModules =
      async (
        planId: string,
      ) => {
        setLoading(true);

        try {
          const [
            allModules,
            assignedModules,
          ] =
            await Promise.all([
              getModules(),
              getSubscriptionModules(
                planId,
              ),
            ]);

          setModules(allModules);

          setSelectedModules(
            assignedModules,
          );
        } finally {
          setLoading(false);
        }
      };

    const toggleModule = (
      moduleId: string,
    ) => {
      setSelectedModules(
        (prev) =>
          prev.includes(moduleId)
            ? prev.filter(
                (id) =>
                  id !== moduleId,
              )
            : [
                ...prev,
                moduleId,
              ],
      );
    };

    const saveModules =
      async (
        planId: string,
      ) => {
        setLoading(true);

        try {
          await assignSubscriptionModules(
            planId,
            selectedModules.map(
              Number,
            ),
          );
        } finally {
          setLoading(false);
        }
      };

    return {
      loading,

      modules,

      selectedModules,

      fetchModules,

      toggleModule,

      saveModules,
    };
  };