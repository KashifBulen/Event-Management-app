import { Handler } from "../../../utils/make-api";
import Theme from "../../../model/theme";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

const handler: Handler<"deleteTheme"> = async (request) => {
  const id = request.id;

  // Check if the milestone exists
  const isMilestoneExist = await Theme.findById({ _id: id });
  if (!isMilestoneExist) {
    throw new Boom("Theme does not exist", { statusCode: NOT_FOUND });
  }

  // Delete the milestone
  const deletedTheme = await Theme.findByIdAndDelete({ _id: id });
  if (!deletedTheme) {
    throw new Boom("Failed to delete Theme", { statusCode: BAD_REQUEST });
  }

  return { message: "Theme deleted successfully" };
};

export default handler;
