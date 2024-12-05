import { Handler } from "../../../utils/make-api";
import Milestone from "../../../model/milestone";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

const handler: Handler<"deleteMilestone"> = async (request) => {
  const id = request.id;

  // Check if the milestone exists
  const isMilestoneExist = await Milestone.findById({ _id: id });
  if (!isMilestoneExist) {
    throw new Boom("Milestone does not exist", { statusCode: NOT_FOUND });
  }

  // Delete the milestone
  const deletedMilestone = await Milestone.findByIdAndDelete({ _id: id });
  if (!deletedMilestone) {
    throw new Boom("Failed to delete milestone", { statusCode: BAD_REQUEST });
  }

  return { message: "Milestone deleted successfully" };
};

export default handler;
