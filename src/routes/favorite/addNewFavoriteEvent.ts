import { Boom } from "@hapi/boom";
import Favorite from "../../model/favorite";
import { BAD_REQUEST,OK } from "http-status";
import { Handler } from "../../utils/make-api";
import mongoose from 'mongoose';

const handler: Handler<"addNewFavoriteEvent"> = async (request, { user }) => {
  const userId = user.userId;
  const eventId = new mongoose.Types.ObjectId(request?.eventId);

  if (!eventId) {
    throw new Boom(
      "Please choose an event to add in favorite events!",
      { statusCode: BAD_REQUEST }
    );
  }

  const existingFavoriteEvent = await Favorite.findOne({userId,eventId});
  if(existingFavoriteEvent){
    const RemoveLike = await Favorite.findOneAndDelete({ _id: existingFavoriteEvent._id });
    return { message: "Event removed from favorite list successfully",statusCode:OK };
  }else{
  const newFavoriteEvent = await Favorite.create({
    userId,
    eventId
  });
  if (!newFavoriteEvent) {
    throw new Boom("Error in adding event to favorites!", {
      statusCode: BAD_REQUEST,
    });
  } else {
    return newFavoriteEvent;
  }
 }
};

export default handler;
