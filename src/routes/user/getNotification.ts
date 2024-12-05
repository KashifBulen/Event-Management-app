import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import Const from "../../helpers/constant";
import Notification from "../../model/notification";

//@ts-ignore
const handler: Handler<"getNotification"> = async (request, { user }) => {
    try {
        const { currentPage } = request;

        const totalNotifications = await Notification.countDocuments({
            userId: user.userId
        });
        console.log('totalNotifications',totalNotifications);
        const notifications = await Notification.find({ userId: user.userId }).sort({ createdAt: -1 })
            .skip((currentPage as number - 1) * Const.RECORDS_PER_PAGE)
            .limit(Const.RECORDS_PER_PAGE);
            const hasNextPage = (currentPage as number) * Const.RECORDS_PER_PAGE < totalNotifications;
        if (!notifications || notifications.length === 0) {
            throw new Boom("No record found", { statusCode: NOT_FOUND });
        } else {
            return {
                notifications,
                hasNextPage
            }
        }

    } catch (error) {
        throw new Boom('No Record Found', { statusCode: NOT_FOUND })
    }
};

export default handler;
