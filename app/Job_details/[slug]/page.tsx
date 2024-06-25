

import { db } from '../../firbaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next'
import Head from 'next/head';
import Script from 'next/script'
import getDatacompanyactivecount from './getcompanycount';



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
          const company_count = await getDatacompanyactivecount({ company: companyDocSnap.id });
          const companyData = { ...companyDocSnap.data(), id: companyDocSnap.id, count: company_count };
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
        {/* <h2 className="text-center p-10">Job details</h2> */}
        <div className="back-btn-row">
          <Link href="#" className='flex back-btn'> <Image src="/icon/ep_back.svg" className='mr-1' width={24} height={24} alt="Back" />Back</Link>
        </div>
        <div>
          <div key={jobData.id}>
            <div className="job-detail-hero-section flex">
              <div className="job-cmp-img mr-3">
                {companyData.image ? (
                  <Image src={companyData.image} width={105} height={105} alt="Company" />
                ) : (
                  <Image src="https://flowbite.com/docs/images/logo.svg" width={105} height={105} alt="Default Company Logo" />
                )}
              </div>
              <div className="job-hero-field w-full">
                <div className=" flex justify-between mb-2 w-full">
                  <h2 className='job-detail-title'>{jobData.title}</h2>
                  <div className="flex">
                    <Link href="#" className=''> <Image src="/icon/share.svg" className='mr-4' width={24} height={24} alt="Back" /></Link>
                    <Link href="#" className=''> <Image src="/icon/bookmark.svg" className='mr-1' width={24} height={24} alt="Back" /></Link>

                  </div>
                </div>
                <div className="">
                  <Link className="job-detail-company-title" href={`/company_detail/${jobData.company.id}`}>{companyData.name}</Link>
                  <span className='job-posted-date'>{formatPostedTime(jobData.publish_time)}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="job-hero-field-card">
                    <div className="singleline flex">
                      <div className="job-body mr-10">
                        <Image src="/icon/wallet.svg" width={16} height={16} alt="Company" />
                        <span>₹ {jobData.start_salary} - {jobData.end_salary}</span>
                      </div>
                      <div className="job-body">
                        <Image src="/icon/ph_user-bold.svg" width={16} height={16} alt="Openings" />
                        <span>{jobData.opening_count} Openings</span>
                      </div>
                    </div>
                    <div className="singleline flex">
                      <div className="job-body">
                        <Image src="/icon/clock.svg" width={16} height={16} alt="Time" />
                        {/* <span> {jobData.working_days}</span> */}
                        <span>{formatTimeRange(jobData.start_time, jobData.end_time)}</span>
                      </div>
                      <div className="job-body">
                        <Image src="/icon/map-pin.svg" width={16} height={16} alt="Location" />
                        <span> {companyData.location}</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="btn"> */}
                  <Link className='primary-btn-lg' href={`https://app.doparttime.com/job/${params.slug}`}>
                    Apply Now
                  </Link>
                  {/* </div>               */}
                </div>

              </div>
            </div>



            <div className="w-full flex justify-between job-detail-desc-card">
              <div className="flex-1 requirementscard-body">
                <div className="job-wrpper requirements-card">
                  <h2 className='rqr-card-title mb-2'>Job Requirements</h2>
                  <div className="flex  job-rqr-field-row">
                    <div className="label">Gender</div>
                    <div className="value">: {jobData.gender}</div>
                  </div>
                  <div className="flex job-rqr-field-row">
                    <div className="label">Eligibility</div>
                    <div className="value">: {jobData.eligibility}</div>
                  </div>
                  <div className="flex job-rqr-field-row">
                    <div className="label">Benefits</div>
                    <div className="value">: {jobData.benefits}</div>
                  </div>
                  <hr />
                  <div className="job-body">
                    {categoryDetails.map((category: any) => (
                      <div key={category.id}>
                        <span>{category.name}</span>
                      </div>

                    ))}
                  </div>
                  <h2 className='rqr-card-title mb-1'>Job Description</h2>
                  <div className="rqr-card-desc">
                    {jobData.description}
                  </div>
                </div>
                <div className="job-wrpper  requirements-card">
                  <h2 className='rqr-card-title mb-1'>About the Company</h2>
                  <div className="requirements-card_profile">
                    {companyData.image ? (
                      <Image className='mr-2' src={companyData.image} width={40} height={40} alt="Company" />
                    ) : (
                      <Image className='mr-2' src="https://flowbite.com/docs/images/logo.svg" width={40} height={40} alt="Default Company Logo" />
                    )}
                    <div className="requirements-card_profile-row">
                      <Link className="requirements-card_profile-title" href={`/company_detail/${jobData.company.id}`}>{companyData.name}</Link>
                      <div className='requirements-card_profile-loc'> {companyData.location}</div>
                    </div>
                  </div>
                  <div className="rqr-card-desc">
                    {companyData.description}
                  </div>
                  <div className="rqr-card-redirect-link">
                    <Link href={`/company_detail/${jobData.company.id}`} className='flex rqr-card-redirect-link-text justify-end'>View Company Profile <Image src="/icon/chevron-left.svg" className='' width={24} height={24} alt="Back" /></Link>
                  </div>
                </div>

                <div className="job-wrpper  requirements-card">
                  <h2 className='rqr-card-title mb-1'>Job Tags</h2>
                  <div className="tag-card-row">
                    {taglist.map((list: any) => (
                      <div className="" key={list}>

                        <Link className='tag-card' href={{
                          pathname: '../../../jobs/tag/' + list,

                        }}>
                          {list}
                        </Link>
                      </div>
                    ))}
                  </div>

                </div>
                <div className="tag-list">


                </div>

              </div>
              <div className="job-add-section" style={{ width: "300px" }}>
                <div className="company-card bg-white p-4 rounded-lg">
                  <h2 className='company-card_title mb-1'>{companyData.name}</h2>
                  <div className='company-card_loc mb-1'>{companyData.location}</div>
                  {/* <div className="company-card_desc mb-1">1000+ Employees (300+ Reviews) </div> */}
                  <div className="mb-3">
                    <span className='badge-icon' ><Image src="/icon/grow-ic.svg" className='inline mr-1' width={14} height={14} alt="Default Company Logo" />Total {companyData.count} Jobs</span>
                  </div>
                  <Link className="primary-btn-lg max-w-full text-center block" href={`../jobs/company/${companyData.id}`}>View active jobs</Link>
                </div>
                <div className="mt-4">
                  <Image src="/banner/job-apply-banner.svg" width={300} height={140} alt='Banner image' />
                </div>
                <div className="mt-4 app-install-card  bg-white rounded-lg">
                  <h2 className="card-title">Apply anytime, anywhere.</h2>
                  <div className="card-desc">Discover part-time job opportunities on our app</div>
                  <div className="flex justify-between mt-2">
                    <div className="w-full mr-2">
                      <Image src="/banner/app-mockup.png" className='w-full' width={117} height={118} alt='Banner image' />
                    </div>
                    <div className="flex flex-col justify-evenly items-center">
                      <div className="card-desc-light">20,000+ Part time jobs are there !</div>
                      <Link href="#">
                        <Image src="/icon/Andriod.png" width={120} height={36} alt='Andriod' />
                      </Link>
                      <Link href="#">
                        <Image src="/icon/IOS.png" width={120} height={36} alt='iOS' />
                      </Link>
                    </div>
                  </div>
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