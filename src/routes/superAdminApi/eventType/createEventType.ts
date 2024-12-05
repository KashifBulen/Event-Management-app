import { Handler } from "../../../utils/make-api";
import { Boom } from "@hapi/boom";
import EventType from "../../../model/eventType";
import { NOT_FOUND, BAD_REQUEST} from "http-status";


const handler: Handler<"createEventType"> = async (request) => {
    const isEventTypeExist = await EventType.findOne({
        eventTypeName: request.eventTypeName,
    });
    if (!isEventTypeExist) {
      const newEventType= await EventType.create({
        ...request,
      });

     
      return newEventType;
    } else {
      throw new Boom("Event Type Name already exists.", {
        statusCode: BAD_REQUEST,
      });
    }

};

export default handler;