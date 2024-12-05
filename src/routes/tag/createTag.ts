import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import Tag from "../../model/tag";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status";
// import mongoose from "mongoose";

const handler: Handler<"createTag"> = async (request, { user }) => {
  console.log('user', user)
  const { tagText } = request;

  console.log('tagText', tagText)
  try {
    const isTagExist = await Tag.findOne({ tagText });

    if (isTagExist) {
      throw new Boom("Tag with the same text already exists.", {
        statusCode: BAD_REQUEST,
      });
    }

    const newTag = await Tag.create({ tagText, userId: user.userId, priority: 5 });
    if (!newTag) {
      throw new Boom("Failed to create tag.", {
        statusCode: BAD_REQUEST,
      });
    } else {
      return newTag
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Boom(error.message, { statusCode: BAD_REQUEST });
    } else {
      throw new Boom("An unexpected error occurred", { statusCode: INTERNAL_SERVER_ERROR });
    }
  }
};

export default handler;
