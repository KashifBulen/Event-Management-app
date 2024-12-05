import { Handler } from "../../../utils/make-api";
import Milestone from "../../../model/milestone";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND} from "http-status";

const handler: Handler<"updateMilestone"> = async (request) => {

 
    const id = request.id
    const updatedFields = { ...request };
    const isMilestoneExist = await Milestone.findById({ _id : id});
    if (!isMilestoneExist) {
      throw new Boom("milestone does not Exist", { statusCode: BAD_REQUEST });
    } else {
      const updatedMilestone = await Milestone .findByIdAndUpdate(
        { _id:id},
        { $set: updatedFields , updatedAt: Date.now()},
        { new: true }
      );

      if (!updatedMilestone ) {
        throw new Boom("milestone Not Updated, Something went wrong", {
          statusCode: BAD_REQUEST,
        });
      }
      
      return updatedMilestone.toObject();
    }

 
};

export default handler;