//generated file, run 'yarn generate:routes-index' to update

import forgetPassword from './auth/forgetPassword';
import getAuthToken from './auth/getAuthToken';
import googleAuth from './auth/googleAuth';
import login from './auth/login';
import logout from './auth/logout';
import resendOtp from './auth/resendOtp';
import resetPassword from './auth/resetPassword';
import signup from './auth/signup';
import verifyEmail from './auth/verifyEmail';
import createComment from './comment/createComment';
import getAllComments from './comment/getAllComments';
import uploadImage from './common/uploadImage';
import createCompany from './company/createCompany';
import getCompany from './company/getCompany';
import getSingleCompany from './company/getSingleCompany';
import updateCompany from './company/updateCompany';
import createEasyEvent from './easyEvent/createEasyEvent';
import getAllEasyEvent from './easyEvent/getAllEasyEvent';
import createEvent from './event/createEvent';
import deleteEvent from './event/deleteEvent';
import eventCompleted from './event/eventCompleted';
import eventJoinHistory from './event/eventJoinHistory';
import getAllEvents from './event/getAllEvents';
import getEventReviews from './event/getEventReviews';
import getEventsByCompanyId from './event/getEventsByCompanyId';
import getSingleEvent from './event/getSingleEvent';
import checkEventJoined from './eventJoin/checkEventJoined';
import getAllEventInvites from './eventJoin/getAllEventInvites';
import getEventJoinByFriends from './eventJoin/getEventJoinByFriends';
import inviteEventAcceptReject from './eventJoin/inviteEventAcceptReject';
import inviteFriendEventJoin from './eventJoin/inviteFriendEventJoin';
import joinEvent from './eventJoin/joinEvent';
import checkInEvent from './eventMilestone/checkInEvent';
import completeMilestoneDateTime from './eventMilestone/completeMilestoneDateTime';
import completeMilestoneInviteFriend from './eventMilestone/completeMilestoneInviteFriend';
import completeMilestoneMakePhoto from './eventMilestone/completeMilestoneMakePhoto';
import completeMilestoneReview from './eventMilestone/completeMilestoneReview';
import getEventMilestonesCompleted from './eventMilestone/getEventMilestonesCompleted';
import skipMilestoneInviteFriend from './eventMilestone/skipMilestoneInviteFriend';
import addNewFavoriteEvent from './favorite/addNewFavoriteEvent';
import addNewLike from './like/addNewLike';
import getShop from './shop/getShop';
import createEventType from './superAdminApi/eventType/createEventType';
import deleteEventType from './superAdminApi/eventType/deleteEventType';
import getAllEventType from './superAdminApi/eventType/getAllEventType';
import getSingleEventType from './superAdminApi/eventType/getSingleEventType';
import updateEventType from './superAdminApi/eventType/updateEventType';
import createMilestone from './superAdminApi/milestone/createMilestone';
import deleteMilestone from './superAdminApi/milestone/deleteMilestone';
import getAllMilestones from './superAdminApi/milestone/getAllMilestones';
import getSingleMilestone from './superAdminApi/milestone/getSingleMilestone';
import updateMilestone from './superAdminApi/milestone/updateMilestone';
import createTheme from './superAdminApi/theme/createTheme';
import deleteTheme from './superAdminApi/theme/deleteTheme';
import getAllThemes from './superAdminApi/theme/getAllThemes';
import getSingleTheme from './superAdminApi/theme/getSingleTheme';
import updateTheme from './superAdminApi/theme/updateTheme';
import createTag from './tag/createTag';
import getAllTags from './tag/getAllTags';
import createNewFriend from './user/createNewFriend';
import deleteFriend from './user/deleteFriend';
import friendAcceptReject from './user/friendAcceptReject';
import getAllContacts from './user/getAllContacts';
import getAllFriendRequests from './user/getAllFriendRequests';
import getAllFriends from './user/getAllFriends';
import getContactDetailsById from './user/getContactDetailsById';
import getNotification from './user/getNotification';
import getUserDetails from './user/getUserDetails';
import switchAccount from './user/switchAccount';
import updateUser from './user/updateUser';

export default {
	forgetPassword,
	getAuthToken,
	googleAuth,
	login,
	logout,
	resendOtp,
	resetPassword,
	signup,
	verifyEmail,
	createComment,
	getAllComments,
	uploadImage,
	createCompany,
	getCompany,
	getSingleCompany,
	updateCompany,
	createEasyEvent,
	getAllEasyEvent,
	createEvent,
	deleteEvent,
	eventCompleted,
	eventJoinHistory,
	getAllEvents,
	getEventReviews,
	getEventsByCompanyId,
	getSingleEvent,
	checkEventJoined,
	getAllEventInvites,
	getEventJoinByFriends,
	inviteEventAcceptReject,
	inviteFriendEventJoin,
	joinEvent,
	checkInEvent,
	completeMilestoneDateTime,
	completeMilestoneInviteFriend,
	completeMilestoneMakePhoto,
	completeMilestoneReview,
	getEventMilestonesCompleted,
	skipMilestoneInviteFriend,
	addNewFavoriteEvent,
	addNewLike,
	getShop,
	createEventType,
	deleteEventType,
	getAllEventType,
	getSingleEventType,
	updateEventType,
	createMilestone,
	deleteMilestone,
	getAllMilestones,
	getSingleMilestone,
	updateMilestone,
	createTheme,
	deleteTheme,
	getAllThemes,
	getSingleTheme,
	updateTheme,
	createTag,
	getAllTags,
	createNewFriend,
	deleteFriend,
	friendAcceptReject,
	getAllContacts,
	getAllFriendRequests,
	getAllFriends,
	getContactDetailsById,
	getNotification,
	getUserDetails,
	switchAccount,
	updateUser,
}