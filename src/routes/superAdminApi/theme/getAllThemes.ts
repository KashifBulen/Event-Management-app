import { Handler } from "../../../utils/make-api";
import Theme from "../../../model/theme";
import { Boom } from "@hapi/boom";
import { NOT_FOUND, BAD_REQUEST } from "http-status";

const handler: Handler<"getAllThemes"> = async (request) => {
  const themes = await Theme.find({});

  if (!themes || themes.length === 0) {
    throw new Boom("Themes not found", { statusCode: NOT_FOUND });
  } else {
    return themes;
  }
};

export default handler;
