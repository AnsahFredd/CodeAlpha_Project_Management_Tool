import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Alert from "../../components/common/Alert";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { formatDate } from "../../utils/formateDate";
import { getInitials } from "../../utils/helpers";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="p-6 max-w-md w-full text-center">
          <Alert type="error">User not found</Alert>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // In a real app, you'd call an API to update the user
    // For now, we'll just update the local state
    try {
      updateUser({ ...user, ...formData });
      setSuccess(true);
      setIsEditing(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project. Please try again."
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Profile</h1>
        <p className="text-secondary">Manage your account settings</p>
      </div>

      {success && (
        <Alert type="success" onClose={() => setSuccess(false)} dismissible>
          Profile updated successfully!
        </Alert>
      )}

      {error && (
        <Alert type="error" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">
                Personal Information
              </h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-color">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <p className="mt-1 text-primary">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="mt-1 text-primary">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role
                  </label>
                  <p className="mt-1 text-primary capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </label>
                  <p className="mt-1 text-primary">
                    {user.createdAt
                      ? formatDate(user.createdAt, "long")
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Profile Picture & Stats */}
        <div className="space-y-6">
          <Card>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-light mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-24 w-24 rounded-full"
                  />
                ) : (
                  <span className="text-primary text-3xl font-bold">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-primary">
                {user.name}
              </h3>
              <p className="text-sm text-secondary">{user.email}</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-primary mb-4">
              Account Settings
            </h2>
            <div className="space-y-3">
              <Button variant="outline" fullWidth>
                Change Password
              </Button>
              <Button variant="outline" fullWidth>
                Notification Settings
              </Button>
              <Button variant="danger" fullWidth>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
