import express from "express";
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  inviteTeamMember,
  removeTeamMember,
  updateMemberRole,
} from "../controllers/team.controller";
import { protect } from "../middleware/auth";

const router = express.Router();

router.use(protect);

router.route("/").get(getTeams).post(createTeam);
router.route("/:id").get(getTeam).put(updateTeam).delete(deleteTeam);

router.post("/:id/members", addTeamMember);
router.post("/:id/invite", inviteTeamMember);
router
  .route("/:id/members/:userId")
  .delete(removeTeamMember)
  .patch(updateMemberRole);

export default router;
