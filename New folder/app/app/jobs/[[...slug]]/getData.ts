import { collection, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore";
import { db } from "../../firbaseconfig"; // Adjust the path to your Firebase config

interface GetDataParams {
    page: number;
    count: boolean;
    lastVisible: boolean;
    lastid: string | null;
    location?: string;
    area?: string;
    jobfilter: any,
    company?: string;
}

interface JobData {
    id: string;
    [key: string]: any; // Adjust the structure according to your actual job data
}

const pagination_size = 2; // Set your pagination size

const getData = async ({ page, count, lastVisible, lastid, location, area, jobfilter, company }: GetDataParams): Promise<JobData[] | any> => {

    try {

        const queryConstraints: QueryConstraint[] = [];

        if (location) {
            queryConstraints.push(where('location', '==', location));

        }
        if (area) {
            queryConstraints.push(where('area', '==', area));
        }
        if (company) {
            queryConstraints.push(where('company_tag', '==', company));
        }
        if (jobfilter && jobfilter.length >= 1) {
            queryConstraints.push(where('tag_store', 'array-contains-any', jobfilter));
        }
        // if (daysweek && daysweek.length >= 1) {
        //     queryConstraints.push(where('tag_store', 'array-contains-any', daysweek));
        // }
        queryConstraints.push(where('status', '!=', 0));

        // if (timeperiod.length >= 1) {
        //     queryConstraints.push(where('tag_store', 'array-contains', timeperiod));
        // }
        queryConstraints.push(orderBy('status', 'asc'));
        queryConstraints.push(orderBy('publish_time', 'desc'));
        if (page >= 2 && (!count || !lastVisible)) {
            if (lastid) {
                queryConstraints.push(startAfter(lastid));
            }
        }
        if (!count) {
            queryConstraints.push(limit(page >= 2 ? pagination_size * (page - 1) : pagination_size));
        }

        const postsRef = query(collection(db, "jobs"), ...queryConstraints);
        const querySnapshot = await getDocs(postsRef);

        if (lastVisible) {
            const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            return lastVisibleDoc;
        }

        const promises = querySnapshot.docs.map(async (doc) => {
            const data: JobData = { id: doc.id, ...doc.data() };
            return data;
        });

        const dataArray = await Promise.all(promises);
        const data = dataArray.filter(Boolean); // Remove any undefined elements

        console.log(data);
        return data;
    } catch (error: any) {
        throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
};

export default getData;
