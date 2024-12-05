import { Handler } from "../../utils/make-api";
import Event from "../../model/event";
import EventJoin from "../../model/eventJoin";
import { Boom } from "@hapi/boom";
import { NOT_FOUND } from "http-status";
import mongoose from 'mongoose';
import Const from "../../helpers/constant";

//@ts-ignore
const handler: Handler<"getEventReviews"> = async (request, { user }) => {
    const { currentPage } = request;

    const eventId = new mongoose.Types.ObjectId(request.eventId);






    // const match = { _id: eventId }
    try {

        /*let pipeline: any = [
            { $match: match },
            {
                $lookup: {
                    from: "eventjoins", // collection name in db
                    localField: "_id",
                    foreignField: "eventId",
                    as: "EventJoin",
                }
            },
            {
                $unwind: "$EventJoin" // Unwind the EventJoin array
            },
            {
                $project: {
                    '$EventJoin.extraInfo': 1
                }
            },
            {
                $facet: {
                    events: [
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
        ];


        const result = await Event.aggregate(pipeline);//*/

        /*const result = await EventJoin.aggregate([
            { 
                $match:{ 
                    eventId,
                    "extraInfo.milestone_review_data.milestone": "REVIEW"
                }
            }
        ]);//*/

        const result = await EventJoin.find({ eventId, "extraInfo.milestone_review_data.milestone": "REVIEW" })
            .populate({
                path: 'userId',
                model: 'User',
                select: 'firstName lastName email photoUrl', // Specify the user fields you want to retrieve
            })
            .select('extraInfo.milestone_review_data') // Select the 'extraInfo' field from the EventJoin model
            .skip(currentPage as number * Const.RECORDS_PER_PAGE) // Add the offset
            .limit(10) // Add the limit
            .exec();

        console.log('Result->', result);
        let averageRating = 0;
        if (result) {
            // for (let data of result) {
            //     const reviewInfo = data?.extraInfo?.milestone_review_data?.userRating;
            // }
            let sum = 0;
            let count = 0;

            // Iterate through the array and calculate the sum and count
            result.forEach(item => {
                const userRating = item?.extraInfo?.milestone_review_data?.userRating;
                if (!isNaN(userRating)) {
                    sum += userRating;
                    count++;
                }
            });

            // Calculate the average rating
            averageRating = count > 0 ? sum / count : 0;

        }
        // let reviews = result[0].events;
        // const hasNextPage = result[0].hasNextPage.length > 0;
        return {
            reviews: result,
            averageRating,
            hasNextPage: 0
        };
    } catch (error: any) {
        console.log("error", error);
        throw new Boom(error, { statusCode: NOT_FOUND });
    }
};

export default handler;
