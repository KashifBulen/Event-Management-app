import { Handler } from "../../../utils/make-api";
import EventType from "../../../model/eventType";
import { Boom } from "@hapi/boom";
import { NOT_FOUND, BAD_REQUEST } from "http-status";

const handler: Handler<"getSingleEventType"> = async (request) => {
  const id = request.id;
  const getEventType = await EventType.findById({ _id: id });
  if (!getEventType) {
    throw new Boom("eventType not found", { statusCode: NOT_FOUND });
  } else {
    return getEventType;
  }
};

export default handler;
