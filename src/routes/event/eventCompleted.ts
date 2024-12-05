import { CONSTRAINTS } from "cron/dist/constants";
import eventJoin from "../../model/eventJoin";
import { Handler } from "../../utils/make-api";
import { CloudWatchLogs } from "aws-sdk";
import User from "../../model/user"
import { Boom } from "@hapi/boom";
import { BAD_REQUEST } from "http-status";


const handler: Handler<"eventCompleted"> = async (request, { user }) => {

    const { eventId } = request;
    const userId = user.userId;

    if (!userId) {
        throw new Boom("User Id not found ", {
            statusCode: BAD_REQUEST,
        });
    }
    if (eventId) {
        const getEventJoins = await eventJoin.findOne({ eventId, userId, isCompleted: "n" })
        if (getEventJoins) {
            let totalXp = getEventJoins.milestonesCompleted.reduce((sum, milestone) => {
                return sum + milestone.xp;
            }, 0);
            const updateUser = await User.findOneAndUpdate(
                { _id: userId },
                { $inc: { xp: totalXp }, isCompleted: 'y' }
            )?.select("xp");

            const eventRejoin = await eventJoin.findOneAndUpdate({ eventId, userId, isCompleted: "n" },{$set:{isCompleted:"y"}});
            return { _id: updateUser?._id, xp: updateUser?.xp }
        }
        else {
            throw new Boom("No Event joins found ", {
                statusCode: BAD_REQUEST,
            });

        }
    }
    else {
        throw new Boom("Event Id not found ", {
            statusCode: BAD_REQUEST,
        });
    }

};

export default handler;
