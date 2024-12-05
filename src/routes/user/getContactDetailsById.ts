import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { INTERNAL_SERVER_ERROR } from "http-status";
import status from "../../helpers/constant";
import Friend from "../../model/friend";

const handler: Handler<"getContactDetailsById"> = async (request, { user }) => {
  let { id } = request;
  try {


    let contacts = await User.aggregate([
      {
        $lookup: {
          from: "friends",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    // { $eq: ["$userId", "$$friendId"] },
                    {
                      $in: [
                        "$status",
                        [status.FRIEND_REQUEST_ACCEPT, status.FRIEND_REQUEST_PENDING],
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "friendInfo",
        },
      },
      {
        $lookup: {
          from: "tags", // Collection name for the Tag model
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
              },
            },
          ],
          as: "tags",
        },
      },
      {
        $match: { _id: id },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          userName: 1,
          email: 1,
          phone: 1,
          gender: 1,
          dateOfBirth: 1,
          photoUrl: 1,
          isFriend: {
            $cond: {
              if: { $gt: [{ $size: "$friendInfo" }, 0] },
              then: true,
              else: false,
            },
          },
          profession: 1,
          address: 1,
          tags: 1,
          friendInfo: 1
        },
      },
    ]);
    //*/     

    // return contacts?.[0] || {}
    if (contacts?.[0]) {
      //Need to check on both user logins so for mututal friendship 
      let isFriend = await Friend.findOne({
        friendId: user.userId,
        userId: id
      }).sort({createdAt:-1});
      
      if (!isFriend) {
        isFriend = await Friend.findOne({
        userId: user.userId,
        friendId: id
      }).sort({createdAt:-1});
    }
      let temp = contacts[0];
      temp.friend = isFriend;
      return temp;
    } else return {};

  } catch (e) {
    throw new Boom('There is some issue in request', { statusCode: INTERNAL_SERVER_ERROR })
  }
}

export default handler;
