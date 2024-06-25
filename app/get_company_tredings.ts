import { collection, doc, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore";
import { db } from "../app/firbaseconfig"; // Adjust the path to your Firebase config



interface JobData {
    id: string;
    [key: string]: any; // Adjust the structure according to your actual job data
}

const pagination_size = 2; // Set your pagination size

const getDatatrendingcompany = async (): Promise<JobData[] | any> => {

    try {

        const companySnapshot = await getDocs(collection(db, 'company'));
        const company = [];

        for (const doc of companySnapshot.docs) {
            const data = doc.data();
            const Ref = doc.ref;
            const jobsQuery = query(collection(db, 'jobs'), where('company', '==', Ref), where('status', '!=', 0));
            const jobsSnapshot = await getDocs(jobsQuery);
            const jobCount = jobsSnapshot.size;
            console.log('----------');
            console.log(jobCount);
            console.log('----------');
            company.push({
                id: doc.id,
                name: data.name,
                jobCount,
            });
        }

        return company;
    } catch (error: any) {
        throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
};

export default getDatatrendingcompany;
