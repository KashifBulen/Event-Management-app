import { Handler } from "../../utils/make-api";
import Event from "../../model/event";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import mongoose from 'mongoose';
import Const from "../../helpers/constant";
import geospatial from "../../model/geospatial";

//@ts-ignore
const handler: Handler<"getEventsByCompanyId"> = async (request, { user }) => {
  let isDraft: any = false;
  // let page = request?.pageNo || 1;
  // page = page - 1;
  const { currentPage } = request;
  if (request.isDraft) isDraft = true;
  const companyId = new mongoose.Types.ObjectId(user.companyId);

  const match = { companyId, isDraft }

  try {
    const  eventIds= await Event.find({companyId:companyId}).select("_id");
    console.log("eventIds",eventIds)
    const  locations = await geospatial.find({eventId:{$in:eventIds}});
    let pipeline: any = [
      { $match: match },
      {
        $lookup: {
          from: "themes", // collection name in db
          localField: "themeId",
          foreignField: "_id",
          as: "ThemeData",
        }
      },
      {
        $lookup: {
          from: "tags", // collection name in db
          localField: "tag",
          foreignField: "_id",
          as: "tagData",
        }
      }
    ];
    if (!isDraft) {
      pipeline = [
        { $match: match },
        {
          $lookup: {
            from: "themes", // collection name in db
            localField: "themeId",
            foreignField: "_id",
            as: "ThemeData",
          }
        },
        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "companyData",
          }
        },
        {
          $lookup: {
            from: "tags", // collection name in db
            localField: "tag",
            foreignField: "_id",
            as: "tagData",
          }
        },
        {
          $lookup: {
            from: "comments", // collection name in db
            localField: "_id",
            foreignField: "eventId",
            as: "comments",
          }
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "eventId",
            as: "likes",
          }
        },
        {
          $lookup: {
            from: "eventjoins",
            localField: "_id",
            foreignField: "eventId",
            as: "liveEvents",
          }
        },
        {
          $unwind: "$companyData"
        },
        {
          $addFields: {
            companyName: '$companyData.name',
            companyShortDescription: '$companyData.shortDescription',
            companyPhoto: '$companyData.photoUrl',
            liveEvents: { $size: '$liveEvents' },
            totalComments: { $size: '$comments' },
            totalLikes: { $size: '$likes' },
            eventTypeData: {
              $mergeObjects: [
                "$eventTypeData",
                {
                  locations: {
                    $filter: {
                      input: locations,
                      as: "location",
                      cond: {
                        $eq: ["$$location.eventId", "$_id"],
                      },
                    },
                  },
                },
              ],
            },
          }
        },
        {
          $project: {
            comments: 0, // Optional: Remove the comments array from the output
            likes: 0
          }
        },
        // { $skip: limit.RECORDS_PER_PAGE * page },
        // { $limit: limit.RECORDS_PER_PAGE },
        {
          $facet: {
            events: [
              {
                $skip: (currentPage as number - 1) * Const.RECORDS_PER_PAGE // Skip documents based on the current page
              },
              {
                $limit: Const.RECORDS_PER_PAGE // Limit the number of documents per page
              }
            ],
            hasNextPage: [
              {
                $skip: currentPage as number * Const.RECORDS_PER_PAGE // Skip one more batch of documents
              },
              {
                $limit: 1 // Limit the number of documents to 1 to check for existence
              }
            ]
          }
        }
      ];
    }

    const result = await Event.aggregate(pipeline);
    let events = result[0].events;
    const hasNextPage = result[0].hasNextPage.length > 0;
    return {
      events,
      hasNextPage
    };
    /*const event = await Event.aggregate(pipeline);
    // const event = await Event.find({companyId:user.companyId,isDraft:false});
    if (!event || event.length === 0) {
      throw new Boom("No record found", { statusCode: NOT_FOUND });
    } else {
      return event;
    }//*/
  } catch (error: any) {
    console.log("error", error);
    throw new Boom(error, { statusCode: NOT_FOUND });
  }
};

export default handler;
