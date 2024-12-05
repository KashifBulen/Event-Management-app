import { Request, Response } from "express";
import { Boom } from "@hapi/boom";
import Comment from "../../model/comment";
import { NOT_FOUND, BAD_REQUEST } from "http-status";
import { Handler } from "../../utils/make-api";

const handler: Handler<"createComment"> = async (request, { user }) => {
  const userId = user.userId;
  const { eventId, text } = request;

  if (!text || text.length < 2) {
    throw new Boom(
      "The length of the comment must be at least two characters",
      { statusCode: BAD_REQUEST }
    );
  }

  const newComment = await Comment.create({
    userId,
    eventId,
    text,
  });
  if (!newComment) {
    throw new Boom("Error in creating the comment", {
      statusCode: BAD_REQUEST,
    });
  } else {
    return newComment;
  }
};

export default handler;
