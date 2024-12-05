import { Handler } from "../../utils/make-api";
import User from "../../model/user";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import Const from "../../helpers/constant";

const handler: Handler<"getAllContacts"> = async (request, { user }) => {
  let { currentPage, searchTerm } = request;
  let where = {};
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    where = {
      $or: [
        { firstName: regex },
        { lastName: regex }
      ]
    }
  }
  try {
    /*
    Search all contacts inside platform
    */
    const pipeline = [];

    // Check if a searchTerm parameter is provided
    if (searchTerm) {
      pipeline.push({
        $match: {
          _id: { $ne: user.userId },//Do not include loggedin user
          $or: [
            { firstName: { $regex: searchTerm, $options: "i" } },
            { lastName: { $regex: searchTerm, $options: "i" } },
          ],
        },
      });
    } else {
      pipeline.push({
        $match: {
          _id: { $ne: user.userId } //Do not include loggedin user
        },
      });
    }

    pipeline.push(
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
                    { $in: ["$status", [Const.FRIEND_REQUEST_ACCEPT, Const.FRIEND_REQUEST_PENDING]] },
                  ],
                },
              },
            },
          ],
          as: "friendInfo",
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          username: 1,
          email: 1,
          phone: 1,
          gender: 1,
          photoUrl: 1,
          address: 1,
          profession: 1,
          isFriend: {
            $cond: {
              if: { $gt: [{ $size: "$friendInfo" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      // {
      //   $skip: (currentPage as number - 1) * Const.RECORDS_PER_PAGE // Skip documents based on the current page
      // },
      // {
      //   $limit: Const.RECORDS_PER_PAGE // Limit the number of documents per page
      // },
      {
        $facet: {
          contacts: [
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
    // const contacts = await User.aggregate(pipeline);
    // return contacts || []

    const result = await User.aggregate(pipeline);

    let contacts = result[0].contacts;
    const hasNextPage = result[0].hasNextPage.length > 0;
    return {
      contacts,
      hasNextPage
    };

  } catch (error) {
    console.log('error',error);
    throw new Boom('No Record Found', { statusCode: NOT_FOUND })
  }
};

export default handler;
