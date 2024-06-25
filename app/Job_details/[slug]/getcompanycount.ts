import { collection, doc, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, Timestamp, where } from "firebase/firestore";
import { db } from "../../firbaseconfig"; // Adjust the path to your Firebase config
import { subMonths, startOfDay, endOfDay, endOfMonth, startOfMonth } from "date-fns";

interface GetDataParams {
    company?: string;
    lastmonth?: boolean
}

interface JobData {
    id: string;
    [key: string]: any; // Adjust the structure according to your actual job data
}




const getDatacompanyactivecount = async ({ company, lastmonth }: GetDataParams): Promise<JobData[] | any> => {

    try {
        // Get the current date and the date one month ago
        const now = new Date();
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        const queryConstraints: QueryConstraint[] = [];
        queryConstraints.push(where('status', '!=', 0));
        console.log("company_id", company);
        queryConstraints.push(where('company_tag', '==', company));
        if (lastmonth) {
            queryConstraints.push(where('publish_time', '>=', Timestamp.fromDate(lastMonthStart)));
            queryConstraints.push(where('publish_time', '<=', Timestamp.fromDate(lastMonthEnd)));

        }
        const jobsQuerySnapshot = await getDocs(query(collection(db, 'jobs'), ...queryConstraints));
        const jobCount = jobsQuerySnapshot.size;
        console.log("count", jobCount);
        return jobCount;
    } catch (error: any) {
        throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
};

export default getDatacompanyactivecount;
