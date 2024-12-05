import { Boom } from "@hapi/boom";
import { Handler } from "../../utils/make-api";
import { BAD_REQUEST } from "http-status";
import eventJoin from "../../model/eventJoin";
import  { PipelineStage } from "mongoose";


interface Match {
    userId?: string;
    isCompleted?:string 
}

const handler: Handler<"eventJoinHistory"> = async (request, { user }) => {
    try {

        const { friendId } = request
        const match: Match = {isCompleted:"y"};

        if (friendId) {
            match.userId = friendId
        }
        else {
            match.userId = user?.userId
        }
        console.log("match:", match)
        const getEventHistory: PipelineStage[] = await eventJoin.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: "events",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "eventDetails",
                },

            },
            {
                $unwind:"$eventDetails"
            }
            ,
            {
                $addFields: {
                    eventTitle: "$eventDetails.eventTitle",
                    eventPhoto: "$eventDetails.eventPhoto",
                }

            },
            {
                $project: {
                    _id: 0, 
                    eventTitle: 1,
                    eventPhoto: 1,
                    updatedAt: 1,
                }
            }
        ])
        if (!getEventHistory && friendId) {

            throw new Boom(
                "No friend event history found",
                { statusCode: BAD_REQUEST }
            );
        }
        else if(!getEventHistory){
            throw new Boom(
                "No user event history found",
                { statusCode: BAD_REQUEST }
            );
        }


        return getEventHistory;
    } catch (error) {
        console.error("Error retrieving event history:", error);
        throw new Boom(
            "Internal server error",
            { statusCode: BAD_REQUEST }
        );
    }
};

export default handler;
