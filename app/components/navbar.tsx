"use client"
import { Button } from '@nextui-org/react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from "next/navigation"; // To get the current route 
import { useState } from 'react';
import { Select, SelectItem } from "@nextui-org/react";
// import { useState } from 'react';
export default function Navbar() {
  const pathname = usePathname(); // Get the current route 
  // const [isActive, setIsActive] = useState(false);

  // Define menu items with hrefs and label names
  const menuItems = [
    // { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/candidate_list", label: "Candidates" },
    { href: "/company_list", label: "Companies" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const animals = [
    { label: "Jobs" },
    { label: "Candidate" },
    { label: "Company" }
  ];
  return (
    <>
      <header>
        {/* <div className="h-[36px]" style={{ backgroundColor: "#DEE0FF", textAlign: 'center', fontSize: "11px", color:"black",fontWeight: 600, padding: "10px 0" }}>🎉 10,000+ people have successfully got part time jobs with DoPartTime  🎉</div> */}
        <nav className="navbar-desktop bg-white">
          <div className="navbar-wrapper">
            <div className="relative  h-16 py-2">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <Link href="/">
                    <Image src="/Logo/logo.png" width={138} height={34} alt="DoPartTime" />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex items-center space-x-4">
                    <span className="text-black  rounded-md px-3 py-2 text-sm font-semibold">I am looking for</span>
                    <div className="nav-menu-card flex items-center">
                      <div className="nav-menu-card__row flex items-center justify-between">
                        {menuItems.map((item) => {

                          const isActive = pathname === item.href;
                          const backgroundColor = isActive ? "#2523CA" : "#DEE0FF";
                          const textColor = isActive ? "#FFFFFF" : "#2523CA";
                          const fontWeight = isActive ? "500" : "500";
                          const boxShadow = isActive ? "0px 0px 2px 0px #2523CA8C" : "none";

                          return (


                            <div className="" key={item.href}>
                              <Link style={{ backgroundColor, padding: "6px 24px", borderRadius: "16px", boxShadow }} href={item.href} className="rounded-lg flex items-center">
                                <span style={{ color: textColor, fontWeight, fontSize: "12px" }} className="">{item.label}</span>
                              </Link>
                            </div>

                          );
                        })}
                      </div>
                      <Button onClick={toggleDropdown} className='nav-search-btn rounded bg-primary p-1' isIconOnly color="danger" aria-label="Search">
                        {isOpen ? (
                          <Image src="/Icon/close-ic.svg" width={18} height={18} alt="Search icon" />
                        ) : (
                          <Image src="/Icon/search.svg" width={18} height={18} alt="Search icon" />
                        )
                        }
                      </Button>
                      {isOpen && (
                        <div className="nav-search__input">
                          <input className='nav-search__input-field flex-1' type="text" placeholder='Search' />
                          <Button className='nav-submit-btn rounded bg-primary p-1' isIconOnly color="danger" aria-label="Search">
                            <Image src="/Icon/search.svg" width={18} height={18} alt="Search icon" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="nav-login-btn__card flex justify-between bg-primary p-1 rounded">
                  <Link href="https://app.doparttime.com/register_page" className='btn-text'>Sign Up </Link>
                  <span className='px-1 btn-text'>/</span>
                  <Link href="https://app.doparttime.com/login" className='btn-text'> Log In</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <nav className='navbar-mobile'>
          <div className="flex">
            <div className="inline-flex flex-1">
              <Image src="/Icon/dpt-mb-logo.svg" width={31} height={43} alt='DoPartTime' />
              <div className="">
                <h4 className='mb-nav-job-title'>2,000+ part-time jobs in</h4>
                <div className="flex">
                  <h2 className='mb-nav-job-loc'>Egmore, Chennai </h2>
                  <Image src="/Icon/pencil.svg" className='ms-2' width={15} height={15} alt='Edit location' />
                </div>
              </div>
            </div>
            <div className="w-[130px]">
              <div className='mb-nav-job-desc'>
                I am looking for
              </div>
              <div className="mb-nav-job-select">
                <Select className="max-w-xs" label="Favorite Animal" defaultSelectedKeys={["Jobs"]}>
                  {animals.map((animal) => (
                    <SelectItem key={animal.label}>
                      {animal.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center md:flex-row ms:flex-col mt-2">

            <div className="w-full">

              <form className="mx-auto" action="/search/">
                <div className="relative">
                  <input type="search" id="default-search" className="global-search-bar block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-400 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" style={{ fontSize: "12px" }} placeholder="Search by locality, job type, company" required />
                  {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
                  <div className="absolute inset-y-0 start-3 flex items-center pe-2  pointer-events-none">
                    <Image src="/icon/ion_search.svg" width={24} height={24} alt="Search" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}