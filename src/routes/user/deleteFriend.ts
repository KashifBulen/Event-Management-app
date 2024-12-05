import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import Friend from "../../model/friend";

const handler: Handler<"deleteFriend"> = async (request, { user }) => {
  const id = request.id;

  const query = {
    $or: [
      { friendId: id, userId: user.userId },
      { friendId: user.userId, userId: id }
    ]
  };
  const friend = await Friend.findOne(query).exec();
  if (!friend) {
    throw new Boom("Friend does not exist", { statusCode: NOT_FOUND });
  }
  const deletedFriend = await Friend.deleteOne({ userId: friend.userId, friendId: friend.friendId });
  if (!deletedFriend) {
    throw new Boom("Failed to delete friend", { statusCode: BAD_REQUEST });
  }

  return { message: "Friend deleted successfully" };
};

export default handler;
