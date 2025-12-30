import { Search, Filter } from "lucide-react";
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from "../../utils/contants";
import type { Project } from "../../interfaces";
import { Group, TextInput, Select, Paper } from "@mantine/core";

interface TaskFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  projectFilter: string;
  searchTerm: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onProjectChange: (project: string) => void;
  onSearchChange: (search: string) => void;
  projects: Project[];
}

export default function TaskFilters({
  statusFilter,
  priorityFilter,
  projectFilter,
  searchTerm,
  onStatusChange,
  onPriorityChange,
  onProjectChange,
  onSearchChange,
  projects,
}: TaskFiltersProps) {
  return (
    <Paper p="md" shadow="sm" withBorder radius="md">
      <Group grow align="center">
        {/* Search */}
        <TextInput
          placeholder="Search tasks..."
          leftSection={<Search size={16} />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
        />

        <Group grow align="center" style={{ flex: 3, minWidth: "600px" }}>
          {/* Status Filter */}
          <Select
            placeholder="Status"
            leftSection={<Filter size={16} />}
            value={statusFilter}
            onChange={(value) => onStatusChange(value || "all")}
            data={[
              { value: "all", label: "All Status" },
              ...Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />

          {/* Priority Filter */}
          <Select
            placeholder="Priority"
            value={priorityFilter}
            onChange={(value) => onPriorityChange(value || "all")}
            data={[
              { value: "all", label: "All Priority" },
              ...Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />

          {/* Project Filter */}
          <Select
            placeholder="Project"
            value={projectFilter}
            onChange={(value) => onProjectChange(value || "all")}
            data={[
              { value: "all", label: "All Projects" },
              ...projects.map((project) => ({
                value: project._id,
                label: project.name,
              })),
            ]}
          />
        </Group>
      </Group>
    </Paper>
  );
}
