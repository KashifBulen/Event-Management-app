import { Handler } from "../../utils/make-api";
import Event from "../../model/event";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import mongoose from 'mongoose'
import EventJoin from "../../model/eventJoin";
import EventJoinInvite from "../../model/eventJoinInvite";
import User from "../../model/user";
import Constants from "../../helpers/constant";
import geospatial from "../../model/geospatial";

//@ts-ignore
const handler: Handler<"getSingleEvent"> = async (request, { user }) => {

  const eventId = new mongoose.Types.ObjectId(request?.id);
  const match = { isDraft: false, _id: eventId }
 const  locations = await geospatial.find({eventId:eventId});

  try {

    const pipeline = [
      { $match: match },
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
          from: "favorites",
          localField: "_id",
          foreignField: "eventId",
          as: "favoriteEvents",
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
          favoriteEvents: 0
        }
      }
    ];

    let event = await Event.aggregate(pipeline);
    console.log("event:",event)
    const invitationToJoinThisEvent = await EventJoinInvite.findOne({
      eventId,
      receiverId: user.userId,
      status: Constants.FRIEND_REQUEST_PENDING
    });
  //  console.log('Javed', event, event[0].eventMilestoneList);


    const milestone = event[0].eventMilestoneList.find((item: any) => item.milestoneIdentifier === 'MAKE_PHOTO');
    const makePhotoMilestoneId = milestone ? milestone?.milestoneId : null;

    if (invitationToJoinThisEvent) {
      const inviteeId = invitationToJoinThisEvent.senderId;
      let inviteeUser = await User.findOne({ _id: inviteeId });
      if (!inviteeUser) inviteeUser = await User.findOne({ _id: new mongoose.Types.ObjectId(inviteeId) });

      event[0].hasJoinInvitation = inviteeUser;
    }
    else event[0].hasJoinInvitation = null;

    const eventUserInteraction = await EventJoin.find({
      eventId
    })
      .populate('userId', '-password -otp')
      .select('extraInfo milestonesCompleted');

    console.log('eventUserInteraction', eventUserInteraction)
    if (eventUserInteraction) {
      const usersJoinEvent = [];
      for (let ms of eventUserInteraction) {
        console.log('INSIDE->', makePhotoMilestoneId, makePhotoMilestoneId.toString(), ms.milestonesCompleted);
        if (ms.milestonesCompleted.length > 0) {
          const makePhotoMilestoneExist = ms.milestonesCompleted.some(item => item.milestoneId.toString() === makePhotoMilestoneId.toString());
          //@ts-ignore
          if (makePhotoMilestoneExist) usersJoinEvent.push(ms);
        }
      }

      console.log('HEYT MAN', usersJoinEvent);

      event[0].userInteraction = usersJoinEvent;// eventUserInteraction
    }

    // const event = await Event.find({companyId:user.companyId,isDraft:false});
    // const totalComments = await Event.aggregate([
    //     {
    //       $lookup:{
    //           from: "comments", // collection name in db
    //           localField: "_id",
    //           foreignField: "eventId",
    //           as: "totalComents",
    //       }
    //     }
    // ]);
    // console.log("coments count",totalComments.length);
    if (!event || event.length === 0) {
      throw new Boom("No record found", { statusCode: NOT_FOUND });
    } else {
      return event[0];
    }
  } catch (error) {
    console.log("error", error);
  }
};

export default handler;
