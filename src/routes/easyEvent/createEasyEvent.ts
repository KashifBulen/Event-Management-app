import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import EasyEvent from "../../model/easyEvent";
import { BAD_REQUEST } from "http-status";

const handler: Handler<"createEasyEvent"> = async (request) => {
    const {keyword,title,hasMeta} = request;

  const isEasyEventExist = await EasyEvent.findOne({ keyword });

  if (isEasyEventExist) {
    throw new Boom("Title already exists.", {
      statusCode: BAD_REQUEST,
    });
  }

  const newEasyEvent = await EasyEvent.create({ keyword,title,hasMeta });
  if (!newEasyEvent) {
    throw new Boom("Failed to create easy event.", {
      statusCode: BAD_REQUEST,
    });
  } else {
    return newEasyEvent;
  }
};

export default handler;
