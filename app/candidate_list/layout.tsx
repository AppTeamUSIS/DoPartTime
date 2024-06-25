"use client";

import { getDocs, collection, query, orderBy, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Autocomplete, AutocompleteItem, BreadcrumbItem, Breadcrumbs, Button, Tab, Tabs } from "@nextui-org/react";
import axios from "axios";
import getData from "./getData";
import Cookies from 'js-cookie';
import router from "next/router";
import getDatacandiate from "./getData";
import getDatacount from "../jobs/[[...slug]]/getcount";
let pagination_size = 10;


export default function DashboardLayout({ children }: any) {
    const router: any = useRouter();
    //  filter  side menu start
    const [selectedJobs, setSelectedJobs] = useState<any[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedgender, setSelectedgender] = useState<string>();
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [selectedArea, setselectedArea] = useState<string>("");
    const [selectedsortby, setsortby] = useState<string>("");
    const [show_location, setshow_location] = useState(false);
    const [page, setpage] = useState(Number);
    const [count, setcount] = useState(Number);
    const [suggestions, setSuggestions] = useState([]);
    let gender = "";
    let jobtype1: any = [];
    let days_week1: any = [];
    let location1 = "";
    let area1 = "";
    const searchParams = useSearchParams();
    const [data, setData] = useState<[]>([]);
    const [lastid, setlastid] = useState("");
    const params = Object.fromEntries(searchParams.entries());
    const jobTypes = [
        // { label: "All", value: "" },
        { label: "Employer location", value: "employer-location" },
        { label: "Field work", value: "field-work" },
        { label: "Work from home", value: "work-from-home" },
    ];
    const daysOfWeek = [
        // { label: "All", value: "" },
        { label: "Weekday", value: "weekday" },
        { label: "Weekend", value: "weekend" },
        { label: "All days", value: "all-days" },
    ];
    useEffect(() => {
        setsortby((params.sortby) ? params.sortby : "Asc");
        setpage((params.page) ? parseInt(params.page) : 1);
        if (params.location) {
            location1 = params.location;
            setSelectedLocation(params.location);
            Cookies.set('company_location', location1);
        }
        if (params.area) {
            area1 = params.area;
            setselectedArea(params.area);
            Cookies.set('company_area', area1);
        }
        if (params.lastid) {

            setlastid(params.lastid);

        }
        if (params.jobs_type) {
            const getjobtypes = params.jobs_type.split(',');
            jobtype1.push(getjobtypes);
            setSelectedJobs(getjobtypes);
        }
        if (params.jobs_days) {
            const getjobs_days = params.jobs_days.split(',');
            days_week1.push(getjobs_days);
            setSelectedDays(getjobs_days);
        }
        if (params.gender) {
            setSelectedgender(params.gender);
            gender = params.gender;
        }
        const count_of_data = async () => {
            const apiDatacount = await getDatacount({});
            setcount(apiDatacount);
        };
        const fetchdata = async () => {
            try {
                const response = await getDatacandiate(
                    {
                        page: parseInt(params.page),
                        count: true,
                        lastVisible: false,
                        lastid: "",
                        job_type: jobtype1,
                        job_day: days_week1,
                        gender: gender,
                        location: location1,
                        area: area1
                    }
                );
                setData(response);

            } catch (err) {


            }
        };

        fetchdata();
        count_of_data();
    }, []);
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

        let data = { jobtype: updatedSelectedJobs.toLocaleString(), jobdays: selectedDays, gender: selectedgender, location: selectedLocation, area: selectedArea, sortby: selectedsortby, }

        handlefilter(data);
        // Log the selected values
    };
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
        let data = { jobtype: selectedJobs, jobdays: updatedSelectedDays.toLocaleString(), gender: selectedgender, location: selectedLocation, area: selectedArea, sortby: selectedsortby, }
        handlefilter(data);// Log the selected values
    };
    const handlegenderChange = (gender: string) => {
        if (gender == selectedgender) {
            console.log(gender);
            let data = { jobtype: selectedJobs, jobdays: selectedDays, gender: null, location: selectedLocation, area: selectedArea, sortby: selectedsortby, }
            handlefilter(data);
        }
        else {
            console.log(gender);
            let data = { jobtype: selectedJobs, jobdays: selectedDays, gender: gender.toLocaleString(), location: selectedLocation, area: selectedArea, sortby: selectedsortby, }
            handlefilter(data);
        }
        // Log the selected values
    };
    const fetchSuggestions = async (input: any) => {
        if (input.length === 0) {
            setSuggestions([]);
            return;
        }
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

        }
    };
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
                    Cookies.set('company_location', item.long_name);
                    return item.long_name;
                }
            });
            const area = data.result.address_components.filter((item: any) => {
                if (item.types.includes("sublocality_level_1")) {
                    console.log(item);
                    setselectedArea(item.long_name);
                    Cookies.set('company_area', item.long_name);
                    return item.long_name;
                }

            });
            handlefilter({ location: city[0].long_name, area: (area && area[0]) ? area[0].long_name : "", sortby: selectedsortby, jobtype: selectedJobs, jobdays: selectedDays, gender: selectedgender });
        }

    }
    const handlesortbyChange = (sortby: string) => {
        if (sortby == "Asc") {
            handlefilter({ sortby: "Asc", location: selectedLocation, area: selectedArea, jobtype: selectedJobs, jobdays: selectedDays, gender: selectedgender });

        }
        else {
            handlefilter({ sortby: "Desc", location: selectedLocation, area: selectedArea, jobtype: selectedJobs, jobdays: selectedDays, gender: selectedgender });

        }
        // Log the selected values
    };
    const handlefilter = async (data?: any) => {
        const queryParams = new URLSearchParams();
        if (data?.jobtype != "") {
            queryParams.set("jobs_type", data?.jobtype);
        }
        if (data?.jobdays != "") {
            queryParams.set("jobs_days", data.jobdays);
        }
        if (data?.gender) {
            queryParams.set("gender", data.gender);
        }
        if (data?.location) {
            queryParams.set("location", data?.location);
        }
        if (data?.area) {
            queryParams.set("area", data?.area);
        }
        if (data?.page) {
            queryParams.set("page", data?.page);
        }
        if (data?.start) {
            queryParams.set("start", data?.start);
        }
        if (data?.sortby) {
            queryParams.set("sortby", data?.sortby);
        }

        const queryString = queryParams.toString();
        router.push(`/candidate_list?${queryString}`);
    };
    const handlePageChange = async (pageNumber: number) => {
        let lastid = await getDatacandiate({
            page: pageNumber,
            count: false,
            lastVisible: true,
            lastid: "",
            job_type: selectedJobs,
            job_day: selectedDays,
            gender: selectedgender,
            location: selectedLocation,
            area: selectedArea

        });
        handlefilter({ location: selectedLocation, area: selectedArea, sortby: selectedsortby, page: pageNumber, start: (pageNumber >= 2) ? lastid.id : null, jobtype: selectedJobs, jobdays: selectedDays, gender: selectedgender });
    };
    return (
        <>
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
                        <div className="mt-4">
                            <h2 className="filter-side-bar_item-title">Preferred Location </h2>
                            <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {jobTypes.map((jobType, index) => (
                                    <li className="w-full">
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
                            <h2 className="filter-side-bar_item-title">Timing</h2>
                            <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {daysOfWeek.map((day, index) => (
                                    <li className="w-full">
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
                            <h2 className="filter-side-bar_item-title">Gender </h2>
                            <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <li className="w-full">
                                    <div className="flex items-center mb-2">
                                        <input value="Both"
                                            checked={(selectedgender === "Both")}
                                            onChange={() => handlegenderChange("Both")} type="checkbox" name="gender" className="" />
                                        <label htmlFor="7" className="w-full">All</label>
                                    </div>
                                </li>
                                <li className="w-full">
                                    <div className="flex items-center mb-2">
                                        <input value="Male" checked={(selectedgender === "Male")}
                                            onChange={() => handlegenderChange("Male")} type="checkbox" name="gender" className="" />
                                        <label htmlFor="5" className="w-full">Male</label>
                                    </div>
                                </li>
                                <li className="w-full">
                                    <div className="flex items-center mb-2">
                                        <input value="Female" checked={(selectedgender === "Female")}
                                            onChange={() => handlegenderChange("Female")} type="checkbox" name="gender" className="" />
                                        <label htmlFor="6" className="w-full">Female</label>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </div>
                    <div className="cmp-list-card flex-1">
                        <div className="">{children}</div>
                    </div>

                </div>
                <div className="pagination-row flex justify-center">
                    {Array.from({ length: Math.ceil(data.length / pagination_size) }, (_, index) => (

                        (data.length) > pagination_size && (
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
            </section>
        </>
    );
}