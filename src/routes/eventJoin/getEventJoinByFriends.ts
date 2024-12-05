import { Handler } from "../../utils/make-api";
import Event from "../../model/event";
import EventJoinInvite from "../../model/eventJoinInvite";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import mongoose from 'mongoose';
import Const from "../../helpers/constant";
import Friend from "../../model/friend";
import User from "../../model/user";
import eventJoin from "../../model/eventJoin";
//@ts-ignore
const handler: Handler<"getEventJoinByFriends"> = async (request, { user }) => {

    const userId = user.userId;
    const currentPage = request?.currentPage || 1;
    // console.log('currentPage', currentPage);
    try {


        const friends = await Friend.find({
            status: Const.FRIEND_REQUEST_ACCEPT,
            $or: [
                { userId },
                { friendId: userId }
            ]
        }).select('userId friendId');

        // console.log('javi', friends, userId);
        if (friends) {
            const friendIds = friends.map(friend => {
                return friend.userId === userId ? friend.friendId : friend.userId
            });
            // console.log('FriendListID->', friendIds);

            const match = {
                $or: [
                    { friendId: { $in: friendIds } }, // Retrieve user's friend info
                    { userId: { $in: friendIds } }
                ],
            }

            const pipeline: any = [
                { $match: match },
                {
                    $lookup: {
                        from: "eventjoins",
                        localField: "_id",
                        foreignField: "eventId",
                        as: "joinEvents",
                    }
                },
                {
                    $unwind: "$joinEvents"
                },
                {
                    $project: {
                        eventId: "$joinEvents.eventId",
                        eventTitle: 1,
                        eventPhoto: 1,
                        extraInfo: "$joinEvents.extraInfo",
                        userIdJoinEvent: "$joinEvents.userId",
                        createdAt: "$joinEvents.createdAt"
                    }
                },
                {
                    $match: {
                        userIdJoinEvent: { $ne: userId }
                    }
                },
                {
                    $sort: {
                        createdAt: -1 // Sort joinEvents by createdAt in descending order
                    }
                },
                {
                    $group: {
                        _id: {
                            eventId: "$eventId",
                            eventTitle: "$eventTitle",
                            eventPhoto: "$eventPhoto"
                        },
                        users: {
                            $push: {
                                extraInfo: "$extraInfo",
                                userIdJoinEvent: "$userIdJoinEvent"
                            }
                        }
                    }
                },
                {

                    $skip: (currentPage as number - 1) * Const.RECORDS_PER_PAGE
                },
                {
                    $limit: Const.RECORDS_PER_PAGE
                }
            ];

            const events = await Event.aggregate(pipeline);
            // console.log('Results->', events);
            if (events) {
                for (const evt of events) {
                    const eventsJoin = evt.users;
                    for (const ej of eventsJoin) {
                        let userInfo = await User.findById(ej.userIdJoinEvent);
                        if (!userInfo) userInfo = await User.findById(new mongoose.Types.ObjectId(ej.userIdJoinEvent));

                        if (userInfo) ej.userInfo = {
                            id: userInfo?._id,
                            firstName: userInfo?.firstName,
                            photo: userInfo?.photoUrl
                        }
                    }

                }
            }
            // console.log('Event->', events[0].events);


            const totalEventJoin = await Event.countDocuments(match);
            const hasNextPage = (currentPage as number) * Const.RECORDS_PER_PAGE < totalEventJoin;

            console.log('Data->', totalEventJoin, hasNextPage, events);
            return {
                events,
                hasNextPage
            };
        }
    } catch (error) {
        console.log("error", error);
        throw new Boom("No record found", { statusCode: NOT_FOUND });
    }
};

export default handler;
