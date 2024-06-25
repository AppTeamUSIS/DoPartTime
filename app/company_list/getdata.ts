import { collection, getDocs, limit, orderBy, OrderByDirection, query, QueryConstraint, startAfter, where } from "firebase/firestore";
import { db } from "../firbaseconfig"; // Adjust the path to your Firebase config
import getDatacompanyactivecount from "../Job_details/[slug]/getcompanycount";
import getDatacompanyactivetime from "./getlastactive";

interface GetDataParams {
    page: number;
    count?: boolean;
    lastid?: string | null;
    location?: string;
    area?: string;
    lastVisible?: boolean;
    sortby: string
}

interface Data {
    id: string;
    [key: string]: any; // Adjust the structure according to your actual job data
}

const pagination_size = 10; // Set your pagination size

const getData = async ({ page, count, lastid, location, area, lastVisible, sortby }: GetDataParams): Promise<Data[] | any> => {

    try {

        const queryConstraints: QueryConstraint[] = [];
        if (!count) {
            queryConstraints.push(limit(page >= 2 ? pagination_size * (page - 1) : pagination_size));
        }
        if (page >= 2 && (!count || !lastVisible)) {
            if (lastid) {
                queryConstraints.push(startAfter(lastid));
            }
        }
        if (location) {
            queryConstraints.push(where('location', '==', location));

        }
        if (area) {
            queryConstraints.push(where('area', '==', area));
        }
        if (sortby == 'Desc') {
            queryConstraints.push(orderBy('name', 'desc'));
        }
        else {

            queryConstraints.push(orderBy('name', 'asc'));
        }
        const postsRef = query(collection(db, "company"), ...queryConstraints);
        const querySnapshot = await getDocs(postsRef);
        const promises = querySnapshot.docs.map(async (doc) => {
            const company_count_last_month = await getDatacompanyactivecount({ company: doc.id, lastmonth: true });
            const company_count = await getDatacompanyactivecount({ company: doc.id });
            const company_active = await getDatacompanyactivetime({ company: doc.id });
            const data: Data = { id: doc.id, ...doc.data(), count_last: company_count_last_month, count: company_count, active: company_active };
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

export default getData;
