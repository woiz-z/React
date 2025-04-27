import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD64cJvleuWCAPxfcLk0Qq0ZTnAkuJCb7A",
    authDomain: "tours-87214.firebaseapp.com",
    projectId: "tours-87214",
    storageBucket: "tours-87214.firebasestorage.app",
    messagingSenderId: "800254898142",
    appId: "1:800254898142:web:272d34ea87df9a162fb74f",
    measurementId: "G-40ZFM8RFF3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Чорний список заборонених слів
const forbiddenWords = [
    // Образи та приниження
    'ідіот', 'дурень', 'тупий', 'невдаха', 'нікчема', 'потворний', 'жирний', 'худий', 'огидний',

    // Ненормативна лексика (повністю)
    'блядь', 'сука', 'хуй', 'пизда', 'єбать', 'мудак', 'гондон', 'дрочити', 'єблан', 'підор', 'мразь',

    // Мова ворожнечі та дискримінація
    'негр', 'жид', 'циган', 'педик', 'гомик', 'трансик', 'мусор', 'хач', 'чурка', 'ублюдок',

    // Спам та шахрайство
    'безкоштовно', 'заробіток', 'криптовалюта', 'інвестуй', 'підпишись', 'лайкни', 'перейдіть за посиланням',
    'подарунок', 'виграй', 'гроші швидко', 'інвестиція', 'ставки', 'казино', 'лотерея',

    // Алгоспік і завуальовані слова
    'suicide', 'unalive', 'rape', 'porn', 'sex', 'nude', 'weed', 'cocaine', 'heroin', 'cheese pizza',

    // Інші небажані теми
    'тероризм', 'насильство', 'вбивство', 'порнографія', 'наркотики', 'суїцид', 'зґвалтування', 'педофілія',
    'війна', 'тортури', 'расизм', 'ксенофобія'
];

// Функція для перевірки наявності заборонених слів
const containsForbiddenWords = (text) => {
    const lowerText = text.toLowerCase();
    return forbiddenWords.some(word => lowerText.includes(word.toLowerCase()));
};

// Функції для роботи з аутентифікацією
const registerUser = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: name
        });
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Функція для додавання відгуку з перевіркою на заборонені слова
const addReviewWithCheck = async (reviewData) => {
    if (containsForbiddenWords(reviewData.comment)) {
        throw new Error('Відгук містить заборонені слова');
    }
    return await addDoc(collection(db, "reviews"), reviewData);
};

export {
    auth,
    db,
    storage,
    registerUser,
    loginUser,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp,
    addReviewWithCheck,
    containsForbiddenWords
};