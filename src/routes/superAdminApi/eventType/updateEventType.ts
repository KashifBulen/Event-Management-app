import { Handler } from "../../../utils/make-api";
import EventType from "../../../model/eventType";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND} from "http-status";

const handler: Handler<"updateEventType"> = async (request) => {

 
    const id = request.id;

    const updatedFields = { ...request };
    const isEventTypeExist = await EventType.findById({ _id : id});
    if (!isEventTypeExist) {
      throw new Boom("milestone does not Exist", { statusCode: BAD_REQUEST });
    } else {
      const updatedEventType = await EventType .findByIdAndUpdate(
        { _id:id},
        { $set: updatedFields, updatedAt: Date.now(),},
        { new: true }
      );

      if (!updatedEventType ) {
        throw new Boom("Not Updated, Something went wrong", {
          statusCode: BAD_REQUEST,
        });
      }
      
      return updatedEventType.toObject();
    }

 
};

export default handler;