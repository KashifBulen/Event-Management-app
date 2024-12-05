import { Handler } from "../../utils/make-api";
import Event from "../../model/event"
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

const handler: Handler<"deleteEvent"> = async (request) => {
  const id = request.id;
    // console.log("delete",id);
  // Check if the event exists
  const event = await Event.findById({ _id: id });
  if (!event) {
    throw new Boom("Event does not exist", { statusCode: NOT_FOUND });
  }

  // Delete the event
  const deletedEvent = await Event.findByIdAndDelete({ _id: id });
  if (!deletedEvent) {
    throw new Boom("Failed to delete event", { statusCode: BAD_REQUEST });
  }

  return { message: "Event deleted successfully" };
};

export default handler;
