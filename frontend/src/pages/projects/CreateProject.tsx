import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { ROUTES } from "../../config/routes";
import { projectService } from "../../api/services/project.service";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import type { ProjectForm } from "../../interfaces";
import { PROJECT_STATUS, TASK_PRIORITY } from "../../utils/contants";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateProject() {
  const navigate = useNavigate();
  const { refreshProjects } = useProjects();
  const [formData, setFormData] = useState<ProjectForm>({
    name: "",
    description: "",
    status: PROJECT_STATUS.PLANNING,
    priority: TASK_PRIORITY.MEDIUM,
    startDate: "",
    endDate: "",
    members: [],
  });
  const [errors, setErrors] = useState<Partial<ProjectForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<ProjectForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (formData.endDate && formData.startDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await projectService.createProject(formData);
      await refreshProjects();
      navigate(ROUTES.PROJECTS);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ||
            "Failed to create project. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProjectForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={ROUTES.PROJECTS}>
          <Button variant="ghost" size="sm" className="hover:bg-bg-tertiary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Create New Project
          </h1>
          <p className="text-text-secondary mt-1">
            Start a new project and organize your work
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-border-subtle shadow-md">
        {error && (
          <Alert
            type="error"
            onClose={() => setError(null)}
            dismissible
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter project name"
                required
                fullWidth
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                rows={4}
                className="w-full px-4 py-2 border border-border-color rounded-lg bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Status <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border-color rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all cursor-pointer"
                  required
                >
                  <option value={PROJECT_STATUS.PLANNING}>Planning</option>
                  <option value={PROJECT_STATUS.ACTIVE}>Active</option>
                  <option value={PROJECT_STATUS.ON_HOLD}>On Hold</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Priority <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border-color rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all cursor-pointer"
                  required
                >
                  <option value={TASK_PRIORITY.LOW}>Low</option>
                  <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                  <option value={TASK_PRIORITY.HIGH}>High</option>
                  <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
            />

            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              fullWidth
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border-color">
            <Link to={ROUTES.PROJECTS}>
              <Button
                type="button"
                variant="ghost"
                className="hover:bg-bg-tertiary"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isLoading}
              className="shadow-lg shadow-primary/20"
            >
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
