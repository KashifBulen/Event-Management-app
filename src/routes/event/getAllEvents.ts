import { Handler } from "../../utils/make-api";
import Event from "../../model/event";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import { ObjectId, PipelineStage } from 'mongoose';
import Const, { getMongooseObjectId } from "../../helpers/constant";
import moment from 'moment';
import mongoose, { Types } from 'mongoose';
import geospatial from "../../model/geospatial";


interface Match {
  _id?: any;
  isDraft: boolean;
  createdAt?: { $gte: Date, $lte?: Date };
  eventTypeId?: any; 
  // tag?:{}; // Assuming tags are stored as an array of strings
  // tag?:{$in:string[]};
  tag?: {};
  eventTitle?: {};
}

const handler: Handler<"getAllEvents"> = async (request, { user }) => {
  const { startDate, endDate, eventType, tags, lat, lng, now, search,currentPage=1} = request;
  //remember: always assign number to "current Page = 1" while testing with postman...
  try {

    let location
    if (lat && lng && lat !== "null"&& lat!== "undefined" && lng !== "null"&&lng !== "undefined")
      location = {
        lat: lat,
        lng: lng
      }
    const match: Match = { isDraft: false };
    console.log("request:", request)
    if (startDate && endDate && (startDate || endDate !== null || '' || undefined) && (startDate || endDate !== null || '' || undefined)) {
      match.createdAt = { $gte: new Date(startDate) }
      if (endDate) {
        match.createdAt.$lte = new Date(endDate);
      }
    }

    if (eventType && (eventType !== null || "" || undefined)) {
      
      const eventTypeIds=eventType.map((item:string)=>{
       return getMongooseObjectId(item)
      })

      match.eventTypeId = { $in: eventTypeIds };
    }

    if (
      tags &&
      (Array.isArray(tags) || (typeof tags === 'string' && (tags as string).trim() !== ''))
    ) {
      const tagArray = Array.isArray(tags) ? tags : ((tags as unknown) as string).split(',').map(tag => tag.trim());
      const mappedTagIds: Types.ObjectId[] = tagArray.map(getMongooseObjectId);
      match.tag = { $in: mappedTagIds };
    }
    //@ts-ignore
    if (now && now !== 'null' && now !== 'false' && now !== undefined) {
      const currentDate = moment.utc(new Date(), 'YYYY-MM-DD').startOf('day').toDate();
      const nextDate = moment(currentDate).add(1, 'days').toDate();
      match.createdAt = { $gte: currentDate, $lte: nextDate };
    }

    if (search && (search !== null || "")) {
      match.eventTitle = { $regex: search, $options: "ix" }
    }
    console.log("request:", request)
    let locations;
    if (location && location?.lat && location?.lng) {
      locations = await geospatial.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(location.lat as string), parseFloat(location.lng as string)],
            },
            $maxDistance: 2000,
          },
        },
      });
    } else {
      locations = await geospatial.find({});
    }

    if (location && location?.lat && location?.lng) {
      match._id = { $in: locations.map(item => item.eventId) }
    }

    console.log("match:", match)
    const pipeline: PipelineStage[] = [
      {
        $match: match
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
          from: "themes", // collection name in db
          localField: "themeId",
          foreignField: "_id",
          as: "ThemeData",
        }
      }
      ,
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
          from: "favorites",
          localField: "_id",
          foreignField: "eventId",
          as: "favoriteEvents",
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
          companyDescription: '$companyData.bestDescribeYou',
          companyShortDescription: '$companyData.shortDescription',
          companyPhoto: '$companyData.photoUrl',
          totalComments: { $size: '$comments' },
          totalLikes: { $size: '$likes' },
          liveEvents: { $size: '$liveEvents' },
          likedByUser: {
            $in: [user.userId, '$likes.userId']
          },
          totalFavorite: { $size: '$favoriteEvents' },
          favoriteByUser: {
            $in: [user.userId, '$favoriteEvents.userId']
          },
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
          likes: 0,
          companyData: 0,
          favoriteEvents: 0,
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
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
    const result = await Event.aggregate(pipeline);
    let events = result[0].events;
    // console.log('events', events);
    const hasNextPage = result[0].hasNextPage.length > 0;
    return {
      events,
      hasNextPage
    };

    // const event = await Event.aggregate(pipeline);
    // if (!event || event.length === 0) {
    //   throw new Boom("No record found", { statusCode: NOT_FOUND });
    // } else {
    //   return event;
    // }
  } catch (error) {
    console.log("error", error);
    throw new Boom("No record found", { statusCode: NOT_FOUND });
  }
};

export default handler;
