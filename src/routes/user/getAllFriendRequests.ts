import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import Friend from "../../model/friend";
import Const from "../../helpers/constant";

//@ts-ignore
const handler: Handler<"getAllFriendRequests"> = async (request, { user }) => {
    try {
        const { currentPage } = request;

        const totalFriendRequests = await Friend.countDocuments({
            friendId: user.userId,
            status: Const.FRIEND_REQUEST_PENDING
        });

        const friends = await Friend.find({ friendId: user.userId, status:Const.FRIEND_REQUEST_PENDING })
        .skip((currentPage as number - 1) * Const.RECORDS_PER_PAGE)
        .limit(Const.RECORDS_PER_PAGE)
        .populate("userId", "_id firstName lastName userName email phone dateOfBirth gender photoUrl createdAt updatedAt");
        // return friends || [];

        const hasNextPage = (currentPage as number) * Const.RECORDS_PER_PAGE < totalFriendRequests;

    return {
        friends,
        hasNextPage
    };
      
    } catch (error) {
        throw new Boom('No Record Found' , {statusCode: NOT_FOUND})
    }
};

export default handler;
