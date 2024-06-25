import { collection, doc, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, Timestamp, where } from "firebase/firestore";
import { db } from "../firbaseconfig"; // Adjust the path to your Firebase config

interface GetDataParams {
    company?: string;
    lastmonth?: boolean
}

interface JobData {
    id: string;
    [key: string]: any; // Adjust the structure according to your actual job data
}




const getDatacompanyactivetime = async ({ company, lastmonth }: GetDataParams): Promise<JobData[] | any> => {

    try {

        const queryConstraints: QueryConstraint[] = [];
        queryConstraints.push(where('status', '!=', 0));
        queryConstraints.push(where('company_tag', '==', company));
        queryConstraints.push(orderBy('status', 'asc'));
        queryConstraints.push(orderBy('publish_time', 'desc'));
        queryConstraints.push(limit(1));
        const jobsQuerySnapshot = await getDocs(query(collection(db, 'jobs'), ...queryConstraints));
        console.log('ggggg', jobsQuerySnapshot.docs[0]);
        if (!jobsQuerySnapshot.empty) {
            console.log('ggggg', jobsQuerySnapshot.docs[0].data());
            // Get the first document (latest)
            const jobDoc = jobsQuerySnapshot.docs[0];
            const jobData: JobData = { id: jobDoc.id, ...jobDoc.data() };
            const dateToConvert = new Date(jobDoc.data().publish_time.seconds * 1000 + jobDoc.data().publish_time.nanoseconds / 1000000);
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var year = dateToConvert.getFullYear();
            var month = monthNames[dateToConvert.getMonth()];

            // Format the output as "Month Year"
            const formatted = ` Active Since ${month} ${year}`;

            return formatted;
        } else {
            return null; // No documents found
        }

    } catch (error: any) {
        throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
};

export default getDatacompanyactivetime;
