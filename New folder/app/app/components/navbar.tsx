"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from "next/navigation"; // To get the current route 
// import { useState } from 'react';
export default function Navbar() {
    const pathname = usePathname(); // Get the current route 
    // const [isActive, setIsActive] = useState(false);

    // Define menu items with hrefs and label names
    const menuItems = [
      { href: "/", label: "Jobs" },
      {href:"/candidates", label: "Candidates"},  
      {href:"/companies", label: "Companies"},  
    ];    
    return (
        <>
        <header>
          <div className="h-[36px]" style={{ backgroundColor: "#DEE0FF", textAlign: 'center', fontSize: "11px", color:"black",fontWeight: 600, padding: "10px 0" }}>🎉 10,000+ people have successfully got part time jobs with DoPartTime  🎉</div>
          <nav className="bg-white">
            <div className="navbar-wrapper">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-1 flex-shrink-0 items-center">
                    <Link href="/">
                        <Image src="/Logo/logo.png" width={138} height={34} alt="DoPartTime" />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex items-center space-x-4">
                      <span className="text-black  rounded-md px-3 py-2 text-sm font-semibold">I am looking for</span>
                      <div className="nav-menu-card flex items-center">
                      <div className="nav-menu-card__row flex items-center">             
                        {menuItems.map((item) => {
                            
                            const isActive = pathname === item.href;
                            const backgroundColor = isActive ? "#2523CA" : "#DEE0FF";
                            const textColor = isActive ? "#FFFFFF" : "#2523CA";
                            const fontWeight = isActive ? "500" : "500";
                            const boxShadow = isActive ? "0px 0px 2px 0px #2523CA8C" : "none";
                            
                            return (

                                
                                <div className="" key={item.href}>
                                    <Link style={{ backgroundColor, padding:"6px 24px", borderRadius:"16px", boxShadow }} href={item.href} className="rounded-lg">
                                        <span style={{ color: textColor, fontWeight, fontSize:"12px" }} className="">{item.label}</span>                                        
                                    </Link>
                                </div>
                            );
                        })}
                        </div>
                                        
                                            
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

        </header>
        </>
    );
}