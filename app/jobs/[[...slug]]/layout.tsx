"use client";
import { db } from "../../firbaseconfig";
import { getDocs, collection, query, orderBy, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function DashboardLayout({
  children,
  parames,
}: {
  children: any;
  parames: any;
}) {
  const router: any = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [Selectedjob, setSelectedjob] = useState<string>("");
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>("");


  // console.log("url",parames)


  // Define the array of salary ranges
  const salaryRanges = [
    { label: "All", value: "" },
    { label: "0-10000", value: "0-10000" },
    { label: "10001-20000", value: "10001-20000" },
    { label: "20001-30000", value: "20001-30000" },
    { label: "30001-40000", value: "30001-40000" },
  ];

  // Function to handle salary range change
  const handleSalaryRangeChange = (range: string) => {
    setSelectedSalaryRange(range);
    let data = { range: range }
    handleSearch(data);
    // handleSearch();
  };

  // Function to render salary range checkboxes
  const renderSalaryRangeCheckboxes = () => {
    return salaryRanges.map((range, index) => (
      <li key={index} className="w-full">
        <div className="flex items-center ps-3">
          <input
            id={`salaryRange-${index}`}
            type="checkbox"
            value={range.value}
            checked={selectedSalaryRange === range.value}
            onChange={() => handleSalaryRangeChange(range.value)}
            className="w-4 h-4"
          />
          <label htmlFor={`salaryRange-${index}`} className="w-full py-3 ms-2">
            {range.label}
          </label>
        </div>
      </li>
    ));
  };


  const handlejobtypeChange = (jobtype: string) => {
    // setSelectedjob(Selectedjob === jobtype ? "" : jobtype);   
    setSelectedjob(jobtype);
    let data = { jobtype: jobtype }
    handleSearch(data);

    console.log("haritype", Selectedjob)
  };

  const handleSearch = async (data?: any) => {

    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.set("title", searchQuery);
    }
    if (selectedLocation) {
      queryParams.set("location", selectedLocation);
    }
    if (data?.jobtype) {
      queryParams.set("job_type", data.jobtype);
    }
    if (data?.range) {
      queryParams.set("salary", data.range);
    }
    const queryString = queryParams.toString();
    router.push(`/jobs?${queryString}`);
  };

  return (
    <section>
      <div className="h-full">
        <div className="Fillter">
          <div className="header wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
            />
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="location"
            />

            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="Fillter-wrapper">
            <div className="Fillter-left">
              <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Job
                </h3>
                <ul>
                  <li className="w-full ">
                    <div className="flex items-center ps-3">
                      <input
                        id="type"
                        checked={Selectedjob === ""}
                        onChange={() => handlejobtypeChange("")}
                        type="checkbox"
                        value=""
                        className="w-4 h-4 "
                      />
                      <label htmlFor="Part-Time" className="w-full py-3 ms-2">
                        All
                      </label>
                    </div>
                  </li>
                  <li className="w-full ">
                    <div className="flex items-center ps-3">
                      <input
                        id="type"
                        name="job_type[]"
                        checked={Selectedjob === "parttime"}
                        onChange={() => handlejobtypeChange("parttime")}
                        type="checkbox"
                        value="parttime"
                        className="w-4 h-4 "
                      />
                      <label htmlFor="Part-Time" className="w-full py-3 ms-2">
                        Part Time
                      </label>
                    </div>
                  </li>
                  <li className="w-full">
                    <div className="flex items-center ps-3">
                      <input
                        id="type1"
                        name="job_type[]"
                        checked={Selectedjob === "fulltime"}
                        onChange={() => handlejobtypeChange("fulltime")}
                        type="checkbox"
                        value="fulltime"
                        className="w-4 h-4 "
                      />
                      <label htmlFor="Full-Time" className="w-full py-3 ms-2 ">
                        Full Time
                      </label>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="heading border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Salary Range
                </h3>
                <ul>{renderSalaryRangeCheckboxes()}</ul>
              </div>
            </div>
            <div className="Fillter-right">
              <div className="body">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

