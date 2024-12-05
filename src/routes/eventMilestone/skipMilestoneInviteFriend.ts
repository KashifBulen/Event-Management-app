import { Boom } from "@hapi/boom";
import User from "../../model/user";
import Event from "../../model/event";
import EventJoin from "../../model/eventJoin";
import EventJoinInvite from "../../model/eventJoinInvite";
import { BAD_REQUEST, OK } from "http-status";
import { Handler } from "../../utils/make-api";
import mongoose from 'mongoose';
import Status from "../../helpers/constant";
import Notification from "../../model/notification";
import { sendPushNotifications } from "../../utils/pushNotifications";

const handler: Handler<"skipMilestoneInviteFriend"> = async (request, { user }) => {
    const eventId = new mongoose.Types.ObjectId(request?.eventId);
    const milestoneId = request.milestoneId;
    if (!eventId) {
        throw new Boom(
            "Please choose an event!",
            { statusCode: BAD_REQUEST }
        );
    }
    else if (!milestoneId) {
        throw new Boom(
            "Please choose milestone to skip!",
            { statusCode: BAD_REQUEST }
        );
    } else {
        const userId = user.userId;

        let eventMilestoneInfo = await EventJoin.findOne({
            userId,
            eventId
        }).sort({ createdAt: 1 });
        if (eventMilestoneInfo) {

            const milestoneExists = eventMilestoneInfo.milestonesSkipped.some(
                (milestoneCompleted) => milestoneCompleted.milestoneId === milestoneId
            );
            if (!milestoneExists) {
                // Push a new object into the milestonesSkipped array
                eventMilestoneInfo.milestonesSkipped.push({
                    milestoneId
                });
                await eventMilestoneInfo.save();
            }
        }
        return { message: "Milestone skipped successfully" };
    }
};

export default handler;
