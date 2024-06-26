"use client";
import { db } from "../../firbaseconfig";
import { getDocs, collection, query, orderBy, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Autocomplete, AutocompleteItem, BreadcrumbItem, Breadcrumbs, Button, Tab, Tabs } from "@nextui-org/react";
import axios from "axios";
import getData from "./getData";
import Cookies from 'js-cookie';
import getDatacount from "./getcount";
let pagination_size = 10;


export default function DashboardLayout({ children }: any) {
  console.log('-----------------');
  console.log(children.apiData);
  const router: any = useRouter();



  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedArea, setselectedArea] = useState<string>("");
  const [Selectedjob, setSelectedjob] = useState<string>("");
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string>("");
  const [selectedCompany, setselectedCompany] = useState<string>("");
  const [selectedtag, setselectedtag] = useState<string>("");

  //  filter  side menu start
  const [selectedJobs, setSelectedJobs] = useState<any[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimePeriods, setSelectedTimePeriods] = useState<string[]>([]);
  const [selectedallJobsfilter, setallJobsfilter] = useState<any[]>([]);
  //  filter  side menu end
  // console.log("url",parames)
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const pathname = usePathname();
  const slug_value = pathname.split('/');
  const [jobs, setJobs] = useState<[]>([]);
  const [page, setpage] = useState(Number);
  const [lastid, setlastid] = useState("");
  const [count, setcount] = useState(Number);
  const [selectedsortby, setsortby] = useState<string>("");
  let location1 = "";
  let area1 = "";
  let company = "";
  let jobtype1: any = [];
  let days_week1: any = [];
  let timeperiod1: any = [];
  const [show_location, setshow_location] = useState(false);

  useEffect(() => {

    setsortby((params.sortby) ? params.sortby : "Asc");
    setpage((params.page) ? parseInt(params.page) : 1);

    if (slug_value.length >= 2 && slug_value[2] != 'tag' && slug_value[2] != 'company') {
      location1 = slug_value[2];
      setSelectedLocation(slug_value[2]);
      Cookies.set('location', slug_value[2]);
    }
    if (slug_value.length >= 3 && slug_value[2] != 'tag' && slug_value[2] != 'company') {
      area1 = slug_value[3];
      setselectedArea(slug_value[3]);
      Cookies.set('area', area1);
    }
    if (slug_value.length >= 3 && slug_value[2] == 'company') {
      setselectedCompany(slug_value[3]);
      company = slug_value[3];
    }
    if (slug_value.length >= 3 && slug_value[2] == 'tag') {
      setselectedtag(slug_value[3]);
      jobtype1.push(slug_value[3]);
    }
    if (params.title) {
      setSearchQuery(params.title);
    }
    if (params.location) {
      location1 = params.location;
      setSelectedLocation(params.location);
      Cookies.set('location', location1);
    }
    if (params.area) {
      area1 = params.area;
      setselectedArea(params.area);
      Cookies.set('area', area1);
    }
    if (params.company) {
      setselectedCompany(params.company);
      company = params.company;
    }
    if (params.tag) {
      setselectedtag(params.tag);
      jobtype1.push(params.tag);
    }
    if (params.jobs_type) {
      const getjobtypes = params.jobs_type.split(',');
      jobtype1 = getjobtypes;
      setSelectedJobs(getjobtypes);
    }
    if (params.jobs_days) {
      const getjobs_days = params.jobs_days.split(',');
      days_week1 = getjobs_days;
      setSelectedDays(getjobs_days);
    }
    if (params.jobs_time_period) {
      const getjobs_time_period = params.jobs_time_period.split(',');
      timeperiod1 = getjobs_time_period;
      setSelectedTimePeriods(getjobs_time_period);
    }
    const count_of_data = async () => {
      const apiDatacount = await getDatacount({});
      setcount(apiDatacount);
    };
    const fetchJobs = async () => {
      let jobfilter = [...jobtype1, ...days_week1, ...timeperiod1];

      try {
        const response = await getData({
          page: parseInt(params.page),
          count: true,
          lastVisible: false,
          lastid: "",
          location: location1,
          area: area1,
          jobfilter: jobfilter,
          company: company
        });
        setJobs(response);

      } catch (err) {


      }
    };
    count_of_data();
    fetchJobs();
  }, []);

  console.log(selectedLocation);
  console.log(selectedArea);
  // Type start
  const jobTypes = [
    // { label: "All", value: "" },
    { label: "Employer location", value: "employer-location" },
    { label: "Field work", value: "field-work" },
    { label: "Work from home", value: "work-from-home" },
  ];
  const handleJobTypeChange = (jobType: string) => {
    let updatedSelectedJobs: string[] = [];

    if (jobType === "") {
      updatedSelectedJobs = selectedJobs.length === jobTypes.length ? [] : jobTypes.slice(1).map(job => job.value);
    } else {
      updatedSelectedJobs = selectedJobs.includes(jobType)
        ? selectedJobs.filter(selectedJob => selectedJob !== jobType)
        : [...selectedJobs, jobType];
    }

    setSelectedJobs(updatedSelectedJobs);
    console.log(updatedSelectedJobs.toLocaleString());

    let data = { jobtype: updatedSelectedJobs.toLocaleString(), jobdays: selectedDays, jobs_time_period: selectedTimePeriods, sortby: selectedsortby }

    handleSearch(data);
    // Log the selected values
  };
  // Type End 


  // Days Start 

  const daysOfWeek = [
    // { label: "All", value: "" },
    { label: "Weekday", value: "weekday" },
    { label: "Weekend", value: "weekend" },
    { label: "All days", value: "all-days" },
  ];

  const handleDayChange = (day: string) => {
    let updatedSelectedDays;
    if (day === "") {
      updatedSelectedDays = selectedDays.length === daysOfWeek.length ? [] : daysOfWeek.slice(1).map(d => d.value);
    } else {
      updatedSelectedDays = selectedDays.includes(day)
        ? selectedDays.filter(selectedDay => selectedDay !== day)
        : [...selectedDays, day];
    }
    setSelectedDays(updatedSelectedDays);
    console.log(updatedSelectedDays);
    let data = { jobtype: selectedJobs, jobdays: updatedSelectedDays.toLocaleString(), jobs_time_period: selectedTimePeriods, sortby: selectedsortby }
    handleSearch(data);// Log the selected values
  };

  // Days End


  // Time start 

  const timePeriods = [
    // { label: "All", value: "" },
    { label: "Morning", value: "morning" },
    { label: "Afternoon", value: "afternoon" },
    { label: "Evening", value: "evening" },
    { label: "Night", value: "night" },
    { label: "Full day", value: "full-day" },
    { label: "Flexible", value: "flexible" },
  ];


  const handleTimePeriodChange = (timePeriod: string) => {
    let updatedSelectedTimePeriods;
    if (timePeriod === "") {
      updatedSelectedTimePeriods = selectedTimePeriods.length === timePeriods.length ? [] : timePeriods.slice(1).map(tp => tp.value);
    } else {
      updatedSelectedTimePeriods = selectedTimePeriods.includes(timePeriod)
        ? selectedTimePeriods.filter(selectedTp => selectedTp !== timePeriod)
        : [...selectedTimePeriods, timePeriod];
    }
    setSelectedTimePeriods(updatedSelectedTimePeriods);
    console.log(updatedSelectedTimePeriods); // Log the selected values

    let data = { jobtype: selectedJobs, jobdays: selectedDays, jobs_time_period: updatedSelectedTimePeriods.toLocaleString(), sortby: selectedsortby }
    handleSearch(data);
  };
  // Time End 


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

  };
  const handlePageChange = async (pageNumber: number) => {

    const mergedArray = [...selectedJobs, ...selectedDays, ...selectedTimePeriods];
    let lastid = await getData({
      page: pageNumber,
      count: false,
      lastVisible: true,
      lastid: "",
      location: selectedLocation,
      area: selectedArea,
      jobfilter: mergedArray,
      company: selectedCompany

    });

    handleSearch({ page: pageNumber, start: (pageNumber >= 2) ? lastid.id : null, jobtype: selectedJobs, jobdays: selectedDays, jobs_time_period: selectedTimePeriods, sortby: selectedsortby });
  };
  const handleSearch = async (data?: any) => {

    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.set("title", searchQuery);
    }
    if (selectedLocation) {
      queryParams.set("location", selectedLocation);
    }
    if (selectedArea && data?.area != "") {
      queryParams.set("area", selectedArea);
    }
    else {
      Cookies.remove('area');
    }
    if (data?.location) {
      queryParams.set("location", data?.location);
    }
    if (data?.sortby) {
      queryParams.set("sortby", data?.sortby);
    }
    if (data?.area) {
      queryParams.set("area", data?.area);
    }

    if (selectedCompany) {
      queryParams.set("company", selectedCompany);
    }
    if (selectedtag) {
      queryParams.set("tag", selectedtag);
    }
    if (data?.page) {
      queryParams.set("page", data?.page);
    }
    if (data?.start) {
      queryParams.set("start", data?.start);
    }
    if (data?.jobtype) {
      queryParams.set("jobs_type", data?.jobtype);
    }
    if (data?.jobdays) {
      queryParams.set("jobs_days", data.jobdays);
    }
    if (data?.jobs_time_period) {
      queryParams.set("jobs_time_period", data.jobs_time_period);
    }

    const queryString = queryParams.toString();
    router.push(`/jobs?${queryString}`);
  };
  const [selectedHomeCityOption, setSelectedHomeCityOption] = useState(null);
  const loadHomeCityOptions = async (inputValue: any, callback: (arg0: any[]) => void) => {
    if (inputValue) {
      try {

        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
        }
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&types=%28cities%29&key=AIzaSyCzaKDgqmElSIIbKahhFT9vuaqhi_l9icc`

        );

        const data = await response.json();

        let places: any[] = [];
        data?.data?.predictions?.map((place: any, i: any) => {
          places = [
            ...places,
            { value: place.description, label: place.description },
          ];
        });
        callback(places);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const [query, setQuery] = useState('');
  const [key, setKeylocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const pathItems = pathNames
    .map((path, i) => ({
      // Optionally you can capitalize the first letter here
      name: path,
      path: pathNames.slice(0, i + 1).join('/'),
    }));
  if (params.location) {
    pathItems.push({
      // Optionally you can capitalize the first letter here
      name: params.location,
      path: pathNames.slice(0, 1) + "/" + params.location,
    })

  }
  if (params.area) {
    pathItems.push({
      // Optionally you can capitalize the first letter here
      name: params.area,
      path: '/' + params.area,
    })
  }
  const handlesortbyChange = (sortby: string) => {
    if (sortby == "Asc") {

      let data = { jobtype: selectedJobs, jobdays: selectedDays, jobs_time_period: selectedTimePeriods, sortby: "Asc" }
      handleSearch(data);
    }
    else {
      let data = { jobtype: selectedJobs, jobdays: selectedDays, jobs_time_period: selectedTimePeriods, sortby: "Desc" }
      handleSearch(data);

    }
    // Log the selected values
  };
  const fetchSuggestions = async (input: any) => {
    if (input.length === 0) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://warm-caverns-48629-92fab798385f.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=AIzaSyCzaKDgqmElSIIbKahhFT9vuaqhi_l9icc&types=locality|sublocality&components=country:IN`
      );

      const data = await response.json();
      let places: any = [];
      data?.predictions?.forEach((place: any) => {
        places.push({ "label": place.description, "value": place.place_id });
      });
      setSuggestions(places);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);
  const getareaandcity = async (key: any) => {
    if (key) {
      const response = await fetch(
        `https://warm-caverns-48629-92fab798385f.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=${key}&language=en&key=AIzaSyCzaKDgqmElSIIbKahhFT9vuaqhi_l9icc&type=locality`
      );

      const data = await response.json();

      const city = data.result.address_components.filter((item: any) => {
        if (item.types.includes("locality")) {
          console.log(item);
          setSelectedLocation(item.long_name);
          Cookies.set('location', item.long_name);
          return item.long_name;
        }
      });
      const area = data.result.address_components.filter((item: any) => {
        if (item.types.includes("sublocality_level_1")) {
          console.log(item);
          setselectedArea(item.long_name);
          Cookies.set('area', item.long_name);
          return item.long_name;
        }

      });

      handleSearch({ location: city[0].long_name, area: (area && area[0]) ? area[0].long_name : "", jobtype: selectedJobs, jobdays: selectedDays, jobs_time_period: selectedTimePeriods, sortby: selectedsortby });
    }

  }
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };

  const closeDropdown2 = () => {
    setIsOpen2(false);
  };
  const toggleDropdown3 = () => {
    setIsOpen3(!isOpen3);
  };

  const closeDropdown3 = () => {
    setIsOpen3(false);
  };

  const defalut = { jobtype: selectedJobs, jobdays: selectedDays, jobs_time_period: selectedTimePeriods };
  return (
    <section>
      <div className="jobsearch-wrapper-row text-black flex justify-between">
        <div className="job-heading-card">
          <h2 className="job-count-heading">Over {(count == 0) ? '⏳' : count}+ part-time jobs available in</h2>
          <div className="text-center flex justify-start items-center">
            <span className="job-location-heading">{(!selectedArea && !selectedLocation) ? "All" : (!selectedArea && selectedLocation) ? selectedLocation : selectedArea + ',' + selectedLocation}</span> <div style={{ color: "#2523CA", fontWeight: 500, fontSize: "14px", textDecorationLine: "underline", cursor: "pointer" }} onClick={() => setshow_location(!show_location)}>Change</div></div>
          {show_location && (
            <div className="relative">

              <Autocomplete
                className="max-w-xs"
                defaultInputValue={(selectedLocation) ? selectedLocation : (params.area) ? params.area + "," + params.location : params.location}

                items={suggestions}
                placeholder="Type to search location..."
                onInputChange={(value) => fetchSuggestions(value)}
                onSelectionChange={(key) => getareaandcity(key)}
                onReset={() => { setselectedArea(""); setSelectedLocation(""); }}
              >
                {(suggestions: any) => (
                  <AutocompleteItem key={suggestions.value} className="capitalize">
                    {suggestions.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>

              {/* <input type="search" id="default-search" className="global-search-bar block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" style={{ fontSize:"12px" }} placeholder="Search by locality, job type, company" required />
                        <div className="absolute inset-y-0 end-0 flex items-center pe-2  pointer-events-none">
                        <Image src="/icon/ion_search.svg" width={24} height={24} alt="Search" />
                        </div> */}
            </div>
          )}
        </div>
        <div className="filter-group-btn-icon">
          <Button onClick={() => handlesortbyChange(selectedsortby == "Asc" ? "Desc" : "Asc")} className='mr-2' color="primary" variant="bordered" endContent={<Image src="/icon/filter-sort-ic.svg" width={16} height={16} alt="Filter" />}>
            Sort by
          </Button>
        </div>
      </div>
      <div className="my-5 flex">
        <div className="filter-side-bar me-4 w-[224px]">
          {/* <div className="mt-4">
              <h2 className="filter-side-bar_item-title">Salary</h2>
              <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <li className="w-full">
                      <div className="flex items-center mb-2">
                          <input id="4" type="checkbox" className="" />
                          <label htmlFor="4" className="w-full">2000 to 4000rs</label>
                      </div>
                  </li>
                  <li className="w-full">
                      <div className="flex items-center mb-2">
                          <input id="5" type="checkbox" className="" />
                          <label htmlFor="5" className="w-full">4000 to 6000rs</label>
                      </div>
                  </li>
                  <li className="w-full">
                      <div className="flex items-center mb-2">
                          <input id="6" type="checkbox" className="" />
                          <label htmlFor="6" className="w-full">6000 to 8000rs</label>
                      </div>
                  </li>
              </ul>
          </div> */}
          <div className="mt-4">
            <h2 className="filter-side-bar_item-title">Job Model</h2>
            <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {jobTypes.map((jobType, index) => (
                <li className="w-full" key={index}>
                  <div className="flex items-center mb-2">
                    <input id={`jobType-${index}`}
                      type="checkbox"
                      value={jobType.value}
                      checked={jobType.value === "" ? selectedJobs.length === jobTypes.length : selectedJobs.includes(jobType.value)}
                      onChange={() => handleJobTypeChange(jobType.value)} />
                    <label htmlFor={`jobType-${index}`} className="w-full">{jobType.label}</label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h2 className="filter-side-bar_item-title">Day</h2>
            <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {daysOfWeek.map((day, index) => (
                <li className="w-full" key={index}>
                  <div className="flex items-center mb-2">
                    <input id={`day-${index}`}
                      type="checkbox"
                      value={day.value}
                      checked={day.value === "" ? selectedDays.length === daysOfWeek.length : selectedDays.includes(day.value)}
                      onChange={() => handleDayChange(day.value)} />
                    <label htmlFor={`day-${index}`} className="w-full">{day.label}</label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h2 className="filter-side-bar_item-title">Timing</h2>
            <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {timePeriods.map((timePeriod, index) => (
                <li className="w-full" key={index}>
                  <div className="flex items-center mb-2">
                    <input id={`timePeriod-${index}`}
                      type="checkbox"
                      value={timePeriod.value}
                      checked={timePeriod.value === "" ? selectedTimePeriods.length === timePeriods.length : selectedTimePeriods.includes(timePeriod.value)}
                      onChange={() => handleTimePeriodChange(timePeriod.value)} />
                    <label htmlFor={`timePeriod-${index}`} className="w-full">{timePeriod.label}</label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className="job-list-wrpper flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="job-list-wrpper-title"></h1><span className="job-list-wrpper-sub-title">Total {jobs.length} Jobs </span>
          </div>
          <div className="job-list-filter-body">
            <div className="job-list-filter-row  flex justify-between mb-4">

              {/* <div className="filter-group-btn-icon">
                <Button className='mr-2' color="primary" variant="bordered" endContent={<Image src="/icon/filter-sort-ic.svg" width={16} height={16} alt="Filter" />}>
                  Sort by
                </Button>
                <Button className={`${isExpanded ? "filter-active-btn" : ''} ${(selectedJobs.length >= 1 || selectedDays.length >= 1 || selectedTimePeriods.length >= 1) ? "filter-active-btn-icon-active" : ''}`} onClick={toggleExpansion} color="primary" variant="bordered" endContent={isExpanded ?
                  <Image src="/icon/white-filter-line.svg" width={16} height={16} alt="Filter" /> : <Image src="/icon/mingcute_filter-line-ic.svg" width={16} height={16} alt="Filter" />}>
                  Filter
                </Button>
              </div> */}
            </div>
            {isExpanded && (
              <div className="filter-collapse-card collapsible-content">
                <div className="flex">
                  <div className='w-[160px] job-filter_dropdown'>
                    <div className="relative">
                      <button
                        type="button"
                        className="filter_dropdown-btn"
                        onClick={toggleDropdown}
                      >
                        Job Model <svg className="w-2.5 h-3.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          {isOpen ? (
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 1l8 8M1 9L9 1"
                            />
                          ) : (
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 4 4 4-4"
                            />
                          )}
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="origin-top-right absolute left-0 right-0 bg-white">
                          <ul className="filter_dropdown-item" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">

                            {jobTypes.map((jobType, index) => (
                              <li key={index} className="w-full">
                                <div className="flex items-center mb-2">
                                  <input
                                    id={`jobType-${index}`}
                                    type="checkbox"
                                    value={jobType.value}
                                    checked={jobType.value === "" ? selectedJobs.length === jobTypes.length : selectedJobs.includes(jobType.value)}
                                    onChange={() => handleJobTypeChange(jobType.value)}
                                    className="w-4 h-4"
                                  />
                                  <label htmlFor={`jobType-${index}`} className="w-full">
                                    {jobType.label}
                                  </label>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='w-[160px] job-filter_dropdown'>
                    <div className="relative">
                      <button
                        type="button"
                        className="filter_dropdown-btn"
                        onClick={toggleDropdown2}
                      >
                        Day <svg className="w-2.5 h-3.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          {isOpen2 ? (
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 1l8 8M1 9L9 1"
                            />
                          ) : (
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 4 4 4-4"
                            />
                          )}
                        </svg>
                      </button>

                      {isOpen2 && (
                        <div className="origin-top-right absolute left-0 right-0 bg-white">
                          <ul className="filter_dropdown-item" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {daysOfWeek.map((day, index) => (
                              <li key={index} className="w-full">
                                <div className="flex items-center mb-2">
                                  <input
                                    id={`day-${index}`}
                                    type="checkbox"
                                    value={day.value}
                                    checked={day.value === "" ? selectedDays.length === daysOfWeek.length : selectedDays.includes(day.value)}
                                    onChange={() => handleDayChange(day.value)}
                                    className="w-4 h-4"
                                  />
                                  <label htmlFor={`day-${index}`} className="w-full">
                                    {day.label}
                                  </label>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='w-[160px] job-filter_dropdown'>
                    <div className="relative">
                      <button
                        type="button"
                        className="filter_dropdown-btn"
                        onClick={toggleDropdown3}
                      >
                        Timing <svg className="w-2.5 h-3.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                          {isOpen3 ? (
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 1l8 8M1 9L9 1"
                            />
                          ) : (
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 4 4 4-4"
                            />
                          )}
                        </svg>
                      </button>

                      {isOpen3 && (
                        <div className="origin-top-right absolute left-0 right-0 bg-white">
                          <ul className="filter_dropdown-item" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {timePeriods.map((timePeriod, index) => (
                              <li key={index} className="w-full">
                                <div className="flex items-center mb-2">
                                  <input
                                    id={`timePeriod-${index}`}
                                    type="checkbox"
                                    value={timePeriod.value}
                                    checked={timePeriod.value === "" ? selectedTimePeriods.length === timePeriods.length : selectedTimePeriods.includes(timePeriod.value)}
                                    onChange={() => handleTimePeriodChange(timePeriod.value)}
                                    className="w-4 h-4"
                                  />
                                  <label htmlFor={`timePeriod-${index}`} className="w-full">
                                    {timePeriod.label}
                                  </label>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="filter-selected_row mt-2">
                  {selectedJobs.map((jobtypefilter: any) => (
                    <div key={key}>
                      <div className="filter-selected-item" >{jobtypefilter}
                        <Image className="img" src="/icon/close-ic.svg" width={16} height={16} alt="Close icon" onClick={() => {

                          let data = { jobtype: selectedJobs.filter(selectedJobs => selectedJobs !== jobtypefilter), jobdays: selectedDays, jobs_time_period: selectedTimePeriods, sortby: selectedsortby }

                          handleSearch(data);
                        }} />
                      </div>
                    </div>
                  ))}
                  {selectedDays.map((daysfilter: any) => (
                    <div key={key}>
                      <div className="filter-selected-item">{daysfilter}
                        <Image className="img" src="/icon/close-ic.svg" width={16} height={16} alt="Close icon" onClick={() => {

                          let data = { jobtype: selectedJobs, jobdays: selectedDays.filter(selectedDays => selectedDays !== daysfilter), jobs_time_period: selectedTimePeriods, sortby: selectedsortby }

                          handleSearch(data);
                        }} />
                      </div>
                    </div>
                  ))}
                  {selectedTimePeriods.map((timefilter: any) => (
                    <div key={key}>
                      <div className="filter-selected-item" >{timefilter}
                        <Image className="img" src="/icon/close-ic.svg" width={16} height={16} alt="Close icon" onClick={() => {

                          let data = { jobtype: selectedJobs, jobdays: selectedDays, jobs_time_period: selectedTimePeriods.filter(selectedTimePeriods => selectedTimePeriods !== timefilter), sortby: selectedsortby }

                          handleSearch(data);
                        }} />
                      </div>
                    </div>
                  ))}

                  {/* <Link className="filter-selected-item" href="#">Weekday
                    <Image className="img" src="/icon/close-ic.svg" width={16} height={16} alt="Close icon" />
                  </Link>
                  <Link className="filter-selected-item" href="#">Evening
                    <Image className="img" src="/icon/close-ic.svg" width={16} height={16} alt="Close icon" />
                  </Link> */}

                </div>
              </div>
            )}
          </div>
          <div className="">{children}</div>
        </div>
      </div>
      <div className="pagination-row flex justify-center">
        {Array.from({ length: Math.ceil(jobs.length / pagination_size) }, (_, index) => (

          (jobs.length) > pagination_size && (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={parseInt(params.page) === index + 1}
              className={(parseInt(params.page) === index + 1 || (!params.page && index == 0)) ? 'selected' : 'pagination'}
            >
              {index + 1}
            </button>
          )


        ))}
      </div>
      <div className="breadcrumbs-row">
        <Breadcrumbs>
          <BreadcrumbItem key={1} href="/" className="breadcrumbs-text">Home</BreadcrumbItem>
          {pathItems.map((item) => (
            <BreadcrumbItem className="breadcrumbs-text-active" key={item.path} href={`/${item.path}`}>
              {item.name}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </div>
    </section >
  );
}

