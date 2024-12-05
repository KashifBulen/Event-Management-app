import { Handler } from "../../../utils/make-api";
import Milestone from "../../../model/milestone";
import { Boom } from "@hapi/boom";
import { NOT_FOUND, BAD_REQUEST } from "http-status";

interface Milestones {
  milestoneName?: string;
  photoUrl?: string;
  xp?: number;
  completionTiming?: number;
  hasModal?: boolean;
  eventTypeIds?: string[];
}
const handler: Handler<"getAllMilestones"> = async (request) => {
  const { eventTypeId } = request

  
  let allMilestones: Milestones[];
  console.log("eventTypeId:",eventTypeId)
  if (eventTypeId) {
    allMilestones = await Milestone.find({ eventTypeIds: { $in: [eventTypeId] } }).sort({ sequence: 1 });
  }
//@ts-ignore
  if (!allMilestones || allMilestones.length === 0) {
    throw new Boom("No milestones found", { statusCode: NOT_FOUND });
  } else {
    return allMilestones;
  }

};

export default handler;
