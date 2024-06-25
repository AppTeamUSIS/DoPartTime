"use client";

import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import Image from "next/image";
import getData from "./getdata";
import getDatacount from "../jobs/[[...slug]]/getcount";
let pagination_size = 10;
export default function DashboardLayout({ children }: any) {
    const router: any = useRouter();
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [selectedArea, setselectedArea] = useState<string>("");
    const [selectedsortby, setsortby] = useState<string>("");
    const [show_location, setshow_location] = useState(false);
    const [page, setpage] = useState(Number);
    const [count, setcount] = useState(Number);
    const [lastid, setlastid] = useState("");
    const [data, setData] = useState<[]>([]);
    let location1 = "";
    let area1 = "";
    const [suggestions, setSuggestions] = useState([]);
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
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
        const count_of_data = async () => {
            const apiDatacount = await getDatacount({});
            setcount(apiDatacount);
        };
        const fetchdata = async () => {
            try {
                const response = await getData(
                    {
                        page: parseInt(params.page),
                        count: true,
                        lastVisible: false,
                        lastid: "",
                        location: location1,
                        area: area1,
                        sortby: "Asc"
                    }
                );
                setData(response);

            } catch (err) {


            }
        };
        count_of_data();
        fetchdata();
    }, []);
    const handlesortbyChange = (sortby: string) => {
        if (sortby == "Asc") {
            handlefilter({ sortby: "Asc", location: selectedLocation, area: selectedArea });

        }
        else {
            handlefilter({ sortby: "Desc", location: selectedLocation, area: selectedArea });

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
            handlefilter({ location: city[0].long_name, area: (area && area[0]) ? area[0].long_name : "", sortby: selectedsortby });
        }

    }
    const handlefilter = async (data?: any) => {
        const queryParams = new URLSearchParams();

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
        router.push(`/company_list?${queryString}`);
    };
    const handlePageChange = async (pageNumber: number) => {
        let lastid = await getData({
            page: pageNumber,
            count: false,
            lastVisible: true,
            lastid: "",
            location: selectedLocation,
            area: selectedArea,
            sortby: "Asc"
        });
        handlefilter({ page: pageNumber, start: (pageNumber >= 2) ? lastid.id : null, sortby: selectedsortby, location: selectedLocation, area: selectedArea });
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


                {/* <div className="my-5 flex">
                <div className="filter-side-bar me-4 w-[224px]">
                    <div className="mb-4 mt-2">
                        <h2 className="filter-side-bar_item-title">Keyword </h2>
                        <input className="filter-side-bar_item-search-field w-full" type="text" placeholder="Enter keyword" />
                    </div>
                    <div className="">
                        <h2 className="filter-side-bar_item-title">Rating </h2>
                        <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="1" type="checkbox" className=""/>
                                    <label htmlFor="1" className="w-full">4 or Above</label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="2" type="checkbox" className=""/>
                                    <label htmlFor="2" className="w-full">3 or above</label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="3" type="checkbox" className=""/>
                                    <label htmlFor="3" className="w-full">2 or above</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h2 className="filter-side-bar_item-title">Preferred Location </h2>
                        <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="4" type="checkbox" className=""/>
                                    <label htmlFor="4" className="w-full">Employer location</label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="5" type="checkbox" className=""/>
                                    <label htmlFor="5" className="w-full">Field work</label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="6" type="checkbox" className=""/>
                                    <label htmlFor="6" className="w-full">Work from home</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h2 className="filter-side-bar_item-title">Timing</h2>
                        <ul className="filter-side-bar_item-row" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="7" type="checkbox" className=""/>
                                    <label htmlFor="7" className="w-full">Morning</label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="8" type="checkbox" className=""/>
                                    <label htmlFor="8" className="w-full">Afternoon</label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="9" type="checkbox" className=""/>
                                    <label htmlFor="9" className="w-full">Evening</label>
                                </div>
                            </li>
                            <li className="w-full">
                                <div className="flex items-center mb-2">
                                    <input id="10" type="checkbox" className=""/>
                                    <label htmlFor="10" className="w-full">Night</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
               
            </div> */}
                <div className="my-5 flex">
                    <div className="filter-side-bar me-4 w-[224px]">


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