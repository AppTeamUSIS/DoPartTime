'use client'

import { db } from './firbaseconfig';
import { QueryConstraint, collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Tabs, Tab } from "@nextui-org/react";
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import getDatatrending from './get_data_trending';
import getDatatrendingcate from './getcatelist';
import getDatatrendingcompany from './get_company_tredings';
import getTopCategories from './getTopCategories';

const getDatatrendingdata = async () => {
  try {
    const data = await getDatatrending();

    return data;
  } catch (error: any) {
    throw new Error("Failed to fetch data from Firestore: " + error.message);
  }
}
const company = async (slug: any) => {
  try {
    const docRef = doc(db, 'company', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('User not found');
    }
  } catch (error: any) {
    throw new Error("Failed to fetch data from Firestore: " + error.message);
  }
};
const getData = async (limitvalue: any) => {
  try {
    const queryConstraints: QueryConstraint[] = [];
    queryConstraints.push(where('status', '!=', 0));
    if (limitvalue) {
      queryConstraints.push(limit(4));
    }
    const postsRef = query(collection(db, "jobs"), ...queryConstraints);
    const querySnapshot = await getDocs(postsRef);
    const data: any = [];
    querySnapshot.forEach(async (doc) => {
      let company_details = await company(doc.data().company.id);
      data.push({ id: doc.id, ...doc.data(), company: company_details });
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
const Categories = [
  { categoriestitle: 'Delivery Jobs', categoriesvalue: '1000+ Job openings' },
  { categoriestitle: 'Construction worker', categoriesvalue: '1500+ Job openings' },
  { categoriestitle: 'Content writer', categoriesvalue: '2000+ Job openings' },
  { categoriestitle: 'Tailoring or Handicrafts', categoriesvalue: '1000 Job openings' },
  { categoriestitle: 'Tailoring or Handicrafts', categoriesvalue: '1000 Job openings' },
  { categoriestitle: 'Tailoring or Handicrafts', categoriesvalue: '1000 Job openings' },
]
const trendingJob = [
  { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Posted 2 days ago' },
  { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Posted 2 days ago' },
  { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Posted 2 days ago' },
  { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Posted 2 days ago' },
  { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Posted 2 days ago' },
  { trendingJobtitle: 'Stock checking-Part time job', trendingJobcompanyName: 'Redditch Accessories', trendingJobpostedDate: 'Posted 2 days ago' },
]

const cmpReviews = [
  { comTitle: 'Flipkart', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
  { comTitle: 'Swiggy', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
  { comTitle: 'Zomato', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
  { comTitle: 'Amazon', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
  { comTitle: 'matrixx India', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
  { comTitle: 'Fast Track', cmpReviewsDes: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est et accumsan fusce vestibulum ut amet massa. Ut eget sem pharetra at lectus sit etiam nunc.', cmpReviewsDate: '18 April' },
]
const testiMonials = [
  { userName: 'Karthik', desc: 'The need is not always full time, there are phases during which we need additional resources to pump in those extra products into the catalogue within a week. where DoPartTimes service was a blessing.', cmpName: 'Kobzo.com' },
  { userName: 'Karthik', desc: 'If need is not always full time, there are phases during which we need additional resources to pump in those extra products into the catalogue within a week. where DoPartTimes service was a blessing.', cmpName: 'Kobzo.com' },
  // { userName: 'Karthik', desc: 'We need is not always full time, there are phases during which we need additional resources to pump in those extra products into the catalogue within a week. where DoPartTimes service was a blessing.', cmpName: 'Kobzo.com' },
]
const testiMonialsArticle = [
  { artcleTitle: 'The Rise of Part-Time Jobs: ', articleDesc: 'In todays fast-evolving job market part-time employment has become a prominent and appealing option for many individuals.', articleDate: 'January 11, 2023' },
  { artcleTitle: 'The Rise of Part-Time Jobs: ', articleDesc: 'In todays fast-evolving job market part-time employment has become a prominent and appealing option for many individuals.', articleDate: 'January 11, 2023' },
  { artcleTitle: 'The Rise of Part-Time Jobs: ', articleDesc: 'In todays fast-evolving job market part-time employment has become a prominent and appealing option for many individuals.', articleDate: 'January 11, 2023' },
]
const dashboard: any = async () => {

  try {
    const apiData = await getData(true);
    const apiDatacount = await getData(false);
    const newdata = await getDatatrendingdata();
    const datacate = await getDatatrendingcate();
    const datacompany = await getDatatrendingcompany();
    const topcatvalues = await getTopCategories();
    return (
      <>
        <div className="jobsearch-wrapper">
          <div className="jobsearch-bg-widget">
            <div className="job-heading-card">
              <h2 className="job-count-heading">Over {apiDatacount.length}+ part-time jobs available in</h2>
              <div className="text-center"><span className="job-location-heading">Egmore, Chennai</span> <Link style={{ color: "#fff", fontWeight: 500, fontSize: "14px", textDecorationLine: "underline" }} href="#">Change</Link></div>
            </div>
            {/* <div className="flex flex-col flex-1 justify-center md:flex-row ms:flex-col mt-6">
            
            <div className="w-full md:w-[370px]">
              
              <form className="max-w-md mx-auto" action="/search/">   
                  <div className="relative">                      
                      <input type="search" id="default-search" className="global-search-bar block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" style={{ fontSize:"12px" }} placeholder="Search by locality, job type, company" required />
                      <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                      <div className="absolute inset-y-0 end-0 flex items-center pe-2  pointer-events-none">
                       <Image src="/icon/ion_search.svg" width={24} height={24} alt="Search" />
                      </div>
                  </div>
              </form>

              <form action="/search/">
                <input
                  type="text"
                  name='search'
                  placeholder="Search"
                />
                <button type='submit'>Search</button>

               </form>
            </div>
          </div> */}
          </div>
          <div className="trending-jobs-wrapper">
            <h2 className="trending-jobs-title">Trending jobs near you</h2>
            <div className="trending-jobs-row">
              <Swiper
                slidesPerView={4.5}
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
                    slidesPerView: 1.2,
                    spaceBetween: 8,
                  },
                  // when window width is >= 480px
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 8
                    ,
                  },
                  // when window width is >= 640px
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 8,
                  },
                  900: {
                    slidesPerView: 3.5,
                    spaceBetween: 8,
                  },
                }}
              >

                {newdata.map((item: any, index: any) => (

                  <SwiperSlide key={index} >
                    <Link href={`Job_details/${item.id}`}>
                      <div className="trending-jobs-column flex">
                        <div className="avathar mr-2">
                          {item.companyname.image ? (
                            <Image className='trd-job-img' src={item.companyname.image} width={32} height={32} alt="Company" />
                          ) : (
                            <Image className='trd-job-img' src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                          )}

                        </div>
                        <div className="card-body">
                          <h2 className="card-title truncate text-ellipsis">{item.title}</h2>
                          <div className="card-sub-title">{item.companyname.name}</div>
                          <div className="posted-dates">{formatPostedTime(item.publish_time)}</div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>

                ))}

              </Swiper>
            </div>
          </div>
        </div>

        <div className="job-categories my-4">
          <div className="flex justify-between">
            <h2 className="categories-title">Categories</h2>
            {/* <Link className="job-list-wrpper-sub-title" href="#">View all categories</Link> */}
          </div>
          <div className="flex justify-between categories-card-row">
            <Swiper
              slidesPerView={4.5}
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
                  slidesPerView: 2.2,
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
                  slidesPerView: 4.5,
                  spaceBetween: 8,
                },
              }}

            >
              {datacate.map((item: any, index: any) => (
                <SwiperSlide key={index}>
                  <Link href={`jobs/tag/${item.id}`}>
                    <div className="categories-card">
                      <div className="categories-card__title">{item.name}</div>
                      <div className="categories-card__value">{item.jobCount} Job openings</div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="top-cmp-wrapper trending-jobs-wrapper">
          <h2 className="trending-jobs-title">Top companies</h2>
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
                  slidesPerView: 3.3,
                  spaceBetween: 8,
                },
                // when window width is >= 480px
                480: {
                  slidesPerView: 4,
                  spaceBetween: 8
                  ,
                },
                // when window width is >= 640px
                900: {
                  slidesPerView: 2,
                  spaceBetween: 8,
                },
              }}
            >
              {datacompany.map((item: any, index: any) => (

                <SwiperSlide key={index} >
                  <Link href={`jobs/company/${item.id}`}>
                    <div className="trending-jobs-column top-com-column">
                      <div className="flex justify-center items-center">
                        <div className="flex items-center flex-col ">
                          <Image className='company-img' src="https://flowbite.com/docs/images/logo.svg" width={60} height={60} alt="Default Company Logo" />
                          <h2 className='top-com-title'> {item.name}</h2>
                        </div>
                      </div>
                      <div className="rating-row flex justify-center items-center">
                        <span className='rating-count'>({item.jobCount})</span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>

              ))}

            </Swiper>
          </div>
        </div>

        <div className="job-list-wrpper home-job-list-wrpper">
          <div className="flex justify-between items-center mb-4">
            <h1 className='job-list-wrpper-title'>Explore jobs</h1>
            <span className='job-list-wrpper-sub-title'>Total {apiDatacount.length} Jobs </span>
          </div>
          <div className="job-list-filter-row  flex justify-between mb-4">
            <div className="filter-group-btn">
              <div className="flex flex-wrap gap-4">
                <Tabs variant="light" color='primary' aria-label="Tabs variants">
                  <Tab key="All jobs" title="All jobs" />
                  {topcatvalues.map((item: any, index: any) => (

                    <Tab href={`jobs/tag/${item.id}`} key={item.data.name} title={item.data.name} />

                  ))}
                </Tabs>
              </div>
            </div>
          </div>
          {apiData.map((item: any, index: any) => (
            <div key={index}>
              <div className="" key={item.id}>
                <div className="job-list-card" key={item.id}>
                  <Link href={`Job_details/${item.id}`}>
                    <div className="job-header">
                      {item.company.image ? (
                        <Image src={item.company.image} width={32} height={32} alt="Company" />
                      ) : (
                        <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                      )}
                      <div>
                        <p>{item.title}</p>
                        <span>{item.company.name}</span>
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

        <div className="explore-card flex justify-center items-center">
          <h2 className="explore-card__tile">Explore all available options at a glance by clicking here.
          </h2>
          <Link href="/jobs" className='flex explore-card__view-all'> View all jobs <Image className='ms-2' src="/icon/right-arrow-ic.svg" width={6} height={12} alt="View all jobs" /> </Link>
        </div>

        <div className="testimonials-card">
          <div className="testimonials-row">
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
                  slidesPerView: 1,
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
              {testiMonials.map((value, index) => (
                <SwiperSlide key={index} >
                  <div className="testimonials-column">
                    <p className='testimonials-desc'>{value.desc}</p>
                    <div className="testimonials-avathar__row flex">
                      <Image src="https://flowbite.com/docs/images/logo.svg" className='mr-2' width={44} height={44} alt="Default" />
                      <div className="">
                        <h2 className='testimonials-user-title'>{value.userName}</h2>
                        <div className="testimonials-sub-title">Co-Founder at <span className='testimonials-user-com-name'> {value.cmpName}</span></div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="testimonials-article-row testimonials-row">
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
                  slidesPerView: 1,
                  spaceBetween: 8,
                },
                // when window width is >= 480px
                480: {
                  slidesPerView: 2,
                  spaceBetween: 8
                  ,
                },
                // when window width is >= 640px
                640: {
                  slidesPerView: 2,
                  spaceBetween: 8,
                },
                900: {
                  slidesPerView: 3,
                  spaceBetween: 8,
                },
              }}
            >
              {testiMonialsArticle.map((value, index) => (
                <SwiperSlide key={index} >
                  <div className="testimonials-article-column">
                    <h2 className='testimonials-article-title'>{value.artcleTitle} </h2>
                    <p className='testimonials-article-desc'>{value.articleDesc}</p>
                    <div className="testimonials-article-date">{value.articleDate}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="app-promotion-row">
            <div className="app-promotion-column flex flex-col items-center app-promotion-column_1">
              <p className="app-promotion-desc"><span className='font-semibold'>Want to talk to someone?</span> <br />
                Our customer support is here to help you. <br />
                Monday to Friday 10:00am to 6:00pm</p>
              <Link href="#" className='flex items-center app-promotion-contact' style={{ backgroundColor: "#DEE0FF", padding: "6px 20px", borderRadius: "08px", fontSize: "16px", fontWeight: 600, width: "214px", marginTop: "10px" }}> <Image src="/icon/whatsapp-ic.svg" width={27} height={27} alt="Whatsapp" /> +91 987655 43321</Link>
            </div>
            <div className="app-promotion-column app-promotion-column_2">
              <h2 className='app-promotion-tile'>Apply anytime, anywhere.</h2>
              <p className='app-promotion-desc mt-2'>Discover part-time job opportunities on our app</p>
              <div className="flex justify-center mt-4">
                <Image src="/icon/Andriod.png" width={127} height={37} alt="Googlr Play" />
                <Image src="/icon/IOS.png" width={127} height={37} alt="App Store" />
              </div>
            </div>
          </div>
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



function useUrl(): { href: any; pathname: any; } {
  throw new Error('Function not implemented.');
}
// Server side api fetching end 