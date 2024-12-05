import { Handler } from "../../utils/make-api";
import Tag from "../../model/tag";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import Event from "../../model/event";
import { PipelineStage } from 'mongoose';
import tag from "../../model/tag";

const handler: Handler<"getAllTags"> = async (request) => {
  const { priority } = request;
  try {
    let result: any;
    if (priority && (priority != "null" && priority != "undefined")) {
      const pipeline: PipelineStage[] = [
        {
          $unwind: "$tag"
        },
        {
          $group: {
            _id: "$tag",
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $lookup: {
            from: "tags",
            localField: "_id",
            foreignField: "_id",
            as: "tagData"
          }
        },
        {
          $project: {
            tagText: { $arrayElemAt: ["$tagData.tagText", 0] },
            count: 1
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ];
      result = await Event.aggregate(pipeline);

    }
    else {
      result = await tag.find({}, 'tagText');

    }
    return result;
  } catch (error) {

    throw new Boom("Error fetching tags", { statusCode: 500 });
  }
};




export default handler;