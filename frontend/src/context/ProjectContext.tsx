import { useState, useCallback, type ReactNode } from "react";
import { projectService } from "../api";
import type { Project } from "../interfaces";
import { ProjectContext, type ProjectContextType } from "../hooks/useProjects";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: ProjectContextType = {
    projects,
    selectedProject,
    setSelectedProject,
    refreshProjects,
    loading,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}
