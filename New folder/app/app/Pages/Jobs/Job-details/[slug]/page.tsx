
//  "use client"
//  import { useEffect, useState } from 'react';
//  import Link from "next/link";
//  import { useRouter } from "next/navigation";
//  import { doc, getDoc } from 'firebase/firestore';
//  import { db } from './../../../../firbaseconfig';
//  import '../../../../globals.css';
//  import Image from 'next/image';
//  import Head from 'next/head';
//  import React from 'react';
// //  import { Link } from 'react-router-dom';



// //  const page = ({params}:any) =>{
// //   const {id} = params;
// //  }





//  export default function DetailsPagenew({ params }: any) {
//   const {id} = params;
//    console.log("details",params)
//    const router: any = useRouter();
//    //   const {id} = router.query;
//    const [details, setDetails] = useState<any>(null);
//    const [companyDetails, setCompanyDetails] = useState<any>(null);

//    const [categories, setCategories] = useState<any>([]);

//    var comdeta :any;



//   //  const home = () =>{
//   //   alert("hai");
//   //   router.push(`/Pages/Company/${details.company}`);
//   // }

//   // console.log("testing",details.company.id)

//    useEffect(() => {
//      async function fetchDetails() {
//        if (!params.slug) return;
//        const docRef = doc(db, 'jobs', params.slug);
//        const docSnap = await getDoc(docRef);
//        if (docSnap.exists()) {
//          const jobData = docSnap.data();
//          console.log("jobdara",jobData)
//          setDetails(jobData);

//          // Company details start
//          const companyId = jobData.company.id;
//          comdeta = jobData.company.id;



//          console.log("companydetails",companyId);
//          const companyDocRef = doc(db, 'company', companyId);
//          const companyDocSnap = await getDoc(companyDocRef);
//          if (companyDocSnap.exists()) {
//            setCompanyDetails(companyDocSnap.data());

//            console.log("company details",companyDocSnap.data())
//          } else {
//            console.log('Company details not found!');
//          }
//           // Company details End

//            // categoryDetails details start
//            const categoryIds = jobData.category.map((categoryRef:any) => categoryRef.id);
//           const categoryDetailsPromises = categoryIds.map(async (categoryId: string) => {
//            const categoryDocRef = doc(db, 'category', categoryId); 
//            const categoryDocSnap = await getDoc(categoryDocRef);
//            if (categoryDocSnap.exists()) {
//              return categoryDocSnap.data();
//            } else {
//              console.log(`Category details not found for ID: ${categoryId}`);
//              return null;
//            }
//          });
//          const categoryDetails = await Promise.all(categoryDetailsPromises);
//          setCategories(categoryDetails.filter(Boolean));

//          // categoryDetails details end

//        } else {
//          console.log('No such document!');
//        }
//      }
//      fetchDetails();
//    }, [params.slug]);

//    if (!details || !companyDetails) {
//      return <div>Loading...</div>;
//    }





//    return (

//      <>

//      {/* <Head>
//      <script type="application/ld+json">
//       {`
//     {
//       "@context" : "https://schema.org/",
//       "@type" : "JobPosting",
//       "title" : "Software Engineer",
//       "description" : "<p>Google aspires to be an organization that reflects the globally diverse audience that our products and technology serve. We believe that in addition to hiring the best talent, a diversity of perspectives, ideas and cultures leads to the creation of better products and services.</p>",
//       "identifier": {
//         "@type": "PropertyValue",
//         "name": "Google",
//         "value": "1234567"
//       },
//       "datePosted" : "2017-01-18",
//       "validThrough" : "2017-03-18T00:00",
//       "applicantLocationRequirements": {
//         "@type": "Country",
//         "name": "USA"
//       },
//       "jobLocationType": "TELECOMMUTE",
//       "employmentType": "FULL_TIME",
//       "hiringOrganization" : {
//         "@type" : "Organization",
//         "name" : "Google",
//         "sameAs" : "https://www.google.com",
//         "logo" : "https://www.example.com/images/logo.png"
//       },
//       "baseSalary": {
//         "@type": "MonetaryAmount",
//         "currency": "USD",
//         "value": {
//           "@type": "QuantitativeValue",
//           "value": 40.00,
//           "unitText": "HOUR"
//         }
//       }
//     }
//     `}
//     </script>
//      </Head> */}




//      <div className="flex min-h-screen flex-col items-center justify-between">
//        <div className="wrapper">

//          <div className="body">
//            <div className="job-wrpper details" >
//              <div className="job-header">
//                {/* <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/> */}
//                {/* <Image src={details.image} width={32} height={32} alt='Company' /> */}
//                {details.image ? (
//          <Image src={details.image} width={32} height={32} alt="Company" />
//        ) : (
//          <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
//        )}
//                <div>
//                  <p>{details.title}</p>
//                  {/* <Link href={`Pages/Company/${companyDetails.id}`}><span>{companyDetails.name}</span></Link>  */}



//                  <Link href={`/Pages/Company/${details.company.id}`}>{companyDetails.name}</Link>

//                  {/* <span onClick={home}>haridass</span> */}

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
//            <div className="job-card">
//            <div className="job-wrppernew" >
//            <div className="job-header">           
//            <Image src="/icon/briefcase-business-gray.svg" width={16} height={16} alt="Logo"/>
//                <div>  
//                <span>Job type</span>
//                <p>Parttime</p>
//                </div>
//              </div>
//            </div>

//            <div className="job-wrppernew" >
//            <div className="job-header">           
//            <Image src="/icon/wallet-gray.svg" width={16} height={16} alt="Logo"/>
//                <div>  
//                <span>Salary (monthly)</span>
//                <p>₹ {details.start_salary} - {details.end_salary}</p>
//                </div>
//              </div>
//            </div>

//            <div className="job-wrppernew" >
//            <div className="job-header">           
//            <Image src="/icon/arrows-up-from-line-gray.svg" width={16} height={16} alt="Logo"/>
//                <div>  
//                <span>Age Limit</span>
//                <p>{details.start_age} to {details.end_age}</p>
//                </div>
//              </div>
//            </div>

//            <div className="job-wrppernew" >
//            <div className="job-header">           
//            <Image src="/icon/clock-5-gray.svg" width={16} height={16} alt="Logo"/>
//                <div>  
//                <span>Timing</span>
//                <p>{details.working_days}</p>
//                </div>
//              </div>
//            </div>
//            </div>


//            <div className="job-wrpper Requirementscard" >

//                 <div className="job-body-des">          
//                 <span> Requirements</span>
//               </div>
//               {/* <h2>Categories:</h2>
//                <ul>
//                  {categories.map((category: any) => (
//                    <li key={category.id}>
//                      <p>{category.name}</p>
//                    </li>
//                  ))}
//                </ul> */}

//               <div className="job-body tag pb-4">  
//               {categories.map((category: any) => ( 
//                    <div  key={category.id}>
//                    <span>{category.name}</span>
//                    </div>

//                ))}
//               </div>


//               <div className="job-body-des">          
//                 <span> Job Description</span>
//                 <div className="job-body">  
//                 <span>{details.description}</span>
//                 </div>
//               </div>
//             </div>




//             <div className="job-wrpper Requirementscard" >

//               <div className="job-body-des pb-4">          
//                 <span> About Company</span>
//                 <div className="job-body">  
//                 <span>{companyDetails.description}</span>
//                 </div>
//               </div>

//               <div className="job-body-des">          
//                 <span> About Company</span>
//                 <div className="job-body">  
//                 <span>Lorem ipsum dolor sit amet consectetur. Ante risus dignissim sed id lectus pulvinar tortor. Ultrices ultrices phasellus luctus ut pretium urna ultrices. Metus quam amet suspendisse lobortis odio. Faucibus Read more...</span>
//                 </div>
//               </div>
//             </div>


//             <div className="btn">
//              <button>Apply Now</button>
//             </div>



//          </div>
//        </div>



//      </div>



//      </>
//    );
//  }











import { db } from './../../../../firbaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next'
import Head from 'next/head';
import Script from 'next/script'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';



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
const Jobdetailspage = async ({ params }: any) => {

  const getData = async () => {
    if (!params.slug) return;
    try {
      const docRef = doc(db, 'jobs', params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const jobData = docSnap.data();
        console.log("job data", jobData);

        // fetching tag
        const taglist = docSnap.data().tag_store;

        // Fetching company details
        const companyId = jobData.company.id;
        console.log("company ID:", companyId);
        const companyDocRef = doc(db, 'company', companyId);
        const companyDocSnap = await getDoc(companyDocRef);

        if (companyDocSnap.exists()) {
          const companyData = companyDocSnap.data();
          console.log("company details:", companyData);

          const categoryIds = jobData.category.map((categoryRef: any) => categoryRef.id);
          const categoryDetailsPromises = categoryIds.map(async (categoryId: string) => {
            const categoryDocRef = doc(db, 'category', categoryId);
            const categoryDocSnap = await getDoc(categoryDocRef);
            if (categoryDocSnap.exists()) {
              return categoryDocSnap.data();
            } else {
              console.log(`Category details not found for ID: ${categoryId}`);
              return null;
            }
          });
          const categoryDetails = await Promise.all(categoryDetailsPromises);
          console.log("category details:", categoryDetails);

          // Return both job and company data
          return { jobData, companyData, categoryDetails, taglist };
        } else {
          console.log('Company details not found!');
          throw new Error('Company details not found');
        }
      } else {
        console.log('Job details not found!');
        throw new Error('Job details not found');
      }
    } catch (error: any) {
      console.error('Error fetching details:', error);
      throw new Error('Error fetching details: ' + error.message);
    }
  };
  async function getdocgettagid(tag: any) {
    const documentValues = [];
    for (const docRef of tag) {
      try {

        const docSnapshot = await getDoc(docRef);


        if (docSnapshot.exists()) {

          documentValues.push(docRef.id);
        } else {
          console.log(`Document does not exist for reference: ${docRef.id}`);
        }
      } catch (error) {
        console.error(`Error fetching document: ${docRef.id}`, error);
      }
    }
    console.log(`Document for reference: ${documentValues}`);
    return documentValues;
  }
  try {
    const { jobData, companyData, categoryDetails, taglist }: any = await getData();
    let jsonItems: any = [];
    let valueset = 1;
    for (let index = 1; index <= 5; index++) {
      if (jobData.location != jobData.area || index != 4) {
        jsonItems.push({
          "@type": "ListItem",
          "name": (index == 1) ? 'Home' : (index == 2) ? 'Jobs' : (index == 3) ? jobData.location : (index == 4) ? jobData.area : jobData.tiltle,
          "position": valueset,
          "item": {
            "@type": "Thing",
            "@id": (index == 1) ? 'https://do-part-time.vercel.app/' : (index == 2) ? 'https://do-part-time.vercel.app/' + 'Jobs' : (index == 3) ? 'https://do-part-time.vercel.app/jobs/' + jobData.location : (index == 4) ? 'https://do-part-time.vercel.app/jobs/' + jobData.location + "/" + jobData.area : 'https://do-part-time.vercel.app/Pages/Jobs/Job-details/' + params.slug,
          },
        },);
        valueset++;
      }
    }
    const schemaData = {
      "@context": "http://schema.org",
      "@type": "JobPosting",
      "title": jobData.title,
      "description": jobData.description,
      "datePosted": formatPostedTime(jobData.publish_time),
      "employmentType": "PART_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": companyData.name
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": jobData.area + ',',
          "addressLocality": jobData.location + ',',
          "addressRegion": jobData.state + ',',
          "addressCountry": jobData.country

        }
      },
    }
    const schemabreadcrumb = {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [jsonItems],
    }
    return (
      <>
        {/* <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        /> */}
        <Script
          id="schema-data-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <Script
          id="schema-data-script1"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemabreadcrumb) }}
        />

        <h2 className="text-center p-10">Job details</h2>
        <Breadcrumbs>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Music</BreadcrumbItem>
          <BreadcrumbItem>Artist</BreadcrumbItem>
          <BreadcrumbItem>Album</BreadcrumbItem>
          <BreadcrumbItem>Song</BreadcrumbItem>
        </Breadcrumbs>
        <div>
          <div key={jobData.id}>
            <div className="flex min-h-screen flex-col items-center justify-between">
              <div className="wrapper">

                <div className="body">

                  <div className="job-wrpper details" >
                    <div className="job-header">
                      {/* <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/> */}
                      {/* <Image src={details.image} width={32} height={32} alt='Company' /> */}
                      {jobData.image ? (
                        <Image src={jobData.image} width={32} height={32} alt="Company" />
                      ) : (
                        <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                      )}
                      <div>
                        <p>{jobData.title}</p>
                        {/* <Link href={`Pages/Company/${companyDetails.id}`}><span>{companyDetails.name}</span></Link>  */}



                        <Link href={`/Pages/Company/${jobData.company.id}`}>{companyData.name}</Link>

                        {/* <span onClick={home}>haridass</span> */}

                      </div>
                    </div>

                    <div className="singleline">
                      <div className="job-body">
                        <Image src="/icon/building-2.svg" width={16} height={16} alt="map" />
                        <span> {companyData.name}</span>
                      </div>
                      <div className="job-body">
                        <Image src="/icon/map-pin.svg" width={16} height={16} alt="map" />
                        <span> {companyData.location}</span>
                      </div>
                    </div>

                  </div>
                  <div className="job-card">
                    <div className="job-wrppernew" >
                      <div className="job-header">
                        <Image src="/icon/briefcase-business-gray.svg" width={16} height={16} alt="Logo" />
                        <div>
                          <span>Job type</span>
                          <p>Parttime</p>
                        </div>
                      </div>
                    </div>

                    <div className="job-wrppernew" >
                      <div className="job-header">
                        <Image src="/icon/wallet-gray.svg" width={16} height={16} alt="Logo" />
                        <div>
                          <span>Salary (monthly)</span>
                          <p>₹ {jobData.start_salary} - {jobData.end_salary}</p>
                        </div>
                      </div>
                    </div>

                    <div className="job-wrppernew" >
                      <div className="job-header">
                        <Image src="/icon/arrows-up-from-line-gray.svg" width={16} height={16} alt="Logo" />
                        <div>
                          <span>Age Limit</span>
                          <p>{jobData.start_age} to {jobData.end_age}</p>
                        </div>
                      </div>
                    </div>

                    <div className="job-wrppernew" >
                      <div className="job-header">
                        <Image src="/icon/clock-5-gray.svg" width={16} height={16} alt="Logo" />
                        <div>
                          <span>Timing</span>
                          <p>{jobData.working_days}</p>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="job-wrpper Requirementscard" >

                    <div className="job-body-des">
                      <span> Requirements</span>
                    </div>


                    <div className="job-body tag pb-4">
                      {categoryDetails.map((category: any) => (
                        <div key={category.id}>
                          <span>{category.name}</span>
                        </div>

                      ))}
                    </div>


                    <div className="job-body-des">
                      <span> Job Description</span>
                      <div className="job-body">
                        <span>{jobData.description}</span>
                      </div>
                    </div>
                  </div>




                  <div className="job-wrpper Requirementscard" >

                    <div className="job-body-des pb-4">
                      <span> About Company</span>
                      <div className="job-body">
                        <span>{companyData.description}</span>
                      </div>
                    </div>

                    <div className="job-body-des">
                      <span> About Company</span>
                      <div className="job-body">
                        <span>Lorem ipsum dolor sit amet consectetur. Ante risus dignissim sed id lectus pulvinar tortor. Ultrices ultrices phasellus luctus ut pretium urna ultrices. Metus quam amet suspendisse lobortis odio. Faucibus Read more...</span>
                      </div>
                    </div>
                  </div>

                  <div className="tag-list">

                    {taglist.map((list: any) => (
                      <div className="tag-values" key={list}>

                        <Link href={{
                          pathname: '../../../jobs/tag/' + list,

                        }}>
                          <button>{list}</button>
                        </Link>
                      </div>

                    ))}
                  </div>



                  {jobData.status == 1 && (
                    <div className="btn">
                      <Link href={`https://a-i-gen-project-60pl4r.flutterflow.app/job/${params.slug}`}>
                        <button>Apply Now</button>
                      </Link>
                    </div>
                  )}
                  {jobData.status == 2 && (
                    <div className="closed">
                      Closed
                    </div>
                  )}
                </div>
              </div>



            </div>

          </div>
        </div >
      </>
    );
  } catch (error: any) {
    console.error(error);
    return (
      <>
        <h2>Company</h2>
        <div>Error fetching data: {error.message}</div>
      </>
    );
  }
};
export default Jobdetailspage;