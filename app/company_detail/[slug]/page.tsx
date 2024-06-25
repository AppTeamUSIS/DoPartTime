"use client"
import { db } from '../../firbaseconfig';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Tabs, Tab } from "@nextui-org/react";
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import getDatacompanyactivecount from '@/app/Job_details/[slug]/getcompanycount';
import { count } from 'console';
import getDatacompanyactivetime from '@/app/company_list/getlastactive';


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
        const company_count_last_month = await getDatacompanyactivecount({ company: docSnap.id, lastmonth: true });
        const company_count = await getDatacompanyactivecount({ company: docSnap.id });
        const company_active = await getDatacompanyactivetime({ company: docSnap.id });
        return { id: docSnap.id, ...docSnap.data(), count_last: company_count_last_month, count: company_count, company_active: company_active };
      } else {
        throw new Error('User not found');
      }
    } catch (error: any) {
      throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
  };

  try {
    const apiData: any = await getData();
    console.log("Company ID:", apiData.id);
    const companyRef = doc(db, 'company', apiData.id);

    const jobsQuery = query(
      collection(db, "jobs"),
      where("company", "==", companyRef)
    );
    const jobSnapshot = await getDocs(jobsQuery);
    console.log("Number of job listings:", jobSnapshot.size);
    const jobList: any = [];

    // jobSnapshot.forEach(doc => {
    //     jobList.push({ id: doc.id, ...doc.data() });
    //   });

    const jobdetails: any = jobSnapshot.docs.forEach(doc =>
      // doc.data()
      jobList.push({ id: doc.id, ...doc.data() })
    )

    const taglist = ["Stock Manager", "Store Keeper", "Evening",]

    const trendingJob = [
      { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Viewed 2 days ago' },
      { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Viewed 2 days ago' },
      { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Viewed 2 days ago' },
      { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Viewed 2 days ago' },
      { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Viewed 2 days ago' },
      { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Viewed 2 days ago' },
    ]

    const cmpReviews = [
      { trendingJobtitle: 'Stock checking-Part time job', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
      { trendingJobtitle: 'Stock checking-Part time job', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
      { trendingJobtitle: 'Stock checking-Part time job', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
      { trendingJobtitle: 'Stock checking-Part time job', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
    ]
    return (
      <>
        {/* <h2 className="text-center p-10">Company</h2> */}
        <div className="back-btn-row flex justify-between items-center">
          <Link href="#" className='flex back-btn m-0' style={{ margin: "0 !important" }}> <Image src="/icon/ep_back.svg" className='mr-1' width={24} height={24} alt="Back" />Back</Link>
          <Link href="#" className=''> <Image src="/icon/share.svg" className='' width={24} height={24} alt="Back" /></Link>
        </div>
        <div className="mt-4" key={apiData.id}>
          <div className="company-wrapper">
            <div className="company-detail_header">
              <div className="company-rating-row text-end mt-2">
                {/* <div className="company-rating_value flex justify-end text-white">4.5<Image className='ms-2' src="/icon/rating-fill.svg" width={20} height={20} alt="rating" /></div>
                <div className="company-rating_total">273 Reviews</div> */}
              </div>
              <div className="company-title-row mt-8 flex items-center">
                {apiData.image ? (
                  <Image src={apiData.image} width={82} height={82} alt="Company" />
                ) : (
                  <Image src="https://flowbite.com/docs/images/logo.svg" width={82} height={82} alt="Default Company Logo" />
                )}
                <div className="ms-2 w-full flex-1 text-white">
                  <h2 className='company-title'>{apiData.name}</h2>
                  <div className="company-loc mb-2">{apiData.location} <span className='company-since'>{apiData.company_active}</span></div>
                  <div className="">
                    <span className='badge-icon' ><Image src="/icon/grow-ic.svg" className='inline mr-1' width={14} height={14} alt="Default Company Logo" />Total {apiData.count} Jobs ( Posted {apiData.last_count} jobs in the last month )</span>
                  </div>
                </div>
                <div className="w-[210]">
                  <Link className='light-btn-lg' href={`/jobs/company/${apiData.id}`}>View active jobs</Link>
                </div>
              </div>
            </div>
            <div className="company-detail_card">
              <h2 className="company-detail_card-title">About the Company</h2>
              <p className="company-detail_card-desc">{apiData.description}</p>
            </div>
            <div className="company-detail_card">
              <h2 className="company-detail_card-title">Contact details</h2>
              {/* <div className="flex  cmp-field-row mb-2">
                <div className="label">Email</div>
                <div className="value text-active"> {apiData.contact_email}</div>
              </div>
              <div className="flex  cmp-field-row mb-2">
                <div className="label">Phone</div>
                <div className="value text-active"> {apiData.contact_mobile}</div>
              </div> */}
              <div className="flex  cmp-field-row mb-2">
                <div className="label">Address</div>
                <div className="value"> {apiData.location}</div>
              </div>
              <div className="flex  cmp-field-row mb-2">
                <div className="label">Website</div>
                <div className="value text-active"> {apiData.website}</div>
              </div>
            </div>
            <div className="trending-jobs-wrapper">
              <h2 className="trending-jobs-title">Recently Posted Jobs</h2>
              <div className="trending-jobs-row">
                <Swiper
                  slidesPerView={3}
                  spaceBetween={8}
                  // centeredSlides={true}
                  navigation


                  // pagination={{ type: 'fraction' }}
                  modules={[Navigation, Pagination]}
                  onSwiper={swiper => console.log(swiper)}
                  className=''
                  breakpoints={{
                    // when window width is >= 320px
                    320: {
                      slidesPerView: 2,
                      spaceBetween: 8,
                    },
                    // when window width is >= 480px
                    480: {
                      slidesPerView: 3,
                      spaceBetween: 8
                      ,
                    },
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 8,
                    },
                  }}
                >
                  {jobList.map((job: any, index: any) => (

                    <SwiperSlide key={index} >
                      <Link href={`/Job_details/${job.id}`}>
                        <div className="trending-jobs-column flex">
                          <div className="avathar mr-2">
                            <Image src={apiData.image} width={32} height={32} alt="Default Company Logo" />
                          </div>
                          <div className="card-body">
                            <h2 className="card-title truncate text-ellipsis">{job.title}</h2>
                            <div className="card-sub-title">{job.location}</div>
                            <div className="posted-dates">{formatPostedTime(job.publish_time)}</div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>

                  ))}

                </Swiper>
              </div>
            </div>
            {/* <div className="trending-jobs-wrapper">
              <h2 className="trending-jobs-title">Company Reviews</h2>
              <div className="trending-jobs-row">
                <Swiper
                  slidesPerView={2}
                  spaceBetween={8}
                  // centeredSlides={true}
                  navigation


                  // pagination={{ type: 'fraction' }}
                  modules={[Navigation, Pagination]}
                  onSwiper={swiper => console.log(swiper)}
                  className=''
                  breakpoints={{
                    // when window width is >= 320px
                    320: {
                      slidesPerView: 2,
                      spaceBetween: 8,
                    },
                    // when window width is >= 480px
                    480: {
                      slidesPerView: 3,
                      spaceBetween: 8
                      ,
                    },
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 8,
                    },
                  }}
                >
                  {cmpReviews.map((value, index) => (
                    <SwiperSlide key={index} >
                      <div className="trending-jobs-column">
                        <div className="flex justify-between items-center">
                          <div className="flex">
                            <Image className='mr-2' src="https://flowbite.com/docs/images/logo.svg" width={44} height={44} alt="Default Company Logo" />
                            <h2>Lorem ipsum</h2>
                          </div>
                          <div className="5-rating-ic.svg">
                            <Image src="/icon/5-rating-ic.svg" width={120} height={18} alt="rating" />
                          </div>
                        </div>
                        <div className="card-body mt-2">
                          <div className="card-sub-title">{value.cmpReviewsDes}</div>
                          <div className="posted-dates">{value.cmpReviewsDate}</div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}

                </Swiper>
              </div>
            </div> */}
            {/* <div className="mx-4">
              <div className="job-wrpper requirements-card">
                <h2 className='tag-card-title mb-1'>Job Tags</h2>   
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
            </div> */}
          </div>
        </div>
        <div>

        </div>
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

export default company;
