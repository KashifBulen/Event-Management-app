import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
  eventIdentifier: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,//Schema.Types.ObjectId,
    default: null,
    ref: "User",
  },
  companyId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Company",
  },
  eventTitle: {
    type: String,
    required: true,
    default: "",
  },
  eventSummary: {
    type: String,
    default: null,
  },
  eventDescription: {
    type: String,
    default: null,
  },
  eventPhoto: [{
    type: String
  }],

  tag: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  themeId: {
    type: Schema.Types.ObjectId,
    ref: 'Theme',
    default: null,
  },
  eventTypeId: {
    type: Schema.Types.ObjectId,
    ref: "EventType",
    default: null,
  },
  eventTypeData: {
    easyTypeValue: {
      easyEventId: {
        type: Schema.Types.ObjectId,
        ref: 'EasyEvent'
      },
      host: {
        type: String
      },
      link: {
        type: String
      },
      hostId: {
        type: String
      }
    },
    shop: [
      {
        productReference: {
          type: String,
        },
        productId: {
          type: String,
        },
        productOrderHook: {
          type: String,
        }
      }
    ],
    donation: {
      requiredDonationAmount: {
        type: Number,
      },
      bankName: {
        type: String,
      },
      accountTitle: {
        type: String,
      },
      address: {
        type: String,
      },
      anbiStatus: {
        type: Boolean,
        default: false
      }
    }
  },
  eventMilestoneList: [
    {
      milestoneId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Milestone",
      },
      milestoneIdentifier: {
        type: String,
        required: true
      },
      milestoneValue: {
        type: String,
        required: true,
        default: "",
      },
      milestoneData: [{}],
      xp: {
        type: Number,
        default: 0,
        required: true,
      },
      // e.g In case of Invite Friend Milestone, how many invitations need to send to complete this milestone
      milestoneCompletionCriteria: {
        type: Object,
        default: null,
        required: false
      }
    },
  ],
  xp: {
    type: Number,
    default: 0,
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  eventLink: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  }

});

export default mongoose.model("Event", eventSchema);