import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import Event from "../../model/event";
import EventType from "../../model/eventType";
import { BAD_REQUEST } from "http-status";
import consts from "../../helpers/constant";
import geospatial from "../../model/geospatial";

//@ts-ignore
const handler: Handler<"createEvent"> = async (request, { user }) => {
  console.log("requesttttttt", user)
  const {
    eventId,
    stepNumber,
    eventTitle,
    eventSummary,
    eventDescription,
    eventPhoto,
    themeId,
    tag,
    eventTypeId,
    eventTypeData,
    eventMilestoneList,
    xp,
    eventLink
  } = request;

  let result;
  let addUpdateFields = {};
  let errorMsg = "";
  var increment = 1;
  let isDraftEvent: any;
  let locations: any;

  // console.log("comapnayId:",user.companyId)
  switch (stepNumber) {
    case consts.STEP_CONTENT:
      if (!eventTitle) errorMsg = "Event Title is required!";
      // addUpdateFields = { companyId: user.companyId,
      //   eventTitle,
      //   eventSummary,
      //   eventDescription };
      break;
    case consts.STEP_IMAGE:
      if (!eventPhoto || eventPhoto.length <= 0) errorMsg = "Event photo is required!";
      // addUpdateFields = {eventPhoto};
      break;
    case consts.STEP_THEME:
      if (!themeId) errorMsg = "ThemeId is required!";
      // addUpdateFields = {themeId}
      break;
    case consts.STEP_TAG:
      if (!tag || tag.length <= 0) errorMsg = "Tag is required!";
      // addUpdateFields = {tag,eventLink};
      break;
    case consts.STEP_EVENT_TYPE:
      if (!eventTypeId) {
        errorMsg = "Event type is required!";
      }
      const eventType = await EventType.findOne({ _id: eventTypeId });
      if (!eventType) errorMsg = "No event found!";
      else {
        if (eventType.eventTypeName === consts.EVENT_TYPE_LIVE) {

          if (!eventTypeData?.locations || eventTypeData.locations.length === 0) {
            errorMsg = "At least one location is required!";
          } else {
            eventTypeData.locations.forEach((location) => {
              if (
                !(
                  location?.address &&
                  Array.isArray(location.location?.coordinates) &&
                  location.location?.coordinates.length === 2 &&
                  typeof location.location?.coordinates[0] === "number" &&
                  typeof location.location?.coordinates[1] === "number"
                )
              ) {
                errorMsg = "Invalid location data!";
              }

            });
            if (!errorMsg) {
              locations = eventTypeData?.locations;
              delete eventTypeData.locations;
            }

          }
        }
        else if (eventType.eventTypeName === consts.EVENT_TYPE_EASY) {
          if (!eventTypeData?.easyTypeValue) errorMsg = "Event type data is required!";
          else if (!eventTypeData?.easyTypeValue?.host) errorMsg = "Video/Podcast Host is required!";
          else if (!eventTypeData?.easyTypeValue?.link) errorMsg = "Video/Podcast link is required!";
          else if (!eventTypeData?.easyTypeValue?.hostId) errorMsg = "Video/Podcast id is required!";
        }
        else if (eventType.eventTypeName === consts.EVENT_TYPE_DONATION) {
          if (!eventTypeData?.donation) errorMsg = "Donation is required";
          else if (!eventTypeData?.donation?.requiredDonationAmount) errorMsg = "Donation amount is required!";
          else if (!eventTypeData?.donation?.bankName) errorMsg = "Bank name is required!";
          else if (!eventTypeData?.donation?.accountTitle) errorMsg = "Account title is required!";
          else if (!eventTypeData?.donation?.address) errorMsg = "Address is required!";
        }
        // addUpdateFields = {eventTypeId:eventType._id,eventTypeData};
      }
      break;
    case consts.STEP_MILESTONE:
      if (!eventMilestoneList || eventMilestoneList.length <= 0) errorMsg = "Event milestone required!";
      isDraftEvent = false;
      break;
    case consts.STEP_FINAL:
      // const emails = ["numansafi97@gmail.com","numansafi97@gmail.com"];
      //   emails?.map(async(m)=>{
      //     await sendEventInvitation(eventId,m)
      //   });
      break;
    default:
      errorMsg = "Step number is required!";
      break;
  }

  if (!errorMsg) {

    let locs
    if (eventId&&eventId!==undefined&&eventId!==null) {
      if (eventId && locations) {
        await geospatial.deleteMany({ eventId: eventId });
        const updatedLocations = locations.map((loc: { _id: string }) => {
          return {
            ...loc,
            "eventId": eventId
          };
        });
        locs = await geospatial.insertMany(updatedLocations);
      }

      const newEvent = await Event.findOneAndUpdate({ _id: eventId }, { ...request, isDraft: isDraftEvent, eventTypeData });

      let  addEvent= newEvent?.toObject();
      if (addEvent?.eventTypeData) {
        addEvent = {
          ...addEvent,
          //@ts-ignore
          companyId:user.companyId.toString(),
          eventTypeData: {
            ...addEvent?.eventTypeData,
            //@ts-ignore
            locations: locs
          }
        }
      }
     
      
      result = addEvent;

    } else {
      const checkEventIdentifierExist = await Event.findOne().sort({ updatedAt: -1 });
      let locs
      if (checkEventIdentifierExist) increment = checkEventIdentifierExist.eventIdentifier + increment;
      const newEvent = await Event.create(
        {
          ...request,
          userId: user.userId,
          companyId: user.companyId.toString(),//user.compnayid
          eventIdentifier: increment,
          eventTypeData: { eventTypeData }
        });
      let addEvent =  newEvent.toObject();
      if (locations) {
        const updatedLocations = locations.map((loc: { _id: string }) => {
          return {
            ...loc,
            "eventId": newEvent?._id
          };
        });
        locs = await geospatial.insertMany(updatedLocations);
      }
      if (addEvent?.eventTypeData) {
       
        addEvent = {
          ...addEvent,
            //@ts-ignore
          companyId:newEvent.companyId.toString(),
          eventTypeData: {
            ...addEvent.eventTypeData,
            //@ts-ignore
            locations: locs
          }
        }
      }
      console.log("newEvent:", addEvent)

      result = addEvent;
    }
  } else {
    throw new Boom(errorMsg, {
      statusCode: BAD_REQUEST
    });
  }

  if (!result) {
    throw new Boom("Something went wrong, event not created!", {
      statusCode: BAD_REQUEST,
    });
  }
  
  return result ;
};

export default handler;
