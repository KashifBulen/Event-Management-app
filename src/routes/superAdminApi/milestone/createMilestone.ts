import { Handler } from "../../../utils/make-api";
import { Boom } from "@hapi/boom";
import Milestone from "../../../model/milestone";
import { NOT_FOUND, BAD_REQUEST} from "http-status";
import { Document } from "mongoose";


const handler: Handler<"createMilestone"> = async (request) => {
  

    const { milestoneName, xp , photoUrl, completionTiming  , eventTypeIds} = request;
    
  

    if (!milestoneName || !xp ||  !completionTiming) {
      throw new Boom("MilestoneName, xp, and milestone Completion timing is required", {
        statusCode: BAD_REQUEST,
      });
    }
    const isMilestoneExist = await Milestone.findOne({
      milestoneName: milestoneName,
    });

    if (!isMilestoneExist) {
      const newMilestone = await Milestone.create({
        ...request,
      });

     
      return newMilestone;
    } else {
      throw new Boom("Milestone with the same name already exists.", {
        statusCode: BAD_REQUEST,
      });
    }

};

export default handler;
