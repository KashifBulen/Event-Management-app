import { Handler } from "../../../utils/make-api";
import Milestone from "../../../model/milestone";
import { Boom } from "@hapi/boom";
import { NOT_FOUND, BAD_REQUEST } from "http-status";

const handler: Handler<"getSingleMilestone"> = async (request) => {
  try {
    const id = request.id;
    const getMilestoneDetails = await Milestone.findById({_id : id});
    console.log("getMilestoneDetails", getMilestoneDetails);
    
    if (!getMilestoneDetails) {
      throw new Boom("Milestone not found", { statusCode: NOT_FOUND });
    } else {
      return getMilestoneDetails.toObject(); 
    }
  } catch (error) {
    console.log("Error:", error);
    throw new Boom("Something went wrong", { statusCode: BAD_REQUEST });
  }
};

export default handler;
