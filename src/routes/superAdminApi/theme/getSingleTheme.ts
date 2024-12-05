import { Handler } from "../../../utils/make-api";
import Theme from "../../../model/theme";
import { Boom } from "@hapi/boom";
import { NOT_FOUND, BAD_REQUEST } from "http-status";

const handler: Handler<"getSingleTheme"> = async (request) => {
  const id = request.id;
  const getTheme = await Theme.findById({ _id: id });

  if (!getTheme) {
    throw new Boom("theme not found", { statusCode: NOT_FOUND });
  } else {
    return getTheme;
  }
};

export default handler;
