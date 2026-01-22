const { collection, doc, deleteDoc, getDocs, getDoc, updateDoc, query, orderBy } = require("firebase/firestore");
const { db } = require('../../config/firebase');
const { handleSuccess, handleError, joiErrorHandle } = require('../../utils/responseHandler');
const Joi = require("joi");
const { get_user_data_by_id } = require("../../models/users");
const admin = require("firebase-admin");
const firestore = admin.firestore();



exports.getAllFirebaseUsers = async (req, res) => {
    try {
        const usersCollectionRef = collection(db, "user");
        const userDocs = await getDocs(usersCollectionRef);
        const usersList = userDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return handleSuccess(res, 200, "All Firebase User Data Retrieved", usersList);
    } catch (error) {
        return handleError(res, 500, "Failed to retrieve user data");
    }
};

exports.getChatGroups = async (req, res) => {
    try {
        const publicChatGroupRef = collection(db, "publicChatGroup");
        const privateChatGroupRef = collection(db, "privateChatGroup");
        const publicChatDocs = await getDocs(publicChatGroupRef);
        const privateChatDocs = await getDocs(privateChatGroupRef);
        const publicChats = publicChatDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const privateChats = privateChatDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));


        const public_group_data = await Promise.all(publicChats.map(async (chat) => {
            const membersWithData = await Promise.all(chat.member.map(async (user) => {
                const user_data = await get_user_data_by_id(user.id);
                user.user = user_data;
                return user;
            }));
            return { ...chat, member: membersWithData };
        }));

        const private_group_data = await Promise.all(privateChats.map(async (chat) => {
            const membersWithData = await Promise.all(chat.member.map(async (user) => {
                const user_data = await get_user_data_by_id(user.id);
                user.user = user_data;
                return user;
            }));
            return { ...chat, member: membersWithData };
        }));


        const data = {
            publicChatGroup: public_group_data,
            privateChatGroup: private_group_data
        };


        return handleSuccess(res, 200, "Data retrieved from both chat groups", data);
    } catch (error) {
        console.error("Error fetching chat groups:", error);
        return handleError(res, 500, "Failed to retrieve data from chat groups");
    }
};

exports.removeUserFromChatGroup = async (req, res) => {
    try {
        const schema = Joi.object({
            groupId: Joi.string().required(),
            userId: Joi.string().required(),
            groupType: Joi.string().valid('public', 'private').required()
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return handleError(res, 400, error.details[0].message);
        }

        const { groupId, userId, groupType } = value;

        const chatGroupRef = collection(db, groupType === "public" ? "publicChatGroup" : "privateChatGroup");
        const groupDocRef = doc(chatGroupRef, groupId);

        const groupDocSnapshot = await getDoc(groupDocRef);
        if (!groupDocSnapshot.exists()) {
            return handleError(res, 404, "Group not found");
        }

        const groupData = groupDocSnapshot.data();
        const members = groupData.member || [];

        const userIndex = members.findIndex(member => member.id === parseInt(userId));
        if (userIndex === -1) {
            return handleError(res, 404, "User not found in this group");
        }
        const updatedMembers = members.filter(member => member.id !== parseInt(userId));
        await updateDoc(groupDocRef, {
            member: updatedMembers
        });
        const userDocRef = doc(collection(db, "user"), userId);
        await deleteDoc(userDocRef);
        return handleSuccess(res, 200, `User Deleted Successfully`);
    } catch (error) {
        console.error("Error removing user from chat group:", error);
        return handleError(res, 500, error.message);
    }
};

// exports.get_chated_user_ids = async (req, res) => {
//     try {
//         const { profileId , user_id_other } = req.body; 
//         if (!profileId) {
//             return handleError(res, 400, "Profile ID is required");
//         }
//         const userListRef = collection(db, "user", String(profileId), "userList");
//         const q = query(userListRef, orderBy("createdAt", "desc"));

//         const querySnapshot = await getDocs(q);

//         const chated_users = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//         }));

//         return handleSuccess(res, 200, "Data retrieved from Chat list", chated_users);
//     } catch (error) {
//         console.error("Error fetching chat users:", error);
//         return handleError(res, 500, "Failed to retrieve data from chat groups");
//     }
// };



exports.check_with_chat = async (user_id, opponent_user_id) => {
    try {
        const userListRef = collection(db, "user", String(user_id), "userList");
        const q = query(userListRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return isMatched = querySnapshot.docs.some((doc) => doc.data().mId == String(opponent_user_id));
    } catch (error) {
        console.error("Error fetching chat users:", error);
    }
};
