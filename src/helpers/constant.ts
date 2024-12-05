
import mongoose, { Types, Document } from 'mongoose';

// Function to generate a new mongoose.Types.ObjectId

 export   function getMongooseObjectId(idString: string): Types.ObjectId {
        return new mongoose.Types.ObjectId(idString);
      }

  
  // Function to remove the _id field from a Mongoose document
export  function removeIdField(doc: Document): void {
    // Use the `toObject` method to convert the document to a plain JavaScript object
    const plainObject = doc.toObject();
    
    // Remove the _id field
    delete plainObject._id;
  
    // If you want to remove the _id field from the original document, you can use the set method
    doc.set(plainObject);
  }

export default {
    
    EVENT_TYPE_LIVE: "live",
    EVENT_TYPE_EASY: "easy",
    EVENT_TYPE_DONATION: "donation",

    STEP_CONTENT: 'content',
    STEP_IMAGE: 'image',
    STEP_THEME: 'theme',
    STEP_TAG: 'tag',
    STEP_EVENT_TYPE: 'event_type',
    STEP_MILESTONE: 'milestone',
    STEP_FINAL: 'final',
    RECORDS_PER_PAGE: 10,

    FRIEND_REQUEST_PENDING: "pending",
    FRIEND_REQUEST_ACCEPT: "accept",
    FRIEND_REQUEST_REJECT: "reject",

    NOTIFICATION_TYPE_FRIEND_REQUEST: "friend-request",
    NOTIFICATION_TYPE_FRIEND_REQUEST_ACCEPT: "friend-request-accept",
    NOTIFICATION_TYPE_EVENT_LIKE: "event-like",
    NOTIFICATION_TYPE_EVENT_JOIN_INVITE: "event-join-invite",
    NOTIFICATION_TYPE_NOTE: "notification-note",



    MILESTONE_INVITE_FRIEND: "INVITE_FRIEND",
    MILESTONE_DATE_TIME: "DATE_TIME",
    MILESTONE_CHECK_IN: "CHECK_IN",
    MILESTONE_MAKE_PHOTO: "MAKE_PHOTO",
    MILESTONE_REVIEW: "REVIEW",

    getMongooseObjectId,
    removeIdField
}