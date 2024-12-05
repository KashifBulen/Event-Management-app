import { Handler } from "../../utils/make-api";
import Comment from "../../model/comment";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import mongoose from 'mongoose';
import limit from "../../helpers/constant";

const handler: Handler<"getAllComments"> = async (request) => {
    const eventId = new mongoose.Types.ObjectId(request?.eventId);
    let page = request?.pageNo || 1;

    page = page - 1;
    const comments = await Comment.aggregate([
        {$match:{eventId}},
        {
            $lookup:{
                from: "users", 
                localField: "userId",
                foreignField: "_id",
                as: "userData",
            }
        },
        { $skip: limit.RECORDS_PER_PAGE * page },
        { $limit: limit.RECORDS_PER_PAGE },
    ]);
  if (!comments || comments.length === 0) {
    throw new Boom("No comment found", { statusCode: NOT_FOUND });
  } else {
    return comments;
  }
};

export default handler;
