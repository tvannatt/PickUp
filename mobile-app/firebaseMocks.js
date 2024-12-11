jest.mock('expo-constants', () => ({
    expoConfig: {
        extra: {
            apiKey: 'test_apiKey',
            authDomain: 'test_authDomain',
            projectId: 'test_projectId',
            storageBucket: 'test_storageBucket',
            messagingSenderId: 'test_messagingSenderId',
            appId: 'test_appId',
            databaseURL: 'test_databaseURL',
        },
    },
}));

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn((db, collectionName) => `mocked_collection_${collectionName}`),
    getFirestore: jest.fn(() => ({})),
    doc: jest.fn((db, collectionName, docId) => ({
        _collectionName: collectionName,
        _docId: docId,
        path: `mocked_collection_${collectionName}/${docId}`, // Adding path mock for debugging
    })),
    getDoc: jest.fn((docRef) => {
        if (docRef._docId === 'existing@example.com') {
            return Promise.resolve({
                exists: () => true,
                data: () => ({
                    role: 'guardian',
                    children: ['child1', 'child2'] // Mock child references
                }),
            });
        } else if (docRef._docId === 'nonexisting@example.com') {
            return Promise.resolve({
                exists: () => false,
                data: () => null,
            });
        }
        return Promise.resolve({
            exists: () => false,
            data: () => null,
        });
    }),
    updateDoc: jest.fn((docRef, data) => Promise.resolve(`Updated ${docRef._docId} in ${docRef._collectionName} with data ${JSON.stringify(data)}`)),
    setDoc: jest.fn((docRef, data) => Promise.resolve(`Set ${docRef._docId} in ${docRef._collectionName} with data ${JSON.stringify(data)}`)),
    deleteDoc: jest.fn((docRef) => Promise.resolve(`Deleted ${docRef._docId} from ${docRef._collectionName}`)),
}));


jest.mock('firebase/database', () => ({
    getDatabase: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    initializeAuth: jest.fn(() => ({ someProperty: 'mockAuthInstance' })),
    createUserWithEmailAndPassword: jest.fn((auth, email, password) => {
        if (email === 'existing@example.com') {
            return Promise.resolve({ user: { email } });
        }
        return Promise.reject(new Error('Auth error'));
    }),
    sendEmailVerification: jest.fn(),
    currentUser: {
        email: 'currentUser@example.com'
    }
}));

export default {};
