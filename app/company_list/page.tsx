import Link from "next/link";
import Image from "next/image";
import getData from "./getdata";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firbaseconfig";

export default async function companyList(params: any) {
  let page = 1;
  let lastid: any;
  let sortby = "";
  let location = "";
  let area = "";
  const getDatalastid: any = async (value: any) => {
    try {
      const documentRef = doc(db, "company", value); // Replace "jobs" with the name of your collection
      const documentSnapshot = await getDoc(documentRef);
      return documentSnapshot;
    } catch (e) {

    }


  };

  if (params.searchParams.start) {
    lastid = await getDatalastid(params.searchParams.start);
  }
  if (params.searchParams.page) {
    page = params.searchParams.page;
  }
  if (params.searchParams.sortby) {
    sortby = params.searchParams.sortby;
  }
  if (params.searchParams.location) {
    location = params.searchParams.location;
  }
  if (params.searchParams.area) {
    area = params.searchParams.area;
  }
  let apiData: any = await getData({
    page: page,
    count: false,
    lastVisible: false,
    lastid: (lastid) ? lastid : "",
    sortby: sortby,
    location: location,
    area: area
  });

  return (
    <>
      {apiData.map((data: any, index: any) => (
        <div key={index} className="com-list-card-row">
          <Link href={`/company_detail/${data.id}`}>
            <div className="company-title-row flex items-start">

              <Image src={data.image} width={66} height={66} alt="Default Company Logo" className="company-list-img" />

              <div className="ms-2 w-full flex-1 text-white">
                <h2 className='company-title'>{data.name}</h2>
                <div className="company-loc mb-2">{data.location}</div>
                <div className="">
                  <span className='badge-icon' ><Image src="/icon/grow-ic.svg" className='inline mr-1' width={14} height={14} alt="Default Company Logo" />Total {data.count} Jobs ( Posted {data.count_last} jobs in the last month )</span>
                </div>
              </div>
              <div className="w-[120]">
                <span className='cmp-since-lbl'>{data.active}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}