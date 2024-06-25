import { collection, doc, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore";
import { db } from "../../firbaseconfig"; // Adjust the path to your Firebase config

interface GetDataParams {

}

interface JobData {
    id: string;
    [key: string]: any; // Adjust the structure according to your actual job data
}


const getDatacount = async ({ }: GetDataParams): Promise<JobData[] | any> => {

    try {
        const queryConstraints: QueryConstraint[] = [];
        const postsRef = query(collection(db, "jobs"), ...queryConstraints);
        const querySnapshot = await getDocs(postsRef);
        return querySnapshot.size;
    } catch (error: any) {
        throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
};

export default getDatacount;
