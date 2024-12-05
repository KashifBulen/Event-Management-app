import { Handler } from "../../../utils/make-api";
import { Boom } from "@hapi/boom";
import EventType from "../../../model/eventType";
import { NOT_FOUND, BAD_REQUEST} from "http-status";


const handler: Handler<"getAllEventType"> = async (request) => {

  const allEventType = await EventType.find({});

  if (!allEventType) {
    throw new Boom('Error retrieving all event types', {
      statusCode: BAD_REQUEST,
    });
  } else {
    return  allEventType ;
  

};
};
export default handler;