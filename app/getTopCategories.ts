import { collection, doc, DocumentSnapshot, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore";
import { db } from "../app/firbaseconfig"; // Adjust the path to your Firebase config


async function getTopCategories() {
    const jobsSnapshot = await getDocs(collection(db, 'jobs'));
    const jobs = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const categoryCount: { [key: string]: number } = {};
    const company = [];
    jobs.forEach((job: any) => {
        job.category.forEach((categoryId: any) => {
            if (categoryCount[categoryId.id]) {
                categoryCount[categoryId.id] += 1;
            } else {
                categoryCount[categoryId.id] = 1;
            }
        });
    });
    console.log(categoryCount);
    const sortedCategories = Object.entries(categoryCount)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([categoryId]) => categoryId);

    const topCategoryPromises: Promise<{ id: string, data: any }>[] = sortedCategories.map((categoryId) =>
        getDoc(doc(db, 'category', categoryId)).then((docSnapshot) => ({
            id: docSnapshot.id,
            data: docSnapshot.data(),
        }))
    );

    const topCategorySnapshots = await Promise.all(topCategoryPromises);
    console.log('topcate');
    console.log(topCategorySnapshots);
    return topCategorySnapshots;
}

export default getTopCategories;