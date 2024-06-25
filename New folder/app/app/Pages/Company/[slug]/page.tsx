
// "use client"
// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from './../../../firbaseconfig';
// import Image from 'next/image';
// import Link from "next/link";



// export default function details({ params }: any) {
//   const [companyDetails, setCompanyDetails] = useState<any>(null);

//   useEffect(() => {
//     async function fetchDetails() {
//       if (!params.slug) return;

//        // Company details Start
//       const companyDocRef = doc(db, 'company', params.slug);
//       const companyDocSnap = await getDoc(companyDocRef);
//       if (companyDocSnap.exists()) {
//         setCompanyDetails(companyDocSnap.data());

//         console.log("company details", companyDocSnap.data())
//       } else {
//         console.log('Company details not found!');
//       }
//       // Company details End



//     }
//     fetchDetails();
//   }, [params.slug]);


//   if (!companyDetails) {
//     return <div>Loading...</div>;
//   }
//   return <div>
    
//     <div className="flex min-h-screen flex-col items-center justify-between">

//     <div className="wrapper">

//     <div className="body">

      
//     <div className="job-wrpper details" >
//              <div className="job-header">
//                {companyDetails.logo ? (
//          <Image src={companyDetails.logo} width={32} height={32} alt="Company" />
//        ) : (
//          <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
//        )}
//                <div>
//                  <p>{companyDetails.name}</p>           

//                 <span>{companyDetails.name}</span> 

                 


//                </div>
//              </div>
 
//              <div className="singleline">
//                <div className="job-body">
//                  <Image src="/icon/building-2.svg" width={16} height={16} alt="map" />
//                  <span> {companyDetails.name}</span>
//                </div>
//                <div className="job-body">
//                  <Image src="/icon/map-pin.svg" width={16} height={16} alt="map" />
//                  <span> {companyDetails.location}</span>
//                </div>
//              </div>
 
//            </div>
//            <div className="job-wrpper Requirementscard" >
            
//             <div className="job-body-des pb-4">          
//               <span> About Company</span>
//               <div className="job-body">  
//               <span>{companyDetails.description}</span>
//               </div>
//             </div>
//           </div>

//           <div className="job-wrpper Requirementscard" >
            
//             <div className="job-body-des pb-4">          
//               <span> Contact details</span>
//               <div className="job-body new">  
//               <span>Name - {companyDetails.contact_name}</span>
//               <span>Email - {companyDetails.contact_email}</span>
//               <span>Phone - {companyDetails.contact_mobile}</span> 
//               <span>Website - {companyDetails.website}</span>
//               {/* <p>Address - {companyDetails.contact_name}</p> */}
//               </div>
//             </div>
//           </div>

//     </div>
//     </div>


//     </div>
//   </div>
// }



import { db } from './../../../firbaseconfig';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

function formatTimeRange(start_time: any, end_time: any) {
  if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
    return " time not mention";
  }
  const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
  const startDate = new Date(start_time.seconds * 1000);
  const endDate = new Date(end_time.seconds * 1000);

  const formattedStartTime = startDate.toLocaleTimeString('en-US', options);
  const formattedEndTime = endDate.toLocaleTimeString('en-US', options);

  return `${formattedStartTime} - ${formattedEndTime}`;
}




function formatPostedTime(publish_time: any) {
  const timestamp = publish_time;
  const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  const date = new Date(milliseconds);
  const postDate = new Date(date);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - postDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  if (daysDifference === 0) {
    return "Posted today";
  } else if (daysDifference === 1) {
    return "Posted 1 day ago";
  } else {
    return `Posted ${daysDifference} days ago`;
  }
}
const company = async ({ params }: any) => {
  const getData = async () => {
    try {
      const docRef = doc(db, 'company', params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('User not found');
      }
    } catch (error:any) {
      throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
  };

  try {
    const apiData:any = await getData();
    console.log("Company ID:", apiData.id);
    const companyRef = doc(db, 'company', apiData.id);

    const jobsQuery = query(
      collection(db, "jobs"),
      where("company", "==", companyRef )
    );
    const jobSnapshot = await getDocs(jobsQuery);
    console.log("Number of job listings:", jobSnapshot.size);
    const jobList:any = [];

    // jobSnapshot.forEach(doc => {
    //     jobList.push({ id: doc.id, ...doc.data() });
    //   });
    
    const jobdetails:any =  jobSnapshot.docs.forEach(doc=>
      // doc.data()
      jobList.push({ id: doc.id, ...doc.data() })
    )

  

    
    return (
      <>
        <h2  className="text-center p-10">Company</h2>
        <div>
          <div  key={apiData.id}>
            <div className="flex min-h-screen flex-col items-center justify-between">

     <div className="wrapper">

     <div className="body">
      {/* <h1>{apiData.id}</h1> */}
       <div className="job-wrpper details" >
             <div className="job-header">
                {apiData.logo ? (
         <Image src={apiData.logo} width={32} height={32} alt="Company" />
       ) : (
          <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
        )}
               <div>
                  <p>{apiData.name}</p>           

                 <span>{apiData.name}</span> 

                 


               </div>
             </div>
 
             <div className="singleline">
                <div className="job-body">
                 <Image src="/icon/building-2.svg" width={16} height={16} alt="map" />
                 <span> {apiData.name}</span>
               </div>
               <div className="job-body">
                  <Image src="/icon/map-pin.svg" width={16} height={16} alt="map" />
                 <span> {apiData.location}</span>
               </div>
              </div>
 
           </div>
           <div className="job-wrpper Requirementscard" >
            
            <div className="job-body-des pb-4">          
               <span> About Company</span>
               <div className="job-body">  
               <span>{apiData.description}</span>
              </div>
             </div>
           </div>

          <div className="job-wrpper Requirementscard" >
            
             <div className="job-body-des pb-4">          
              <span> Contact details</span>
               <div className="job-body new">  
               <span>Name - {apiData.contact_name}</span>
              <span>Email - {apiData.contact_email}</span>
              <span>Phone - {apiData.contact_mobile}</span> 
              <span>Website - {apiData.website}</span>
               {/* <p>Address - {companyDetails.contact_name}</p> */}
               </div>
            </div>
          </div>

     </div>
     <div className="job-listings">
              {/* <h3>Job Listings</h3> */}
              <h2  className="text-center p-10">Job Listings</h2>
              {/* <ul> */}
            {/* <h1> hai {jobdetails}</h1> */}
            {/* <h1>hai {JSON.stringify(jobList)}</h1> */}
               
                {jobList.map((job:any) => (

                  // <li key={job.id}>
                  //   <Link href={`Pages/Jobs/Job-details/${job.id}`}>                   
                  //     <span>{job.title}</span>
                  //   </Link>
                  // </li>
                  <div className="job-wrpper" key={job.id}>
                    {/* <Link href={`/Pages/Company/${jobData.company.id}`}>{companyData.name}</Link> */}
                  <Link href={`/Pages/Jobs/Job-details/${job.id}`}>
                    <div className="job-header">
                      {/* <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/> */}
                      {/* <Image src={message.image} width={32} height={32} alt="Logo"/> */}
                      {job.image ? (
                        <Image src={job.image} width={32} height={32} alt="Company" />
                      ) : (
                        <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                      )}
                      <div>
                        <p>{job.title}</p>
                        <span>{job.title}</span>
                      </div>
                    </div>
    
                    <div className="job-body">
                      <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                      <span> {job.location}</span>
                    </div>
                    <div className="job-body">
                      <Image src="/icon/clock.svg" width={16} height={16} alt="Logo" />
    
                      <span>{formatTimeRange(job.start_time, job.end_time)}  {job.working_days}</span>
    
                    </div>
                    <div className="job-body">
                      <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
                      <span>₹ {job.start_salary} - {job.end_salary} per month</span>
                    </div>
                    <div className="postby">
                      <span>{formatPostedTime(job.publish_time)}</span>
                    </div>
                  </Link>
                </div>
                ))}
              {/* </ul> */}
            
            </div>
     </div>


 

     </div>
          </div>


        </div>
      </>
    );
  } catch (error:any) {
    console.error(error);
    return (
      <>
        <h2>Company</h2>
        <div>Error fetching data: {error.message}</div>
      </>
    );
  }
};

export default company;
