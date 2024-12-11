import { Images } from './images';
import { Theme } from './theme';
import { 
    auth, 
    fetchUserRole,
    registerNewUser,
    sendVerificationEmail,
    fetchChildrenData,
    fetchAllGuardianData,
    getDocumentIdByEmail,
    deleteAccount,
    generateKey,
    getKey,
    checkInUser,
    checkOutFromQueue,
    fetchChildrenByIds,
    isUserCheckedIn
} from './firebase';

export { 
    Images,
    Theme, 
    auth, 
    fetchUserRole, 
    registerNewUser, 
    sendVerificationEmail, 
    fetchChildrenData,
    fetchAllGuardianData,
    getDocumentIdByEmail,
    deleteAccount,
    generateKey,
    getKey,
    checkInUser,
    checkOutFromQueue,
    fetchChildrenByIds,
    isUserCheckedIn
};
