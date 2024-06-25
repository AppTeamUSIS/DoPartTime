import Link from "next/link";
import Image from "next/image";
import getData from "./getData";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firbaseconfig";
import getDatacandiate from "./getData";
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
    return "Last active today";
  } else if (daysDifference === 1) {
    return "Last active 1 days ago";
  } else {
    return `Last active ${daysDifference} days ago`;
  }
}
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
export default async function candidateList(params: any) {
  let page = 1;
  const job_type = [];
  const days_week = [];
  let gender = "";
  let lastid: any;
  let location = "";
  let area = "";
  let sortby = "";

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
  if (params.searchParams.gender) {
    gender = params.searchParams.gender;
  }
  if (params.searchParams.location) {
    location = params.searchParams.location;
  }
  if (params.searchParams.sortby) {
    sortby = params.searchParams.sortby;
  }
  if (params.searchParams.area) {
    area = params.searchParams.area;
  }
  if (params.searchParams.jobs_days) {
    let values2 = params.searchParams.jobs_days.split(',');
    for (let index = 0; index < values2.length; index++) {
      var letvalue = await gettagids(values2[index]);
      days_week.push(letvalue);
    }

  }
  const getDatalastid: any = async (value: any) => {
    try {
      const documentRef = doc(db, "users", value); // Replace "jobs" with the name of your collection
      const documentSnapshot = await getDoc(documentRef);
      return documentSnapshot;
    } catch (e) {

    }


  };

  if (params.searchParams.start) {
    lastid = await getDatalastid(params.searchParams.start);
  }
  let apiData: any = await getDatacandiate({
    page: page,
    count: false,
    lastVisible: false,
    lastid: (lastid) ? lastid : "",
    job_type: job_type,
    job_day: days_week,
    gender: gender,
    location: location,
    area: area,
    sortby: sortby,
  });
  return (
    <>
      {apiData.map((data: any, index: any) => (
        <div key={index} className="com-list-card-row candidate-list-card-row">
          <Link href={`/candidate_detail/${data.id}`}>
            <div className="company-title-row flex items-start">
              <Image src={data.photo_url} width={66} height={66} alt="Default Company Logo" className="candidate-img" />
              <div className="ms-2 w-full flex-1 text-white">
                <h2 className='company-title flex'>{data.display_name}
                  <Image className="ms-2" src="/icon/shield-check.svg" width={24} height={24} alt="shield check" />
                </h2>
                <div className="company-loc mb-2">{data.location}</div>
              </div>
              <div className="w-[120]">
                <span className='cmp-since-lbl'>{formatPostedTime(data.last_login)}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}