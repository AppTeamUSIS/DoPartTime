import { collection, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore";
import { db } from "../firbaseconfig"; // Adjust the path to your Firebase config

interface GetDataParams {
    page: number;
    count?: boolean;
    lastid?: string | null;
    lastVisible?: boolean;
    job_type?: any,
    job_day?: any,
    gender?: any,
    location?: string;
    area?: string;
    sortby?: string;
}

interface Data {
    id: string;
    [key: string]: any; // Adjust the structure according to your actual job data
}

const pagination_size = 10; // Set your pagination size

const getDatacandiate = async ({ page, count, lastid, lastVisible, job_type, job_day, gender, location, area, sortby }: GetDataParams): Promise<Data[] | any> => {

    try {
        const filter = [...job_type, ...job_day];
        const queryConstraints: QueryConstraint[] = [];
        if (gender && gender != "Both") {
            queryConstraints.push(where('gender', '==', gender));
        }
        if (location) {
            queryConstraints.push(where('location', '==', location));

        }
        if (area) {
            queryConstraints.push(where('area', '==', area));
        }
        queryConstraints.push(where('public_profile', '==', "true"));
        if (filter.length >= 1) {
            queryConstraints.push(where('user_filter', 'array-contains-any', filter));
        }
        if (!count) {
            queryConstraints.push(limit(page >= 2 ? pagination_size * (page - 1) : pagination_size));
        }
        if (page >= 2 && (!count || !lastVisible)) {
            if (lastid) {
                queryConstraints.push(startAfter(lastid));
            }
        }
        if (sortby == 'Asc') {
            queryConstraints.push(orderBy('display_name', 'asc'));
        }
        else {
            queryConstraints.push(orderBy('display_name', 'desc'));
        }
        const postsRef = query(collection(db, "users"), ...queryConstraints);
        const querySnapshot = await getDocs(postsRef);
        const promises = querySnapshot.docs.map(async (doc) => {
            const data: Data = { id: doc.id, ...doc.data() };
            return data;
        });
        if (lastVisible) {
            const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            return lastVisibleDoc;
        }

        const dataArray = await Promise.all(promises);
        const data = dataArray.filter(Boolean); // Remove any undefined elements

        console.log(data);
        return data;
    } catch (error: any) {
        throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
};

export default getDatacandiate;
