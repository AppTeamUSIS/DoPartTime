
// client side api fetching start 

// "use client"
// // "use server"
// import { db } from './firbaseconfig';
// import { collection, getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import './globals.css';
// import Link from 'next/link';
// import Image from 'next/image';
// // import { useRouter } from 'next/router';
// import { useRouter } from 'next/navigation';
// // import { useEffect, useState } from 'react';




// async function fetchDataFromFirestore() {
//   const querySnapshot = await getDocs(collection(db, "jobs"));
//   const data: any = [];
//   querySnapshot.forEach((doc) => {
//     const message: any = { id: doc.id, ...doc.data() };
//     data.push({ id: doc.id, ...doc.data() });
//   });
//   return data;
// }



// function formatTimeRange(start_time: any, end_time: any) {
//   if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
//     return " time not mention";
//   }
//   const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
//   const startDate = new Date(start_time.seconds * 1000);
//   const endDate = new Date(end_time.seconds * 1000);

//   const formattedStartTime = startDate.toLocaleTimeString('en-US', options);
//   const formattedEndTime = endDate.toLocaleTimeString('en-US', options);

//   return `${formattedStartTime} - ${formattedEndTime}`;
// }




// function formatPostedTime(publish_time: any) {
//   const timestamp = publish_time;
//   const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
//   const date = new Date(milliseconds);
//   const postDate = new Date(date);
//   const currentDate = new Date();
//   const timeDifference = currentDate.getTime() - postDate.getTime();
//   const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
//   if (daysDifference === 0) {
//     return "Posted today";
//   } else if (daysDifference === 1) {
//     return "Posted 1 day ago";
//   } else {
//     return `Posted ${daysDifference} days ago`;
//   }
// }


// export default function Dashboard() {
//   const router:any = useRouter();
//   const [userData, setUserData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState<string>('');
//   const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>('');
//   useEffect(() => {
//     async function fetchData() {
//       const data = await fetchDataFromFirestore();
//       setUserData(data);
//       console.log("time", data)
//     }
//     fetchData();
//   }, []);


//   useEffect(() => {
//     const queryParams:any = {};
//     if (searchQuery) queryParams.search = searchQuery;
//     if (selectedLocation) queryParams.location = selectedLocation;
//     if (selectedSalaryRange) queryParams.salary = selectedSalaryRange;
//     if (typeof router.pathname === 'string') {
//       router.push({
//         pathname: router.pathname,
//         query: queryParams,
//       });
//     }

//     console.log("comapny",searchQuery)
//     console.log("Location",selectedLocation)
//     console.log("Salary",selectedSalaryRange)
//   }, [searchQuery, selectedLocation, selectedSalaryRange]);

//   useEffect(() => {
//     async function fetchData() {
//       const data = await fetchDataFromFirestore();
//       setUserData(data);
//     }
//     fetchData();
//   }, [router.query]);



//   const salaryRanges = [
//     "0 - 10000",
//     "10001 - 20000",
//     "20001 - 30000",
//     "30001 - 40000",
//     "40001 - 50000",

//   ];


//   const handleSearch = () => {
//     // if (!searchQuery) {
//     //   alert('Please enter a search query.');
//     //   return;
//     // }

//     const queryParams = new URLSearchParams();
//     queryParams.set('search', searchQuery);
//     if (selectedLocation) {
//       queryParams.set('location', selectedLocation);
//     }

//     const queryString = queryParams.toString();

//     if (queryString) {
//       router.push(`/Pages/Filter?${queryString}`);
//     } else {
//       router.push('/Pages/Filter');
//     }
// };





//   // const filteredData = userData.filter((job: any) => {
//   //   const companyMatches = job.title.toLowerCase().includes(searchQuery.toLowerCase());
//   //   const locationMatches = !selectedLocation || job.location === selectedLocation;
//   //   const salaryMatches = !selectedSalaryRange ||
//   //   (
//   //     !isNaN(job.start_salary) && !isNaN(job.end_salary) &&
//   //     job.start_salary >= parseInt(selectedSalaryRange.split('-')[0]) &&
//   //     job.end_salary <= parseInt(selectedSalaryRange.split('-')[1])
//   //   );



//   //   return companyMatches && locationMatches && salaryMatches;
//   // });


//   return (


//     <main className="flex min-h-screen flex-col items-center">
//       <h1>Firebase Data</h1>  

//       <h1><Link href="/Pages/Profile">Profile</Link></h1>

//       {/* <h1><Link href="/Pages/Profile/Profile_details/123">Profile details</Link></h1> */}



//       <div className="wrapper">
//         <div className="header wrapper">

//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search"
//         />
//           <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
//           <option value="">All Locations</option>
//           {Array.from(new Set(userData.map((job: any) => job.location))).map(location => (
//             <option key={location} value={location}>
//               {location}
//             </option>
//           ))}
//         </select>
//         <button onClick={handleSearch}>Search</button>

//         </div>
//         <div className="body">
//           {userData.map((message: any) => (


//             <div className="job-wrpper" key={message.id}>
//               <Link href={`Pages/Jobs/Job-details/${message.id}`}>
//                 <div className="job-header">
//                   {/* <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/> */}
//                   {/* <Image src={message.image} width={32} height={32} alt="Logo"/> */}
//                   {message.image ? (
//                     <Image src={message.image} width={32} height={32} alt="Company" />
//                   ) : (
//                     <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
//                   )}
//                   <div>
//                     <p>{message.title}</p>
//                     <span>{message.title}</span>
//                   </div>
//                 </div>

//                 <div className="job-body">
//                   <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
//                   <span> {message.location}</span>
//                 </div>
//                 <div className="job-body">
//                   <Image src="/icon/clock.svg" width={16} height={16} alt="Logo" />
//                   {/* <span>{formatTime(message.start_time)} - 7:00pm Mon - Fri</span> */}

//                   <span>{formatTimeRange(message.start_time, message.end_time)}  {message.working_days}</span>

//                 </div>
//                 <div className="job-body">
//                   <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
//                   <span>₹ {message.start_salary} - {message.end_salary} per month</span>
//                 </div>
//                 <div className="postby">
//                   {/* <span>Posted 2 days ago</span> */}
//                   <span>{formatPostedTime(message.publish_time)}</span>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>








//     </main>
//   );
// }


// // client side api fetching end 


// Server side api fetching start 

// import { db } from './firbaseconfig';
// import { collection, getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { FormEvent } from 'react'
// const getData = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(db, "jobs"));
//     const data: any = [];
//     querySnapshot.forEach((doc) => {
//       data.push({ id: doc.id, ...doc.data() });
//     });
//     return data;
//   } catch (error: any) {
//     throw new Error("Failed to fetch data from Firestore: " + error.message);
//   }
// }
// function formatTimeRange(start_time: any, end_time: any) {
//   if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
//     return "Time not mentioned";
//   }
//   const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
//   const startDate = new Date(start_time.seconds * 1000);
//   const endDate = new Date(end_time.seconds * 1000);

//   const formattedStartTime = startDate.toLocaleTimeString('en-US', options);
//   const formattedEndTime = endDate.toLocaleTimeString('en-US', options);

//   return `${formattedStartTime} - ${formattedEndTime}`;
// }

// function formatPostedTime(publish_time: any) {
//   const timestamp = publish_time;
//   const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
//   const date = new Date(milliseconds);
//   const postDate = new Date(date);
//   const currentDate = new Date();
//   const timeDifference = currentDate.getTime() - postDate.getTime();
//   const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
//   if (daysDifference === 0) {
//     return "Posted today";
//   } else if (daysDifference === 1) {
//     return "Posted 1 day ago";
//   } else {
//     return `Posted ${daysDifference} days ago`;
//   }
// }
// const dashboard: any = async () => {
//   try {
//     const apiData = await getData();
//     return (
//       <>  
//       <div className='centerpage'>
//         <h1 className="text-center ">Firebase Data</h1>
//         <h1 className="text-center p-10"> <Link href="/Pages/Profile">Profile</Link></h1>
//         <div className="text-center ">
//           <form action="/search/">
//             <input
//               type="text"
//               name='search'
//               placeholder="Search"
//             />
//             <button type='submit'>Search</button>

//           </form>

//           {apiData.map((item: any, index: any) => (
//             <div key={index}>
//               <div className="job-wrpper" key={item.id}>
//                 <div className="job-wrpper" key={item.id}>
//                   <Link href={`Pages/Jobs/Job-details/${item.id}`}>
//                     <div className="job-header">
//                       {item.image ? (
//                         <Image src={item.image} width={32} height={32} alt="Company" />
//                       ) : (
//                         <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
//                       )}
//                       <div>
//                         <p>{item.title}</p>
//                         <span>{item.title}</span>
//                       </div>
//                     </div>
//                     <div className="job-body">
//                       <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
//                       <span> {item.location}</span>
//                     </div>
//                     <div className="job-body">
//                       <Image src="/icon/clock.svg" width={16} height={16} alt="Logo" />
//                       <span>{formatTimeRange(item.start_time, item.end_time)}  {item.working_days}</span>
//                     </div>
//                     <div className="job-body">
//                       <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
//                       <span>₹ {item.start_salary} - {item.end_salary} per month</span>
//                     </div>
//                     <div className="postby">
//                       <span>{formatPostedTime(item.publish_time)}</span>
//                     </div>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         </div>
//       </>
//     );
//   } catch (error: any) {
//     console.error(error);
//     return (
//       <>
//         <h2>Profile</h2>
//         <div>Error fetching data: {error.message}</div>
//       </>
//     );
//   }
// }

// export default dashboard;






import { db } from './firbaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react'
const getData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const data: any = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error: any) {
    throw new Error("Failed to fetch data from Firestore: " + error.message);
  }
}
function formatTimeRange(start_time: any, end_time: any) {
  if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
    return "Time not mentioned";
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
const dashboard: any = async () => {
  try {
    const apiData = await getData();
    return (
      <>  
        <div className="jobsearch-wrapper">
          <div className="jobsearch-bg-widget">
            <div className="job-heading-card">
              <h2 className="job-count-heading">Over 2,000+ part-time jobs available in</h2>
              <div className="text-center"><span className="job-location-heading">Egmore, Chennai</span> <Link style={{ color:"#fff", fontWeight:500, fontSize:"14px", textDecorationLine:"underline"}} href="#">Change</Link></div>
            </div>
            <div className="flex flex-col flex-1 justify-center md:flex-row ms:flex-col mt-6">
            
            <div className="w-full md:w-[370px]">
              
              <form className="max-w-md mx-auto" action="/search/">   
                  <div className="relative">                      
                      <input type="search" id="default-search" className="global-search-bar block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" style={{ fontSize:"12px" }} placeholder="Search by locality, job type, company" required />
                      {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
                      <div className="absolute inset-y-0 end-0 flex items-center pe-2  pointer-events-none">
                       <Image src="/icon/ion_search.svg" width={24} height={24} alt="Search" />
                      </div>
                  </div>
              </form>

              {/* <form action="/search/">
                <input
                  type="text"
                  name='search'
                  placeholder="Search"
                />
                <button type='submit'>Search</button>

               </form> */}
            </div>
          </div>
          </div>
        </div>
        <div className="job-categories my-4">
          <h2 className="categories-title">Categories</h2>
          <div className="flex justify-between categories-card-row">
            <div className="categories-card">
               <div className="categories-card__title">Delivery Jobs</div>
               <div className="categories-card__value">1000+ Job openings</div>
            </div>
            <div className="categories-card">
               <div className="categories-card__title">Construction worker</div>
               <div className="categories-card__value">1500+ Job openings</div>
            </div>
            <div className="categories-card">
               <div className="categories-card__title">Content writer</div>
               <div className="categories-card__value">2000+ Job openings</div>
            </div>
            <div className="categories-card">
               <div className="categories-card__title">Tailoring or Handicrafts</div>
               <div className="categories-card__value">1000 Job openings</div>
            </div>
          </div>
        </div>
        <div className='my-5'>         
          <div className="job-list-wrpper">
            <h1 className='job-list-wrpper-title'>Explore jobs</h1>
            {apiData.map((item: any, index: any) => (
              <div key={index}>
                <div className="" key={item.id}>
                  <div className="job-list-card" key={item.id}>
                    <Link href={`Pages/Jobs/Job-details/${item.id}`}>
                      <div className="job-header">
                        {item.image ? (
                          <Image src={item.image} width={32} height={32} alt="Company" />
                        ) : (
                          <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                        )}
                        <div>
                          <p>{item.title}</p>
                          <span>{item.title}</span>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 md:flex-row ms:flex-col">
                        <div className="flex flex-col flex-1 md:flex-row ms:flex-col">
                          <div className="hidden md:block w-10"></div>
                          <div className="job-body">
                            <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                            <span> {item.location}</span>
                          </div>  
                          <div className="job-body">
                            <Image src="/icon/clock.svg" width={16} height={16} alt="Logo" />
                            <span>{formatTimeRange(item.start_time, item.end_time)}  {item.working_days}</span>
                          </div>
                          <div className="job-body">
                            <Image src="/icon/wallet.svg" width={16} height={16} alt="Logo" />
                            <span>₹ {item.start_salary} - {item.end_salary} per month</span>
                        </div>                          
                        </div>
                        <div className="postby">
                          <span>{formatPostedTime(item.publish_time)}</span>
                        </div>
                      </div>                    
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="my-5 ps-2 pe-2 py-2 flex justify-between items-center bg-white rounded-lg">
          <div className="text-sm">
            <span className='font-semibold'>Want to talk to someone?</span><span> Our customer support is here to help you. Monday to Friday 10:00am to 6:00pm</span>
          </div>
          <Link href="#" className='flex items-center' style={{ backgroundColor:"#DEE0FF", padding:"6px 20px", borderRadius:"08px", fontSize:"16px", fontWeight:500 }}> <Image src="/icon/whatsapp-ic.svg" width={27} height={27} alt="Whatsapp" /> +91 987655 43321</Link>
        </div>
      </>
    );
  } catch (error: any) {
    console.error(error);
    return (
      <>
        <h2>Profile</h2>
        <div>Error fetching data: {error.message}</div>
      </>
    );
  }
}

export default dashboard;


// Server side api fetching end 