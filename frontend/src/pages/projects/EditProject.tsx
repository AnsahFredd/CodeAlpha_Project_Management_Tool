import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { ROUTES } from "../../config/routes";
import { projectService } from "../../api/services/project.service";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import type { ProjectForm } from "../../interfaces";
import { PROJECT_STATUS, TASK_PRIORITY } from "../../utils/contants";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshProjects } = useProjects();

  const [formData, setFormData] = useState<ProjectForm>({
    name: "",
    description: "",
    status: PROJECT_STATUS.PLANNING,
    priority: TASK_PRIORITY.MEDIUM,
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Partial<ProjectForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    if (!id) return;
    setIsFetching(true);
    try {
      const project = await projectService.getProjectById(id);
      setFormData({
        name: project.name,
        description: project.description || "",
        status: project.status,
        priority: project.priority || TASK_PRIORITY.MEDIUM,
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
      });
    } catch (err) {
      setError("Failed to load project details.");
    } finally {
      setIsFetching(false);
    }
  };

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
    if (!id || !validate()) return;

    setIsLoading(true);
    try {
      await projectService.updateProject(id, formData);
      await refreshProjects();
      navigate(ROUTES.PROJECT_DETAIL(id));
    } catch {
      setError("Failed to update project");
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

  if (isFetching) return <Loading fullScreen text="Loading project..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to={ROUTES.PROJECT_DETAIL(id!)}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Edit Project</h1>
          <p className="text-text-secondary mt-1">
            Update project details and settings
          </p>
        </div>
      </div>

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
                rows={4}
                className="w-full px-4 py-2 border border-border-color rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border-color rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                required
              >
                <option value={PROJECT_STATUS.PLANNING}>Planning</option>
                <option value={PROJECT_STATUS.ACTIVE}>Active</option>
                <option value={PROJECT_STATUS.ON_HOLD}>On Hold</option>
                <option value={PROJECT_STATUS.COMPLETED}>Completed</option>
                <option value={PROJECT_STATUS.CANCELLED}>Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-border-color rounded-lg bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all"
                required
              >
                <option value={TASK_PRIORITY.LOW}>Low</option>
                <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                <option value={TASK_PRIORITY.HIGH}>High</option>
                <option value={TASK_PRIORITY.URGENT}>Urgent</option>
              </select>
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
            <Link to={ROUTES.PROJECT_DETAIL(id!)}>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isLoading}
              className="shadow-lg shadow-primary/20"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
