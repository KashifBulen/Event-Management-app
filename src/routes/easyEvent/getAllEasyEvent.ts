import { Handler } from "../../utils/make-api";
import EasyEvent from "../../model/easyEvent";
import { Boom } from "@hapi/boom";
import { NOT_FOUND} from "http-status";

const handler: Handler<"getAllEasyEvent"> = async () => {
  const easy = await EasyEvent.find({});
  if (!easy || easy.length === 0) {
    throw new Boom("No record found", { statusCode: NOT_FOUND });
  } else {
    return easy;
  }
};

export default handler;
