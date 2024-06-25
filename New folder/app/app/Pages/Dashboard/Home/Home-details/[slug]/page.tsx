

// export default function details({params}:any){
//     return <div>
//         <h1>details: {params.slug}</h1>
//     </div>
// }


// pages/details.tsx
"use client"
import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../../../../firbaseconfig';
import '../../../../../globals.css';
import Image from 'next/image';

export default function DetailsPage({ params }: any) {
  const router: any = useRouter();
  //   const {id} = router.query;
  const [details, setDetails] = useState<any>(null);
 

  useEffect(() => {
    async function fetchDetails() {
      if (!params.slug) return;
      const docRef: any = doc(db, 'jobs', params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDetails(docSnap.data());
       
      } else {
        console.log('No such document!');
      }
    }
    fetchDetails();
  }, [params.slug]);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (



    <div className="flex min-h-screen flex-col items-center justify-between">
      <div className="wrapper">

        <div className="body">
          <div className="job-wrpper details" >
            <div className="job-header">
              {/* <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/> */}
              {/* <Image src={details.image} width={32} height={32} alt='Company' /> */}
              {details.image ? (
        <Image src={details.image} width={32} height={32} alt="Company" />
      ) : (
        <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
      )}
              <div>
                <p>{details.title}</p>
                <span>{details.category}</span>
              </div>
            </div>

            <div className="singleline">
              <div className="job-body">
                <Image src="/icon/building-2.svg" width={16} height={16} alt="map" />
                <span> {details.location}</span>
              </div>
              <div className="job-body">
                <Image src="/icon/map-pin.svg" width={16} height={16} alt="map" />
                <span> {details.location}</span>
              </div>
            </div>

          </div>
          <div className="job-card">
          <div className="job-wrppernew" >
          <div className="job-header">           
          <Image src="/icon/briefcase-business-gray.svg" width={16} height={16} alt="Logo"/>
              <div>  
              <span>Job type</span>
              <p>Parttime</p>
              </div>
            </div>
          </div>

          <div className="job-wrppernew" >
          <div className="job-header">           
          <Image src="/icon/wallet-gray.svg" width={16} height={16} alt="Logo"/>
              <div>  
              <span>Salary (monthly)</span>
              <p>₹ {details.start_salary} - {details.end_salary}</p>
              </div>
            </div>
          </div>

          <div className="job-wrppernew" >
          <div className="job-header">           
          <Image src="/icon/arrows-up-from-line-gray.svg" width={16} height={16} alt="Logo"/>
              <div>  
              <span>Age Limit</span>
              <p>{details.start_age} to {details.end_age}</p>
              </div>
            </div>
          </div>

          <div className="job-wrppernew" >
          <div className="job-header">           
          <Image src="/icon/clock-5-gray.svg" width={16} height={16} alt="Logo"/>
              <div>  
              <span>Timing</span>
              <p>{details.working_days}</p>
              </div>
            </div>
          </div>
          </div>


          <div className="job-wrpper Requirementscard" >
           
               <div className="job-body-des">          
               <span> Requirements</span>
             </div>
             <div className="job-body tag pb-4">          
               <span>12th pass</span>
               <span>Basic Computer knowledge</span>
               <span>Excel Knowledge</span>
             </div>

             <div className="job-body-des">          
               <span> Job Description</span>
               <div className="job-body">  
               <span>{details.description}</span>
               </div>
             </div>
           </div>




           <div className="job-wrpper Requirementscard" >
           
             <div className="job-body-des pb-4">          
               <span> About Company</span>
               <div className="job-body">  
               <span>Lorem ipsum dolor sit amet consectetur. Ante risus dignissim sed id lectus pulvinar tortor. Ultrices ultrices phasellus luctus ut pretium urna ultrices. Metus quam amet suspendisse lobortis odio. Faucibus Read more...</span>
               </div>
             </div>

             <div className="job-body-des">          
               <span> About Company</span>
               <div className="job-body">  
               <span>Lorem ipsum dolor sit amet consectetur. Ante risus dignissim sed id lectus pulvinar tortor. Ultrices ultrices phasellus luctus ut pretium urna ultrices. Metus quam amet suspendisse lobortis odio. Faucibus Read more...</span>
               </div>
             </div>
           </div>


           <div className="btn">
            <button>Apply Now</button>
           </div>

          

        </div>
      </div>
    </div>
  );
}
