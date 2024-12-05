import { Handler } from "../../../utils/make-api";
import EventType from "../../../model/eventType";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

const handler: Handler<"deleteEventType"> = async (request) => {
  const id = request.id;

  // Check if the milestone exists
  const isEventTypeExist = await EventType.findById({ _id: id });
  if (!isEventTypeExist) {
    throw new Boom("EventType does not exist", { statusCode: NOT_FOUND });
  }

  // Delete the milestone
  const deletedEventType = await EventType.findByIdAndDelete({ _id: id });
  if (!deletedEventType) {
    throw new Boom("Failed to delete the EventType", { statusCode: BAD_REQUEST });
  }

  return { message: "EventType deleted successfully" };
};

export default handler;
