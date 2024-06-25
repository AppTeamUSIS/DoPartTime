import { db } from "../../firbaseconfig";
import { collection, doc, endAt, getDoc, getDocs, limit, orderBy, query, startAfter, startAt, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import getData from "./getData";
import Head from "next/head";
import { Metadata } from 'next';
import { useSearchParams } from "next/navigation";

export async function generateMetadata(params: any): Promise<Metadata> {

  let location = 'India';
  let area = '';
  let urlis = "jobs/";
  if (params.params.slug && params.params.slug[0] && params.params.slug[0] != "tag" && params.params.slug[0] != "company") {
    location = params.params.slug[0];
    urlis = urlis + "/" + location;
  }
  if (params.params.slug && params.params.slug[1] && params.params.slug[0] != "tag" && params.params.slug[0] != "company") {
    area = params.params.slug[1] + ',';
    urlis = urlis + "/" + area;
  }
  if (params.params.slug && params.params.slug[0] && params.params.slug[0] == "tag" && params.params.slug[0] != "company") {
    if (params.params.slug && params.params.slug[2]) {
      location = params.params.slug[2];
      urlis = urlis + "/" + location;
    }
    if (params.params.slug && params.params.slug[3]) {
      area = params.params.slug[3] + ',';
      urlis = urlis + "/" + area;
    }
  }
  if (params.searchParams.location) {
    location = params.searchParams.location;
    urlis = urlis + "/" + location;
  }
  if (params.searchParams.area) {
    area = params.searchParams.area + ',';
    urlis = urlis + "/" + area;
  }
  return {
    title: `part time jobs in ${area} ${location}`,
    description: `Part time jobs in ${area} ${location} . Search and apply for part time, weekend, evening, temporary jobs for consultants, freshers, college students, women housewives, professionals, retired.`,
    keywords: `part time jobs in ${area} ${location}`,
    alternates: {
      canonical: `https://do-part-time.vercel.app/${urlis}`,
    },
  };
}


function formatTimeRange(start_time: any, end_time: any) {
  if (!start_time || !start_time.seconds || !end_time || !end_time.seconds) {
    return "Time not mentioned";
  }
  const options: any = { hour: "numeric", minute: "numeric", hour12: true };
  const startDate = new Date(start_time.seconds * 1000);
  const endDate = new Date(end_time.seconds * 1000);

  const formattedStartTime = startDate.toLocaleTimeString("en-US", options);
  const formattedEndTime = endDate.toLocaleTimeString("en-US", options);

  return `${formattedStartTime} - ${formattedEndTime}`;
}
function formatPostedTime(publish_time: any) {
  const timestamp = publish_time;
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
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
type Props = {
  params1: {
    slug: string[];
  };
};
const getDatalastid: any = async (value: any) => {
  try {
    const documentRef = doc(db, "jobs", value); // Replace "jobs" with the name of your collection
    const documentSnapshot = await getDoc(documentRef);
    return documentSnapshot;
  } catch (e) {

  }


};
const gettagids: any = async (value: any) => {

  try {
    // const documentRef = doc(db, "master_tag", value);
    // const documentSnapshot = await getDoc(documentRef);
    const masterTagRef = doc(db, 'master_tag', value);
    const masterTagDoc = await getDoc(masterTagRef);

    // const documentRef = doc(db, "master_tag", value);
    // const tagRef =collection('master_tag').doc('employer-location');
    return masterTagDoc.ref.id;
  } catch (e) {

  }


};
const dashboard: any = async (params: any) => {
  try {
    // console.log("params", params.searchParams);
    // console.log("segment", params.params.slug[0]);
    let tiltle = '';
    let location = '';
    let area = '';
    let tagvalue = '';
    let company = '';

    let start = 0;
    let end = 0;
    let page = 1;

    const job_type = [];
    const days_week = [];
    const time_period = [];
    // console.log((params.params.slug[0] != "tag"));
    if (params.params.slug && params.params.slug[0] && params.params.slug[0] != "tag" && params.params.slug[0] != "company") {
      location = params.params.slug[0];
    }
    if (params.params.slug && params.params.slug[1] && params.params.slug[0] != "tag" && params.params.slug[0] != "company") {
      area = params.params.slug[1];
    }
    if (params.params.slug && params.params.slug[0] && params.params.slug[0] == "tag" && params.params.slug[0] != "company") {
      if (params.params.slug && params.params.slug[2]) {
        location = params.params.slug[2];
      }
      if (params.params.slug && params.params.slug[3]) {
        area = params.params.slug[3];
      }
      tagvalue = params.params.slug[1];
      job_type.push(tagvalue);
    }
    if (params.params.slug && params.params.slug[0] == "company") {
      company = params.params.slug[1];
    }
    if (params.searchParams.location) {
      location = params.searchParams.location;
    }
    if (params.searchParams.area) {
      area = params.searchParams.area;
    }
    if (params.searchParams.company) {
      company = params.searchParams.company;
    }
    if (params.params.slug && params.params.slug[0] && params.params.slug[0] == "tag") {
      tagvalue = params.params.slug[1];
      job_type.push(tagvalue);
    }
    if (params.searchParams.tag) {

      job_type.push(params.searchParams.tag);
    }
    if (params.searchParams.jobs_type) {
      let values1 = params.searchParams.jobs_type.split(',');
      for (let index = 0; index < values1.length; index++) {
        var letvalue = await gettagids(values1[index]);
        job_type.push(letvalue);
      }

    }
    if (params.searchParams.page) {
      page = params.searchParams.page;
    }
    if (params.searchParams.jobs_days) {
      let values2 = params.searchParams.jobs_days.split(',');
      for (let index = 0; index < values2.length; index++) {
        var letvalue = await gettagids(values2[index]);
        job_type.push(letvalue);
      }

    }
    if (params.searchParams.jobs_time_period) {
      let values3 = params.searchParams.jobs_time_period.split(',');
      for (let index = 0; index < values3.length; index++) {
        var letvalue = await gettagids(values3[index]);
        job_type.push(letvalue);
      }

    }

    // if (params.searchParams.end) {
    //   end = params.searchParams.end;
    // }

    let lastid: any;
    if (params.searchParams.start) {
      console.log('000000000000000000000d');
      lastid = await getDatalastid(params.searchParams.start);
    }


    let apiData: any = await getData({
      page: page,
      count: false,
      lastVisible: false,
      lastid: (lastid) ? lastid : "",
      location: location,
      area: area,
      jobfilter: job_type,
      company: company
    });
    let apiDatacount: any = await getData({
      page: page,
      count: true,
      lastVisible: false,
      lastid: "",
      location: location,
      area: area,
      jobfilter: job_type,
      company: company
    });
    return (
      <>

        <div className="h-full">
          <div className="Fillter">
            <div className="header wrapper">
            </div>
            <span>{apiDatacount.length} job matches found </span>
            <div className="Fillter-wrapper">

              <div className="Fillter-right">

                <div className="body">
                  {apiData.map((message: any, index: any) => (

                    <div className="job-wrpper" key={index.id}>

                      <Link href={`/Pages/Jobs/Job-details/${message.id}`}>
                        <div className="job-header">
                          {message.image ? (
                            <Image
                              src={message.image}
                              width={32}
                              height={32}
                              alt="Company"
                            />
                          ) : (
                            <Image
                              src="https://flowbite.com/docs/images/logo.svg"
                              width={32}
                              height={32}
                              alt="Default Company Logo"
                            />
                          )}
                          <div>
                            <p>{message.title}</p>
                            <span>{message.title}</span>
                            {message.status == 2 && (
                              <div className="closed">
                                Closed
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="job-body">
                          <Image
                            src="/icon/map-pin.svg"
                            width={16}
                            height={16}
                            alt="Logo"
                          />
                          <span> {message.location}</span>
                        </div>
                        <div className="job-body">
                          <Image
                            src="/icon/clock.svg"
                            width={16}
                            height={16}
                            alt="Logo"
                          />
                          <span>
                            {formatTimeRange(
                              message.start_time,
                              message.end_time
                            )}{" "}
                            {message.working_days}
                          </span>
                        </div>
                        <div className="job-body">
                          <Image
                            src="/icon/wallet.svg"
                            width={16}
                            height={16}
                            alt="Logo"
                          />
                          <span>
                            ₹ {message.start_salary} - {message.end_salary} per
                            month
                          </span>
                        </div>
                        <div className="postby">
                          <span>{formatPostedTime(message.publish_time)}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                  <div className="paggination-head">
                    {/* <Link className="pagination"
                      style={{
                        pointerEvents: (start == 0) ? "none" : "auto",
                      }}
                      href={{
                        pathname: '/jobs',
                        query: {
                          ...params.searchParams,
                          start: start - 3,
                          end: end - 3,

                        }
                      }}
                    >
                      Previous
                    </Link> */}

                  </div>
                  {/* <Link className="pagination"
                    href={{
                      pathname: '/jobs',
                      query: {
                        ...params.searchParams,
                        start: start + 2,
                        end: start + 4,

                      }
                    }}
                  >
                    Next
                  </Link> */}
                </div>

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
};

export default dashboard;

