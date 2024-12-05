import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import Friend from "../../model/friend";
import Const from "../../helpers/constant";

//@ts-ignore
const handler: Handler<"getAllFriends"> = async (request, { user }) => {
    try {
        const { currentPage, searchTerm } = request;
        const pipeline = [];
        pipeline.push(
            {
                $lookup: {
                    from: "users", // Assuming the collection name is "users"
                    localField: "userId",
                    foreignField: "_id",
                    as: "userFriendInfo",
                },
            },
            {
                $unwind: "$userFriendInfo",
            },
            {
                $lookup: {
                    from: "users", // Assuming the collection name is "users"
                    localField: "friendId",
                    foreignField: "_id",
                    as: "friendFriendInfo",
                },
            },
            {
                $unwind: "$friendFriendInfo",
            }
        );

        // Make sure $match add after $lookup
        if (searchTerm) {
            pipeline.push({
                $match: {
                    status: Const.FRIEND_REQUEST_ACCEPT,
                    $or: [
                        { friendId: user.userId }, // Retrieve user's friend info
                        { userId: user.userId }
                    ],
                    $and: [
                        {
                            $or: [
                                { "userFriendInfo.firstName": { $regex: searchTerm, $options: "i" } },
                                { "userFriendInfo.lastName": { $regex: searchTerm, $options: "i" } }
                            ]
                        }
                    ]
                },
            });
        } else {
            pipeline.push({
                $match: {
                    status: Const.FRIEND_REQUEST_ACCEPT,
                    $or: [
                        { friendId: user.userId }, // Retrieve user's friend info
                        { userId: user.userId },   // Retrieve user's info
                    ]
                },
            });
        }

        pipeline.push(
            {
                $project: {
                    friendsArray: {
                        $cond: [
                            { $eq: ["$userId", user.userId] },
                            "$friendFriendInfo",
                            "$userFriendInfo"
                        ]
                    }
                },
            },
            {
                $group: {
                    _id: null,
                    friends: { $addToSet: "$friendsArray" }
                },
            },
            // {
            //     $skip: (currentPage || 1 as number - 1) * Const.RECORDS_PER_PAGE // Skip documents based on the current page
            // },
            // {
            //     $limit: Const.RECORDS_PER_PAGE // Limit the number of documents per page
            // }
            {
                $facet: {
                  friends: [
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
        );
        const result = await Friend.aggregate(pipeline);
        console.log('Result',result);
        let friends = result[0].friends;
    const hasNextPage = result[0].hasNextPage.length > 0;
    return {
        friends,
      hasNextPage
    };
        // const friends = await Friend.aggregate(pipeline);
        // return friends || [];

    } catch (error) {
        throw new Boom('No Record Found', { statusCode: NOT_FOUND })
    }
};

export default handler;
