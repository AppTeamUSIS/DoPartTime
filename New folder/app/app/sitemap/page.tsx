import { db } from "../firbaseconfig";
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { QueryConstraint, where, orderBy, startAfter, limit, query, collection, getDocs } from "firebase/firestore";

const removeFile = (filePath: string): void => {
    try {
        fs.unlinkSync(filePath); // Synchronously removes the file
        console.log(`${filePath} was removed`);
    } catch (err) {
        console.error(`Error removing ${filePath}: ${err}`);
    }
};

// Function to create a new file and store XML data
const createAndStoreXML = (filePath: string, xmlData: string): void => {
    try {
        fs.writeFileSync(filePath, xmlData); // Synchronously writes data to a file
        console.log(`${filePath} was created and XML data was stored`);
    } catch (err) {
        console.error(`Error creating ${filePath}: ${err}`);
    }
};
const formatDate = () => {
    // Create a new Date object for the current date and time
    const currentDate = new Date();
    console.log(currentDate);
    // Get date components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getUTCDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return formattedDate;
};
const getData = async () => {
    try {

        const queryConstraints: QueryConstraint[] = [];

        queryConstraints.push(where('status', '!=', 0));

        // if (timeperiod.length >= 1) {
        //     queryConstraints.push(where('tag_store', 'array-contains', timeperiod));
        // }
        queryConstraints.push(orderBy('status', 'asc'));

        const postsRef = query(collection(db, "jobs"), ...queryConstraints);
        const querySnapshot = await getDocs(postsRef);



        const promises = querySnapshot.docs.map(async (doc) => {
            const data: any = { id: doc.id, ...doc.data() };
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
const sitemap_main = () => {
    // Example XML data
    const xmlData: string = `<sitemapindex>
<sitemap>

<loc>hhttps://do-part-time.vercel.app/sitemap_jobs.xml</loc>
<lastmod>${formatDate()}</lastmod>
</sitemap>
<sitemap>
<loc>hhttps://do-part-time.vercel.app/sitemap_jobs_location.xml</loc>
<lastmod>${formatDate()}</lastmod>
</sitemap>
<sitemap>
<loc>hhttps://do-part-time.vercel.app/sitemap_jobs_area.xml</loc>
<lastmod>${formatDate()}</lastmod>
</sitemap>
</sitemapindex>`;

    // Example file path
    const filePath: string = 'sitemap.xml';

    // Removing existing file if exists
    removeFile(filePath);

    // Creating new file and storing XML data
    createAndStoreXML(filePath, xmlData);
    console.log(filePath);

}
const generateSitemapEntry = (value: any, priority: any) => {
    return `
   <url>
<loc>${value}</loc>
<lastmod>${formatDate()}</lastmod>
<priority>${priority}</priority>
</url>
  `;
};
const sitemap_job = async () => {
    let value_of = await getData();
    // Example XML data
    const xmlData: string = `<urlset>
${(value_of).map(entry => generateSitemapEntry('https://do-part-time.vercel.app/Pages/Jobs/Job-details/' + entry.id, 0.900)).join('\n')}
    </urlset>
    `;

    // Example file path
    const filePath: string = 'sitemap_jobs.xml';

    // Removing existing file if exists
    removeFile(filePath);

    // Creating new file and storing XML data
    createAndStoreXML(filePath, xmlData);
    console.log(filePath);

}
const sitemap_location = async () => {
    let value_of = await getData();
    // Example XML data
    const xmlData: string = `<urlset>
${(value_of).map(entry => generateSitemapEntry('https://do-part-time.vercel.app/jobs/' + entry.location, 0.700)).join('\n')}
    </urlset>
    `;

    // Example file path
    const filePath: string = 'sitemap_jobs_location.xml';

    // Removing existing file if exists
    removeFile(filePath);

    // Creating new file and storing XML data
    createAndStoreXML(filePath, xmlData);
    console.log(filePath);

}
const sitemap_area = async () => {
    let value_of = await getData();
    // Example XML data
    const xmlData: string = `<urlset>
${(value_of).map(entry => {
        if (entry.location != entry.area) {
            return generateSitemapEntry('https://do-part-time.vercel.app/jobs/' + entry.location + '/' + entry.area, 0.600)
        }
    }).join('\n')}
    </urlset>
    `;

    // Example file path
    const filePath: string = 'sitemap_jobs_area.xml';

    // Removing existing file if exists
    removeFile(filePath);

    // Creating new file and storing XML data
    createAndStoreXML(filePath, xmlData);
    console.log(filePath);

}
export default async function Details(parames: any) {
    await sitemap_main();
    await sitemap_job();
    await sitemap_location();
    await sitemap_area();
    return (<div>genarting sitemap wait......</div>);



}



