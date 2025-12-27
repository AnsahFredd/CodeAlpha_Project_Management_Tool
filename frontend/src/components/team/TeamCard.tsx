import { Link } from "react-router-dom";
import { Users, FolderKanban } from "lucide-react";
import Card from "../common/Card";
import { ROUTES } from "../../config/routes";
import type { Team, User } from "../../interfaces";

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  const membersCount = Array.isArray(team.members) ? team.members.length : 0;
  const projectsCount = Array.isArray(team.projects) ? team.projects.length : 0;

  return (
    <Link to={ROUTES.TEAM_DETAIL(team._id)}>
      <Card hover padding="lg" className="h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-primary line-clamp-2 flex-1">
            {team.name}
          </h3>
        </div>

        {team.description && (
          <p className="text-sm text-secondary mb-4 line-clamp-2">
            {team.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-secondary mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{membersCount} members</span>
          </div>
          <div className="flex items-center gap-1">
            <FolderKanban className="h-4 w-4" />
            <span>{projectsCount} projects</span>
          </div>
        </div>

        {/* Members Preview */}
        {membersCount > 0 && (
          <div className="flex items-center pt-4 border-t border-border-color">
            <div className="flex -space-x-2">
              {Array.isArray(team.members) &&
                team.members
                  .slice(0, 5)
                  .map((member: string | User, index: number) => {
                    const user = typeof member === "object" ? member : null;
                    return (
                      <div
                        key={index}
                        className="h-8 w-8 rounded-full bg-primary-light border-2 border-bg-primary flex items-center justify-center"
                        title={user?.name || "Unknown User"}
                      >
                        <span className="text-primary text-xs font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    );
                  })}
              {membersCount > 5 && (
                <div className="h-8 w-8 rounded-full bg-bg-tertiary border-2 border-bg-primary flex items-center justify-center">
                  <span className="text-secondary text-xs font-medium">
                    +{membersCount - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
