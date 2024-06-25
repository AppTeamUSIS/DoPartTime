"use client";
import { usePathname } from "next/navigation"; // To get the current route
import Image from 'next/image'
import Link from 'next/link';
import { useState } from "react";
export default function Sidebar() {
    const pathname = usePathname(); // Get the current route
    const [isActive, setIsActive] = useState(false);

    const toggleSidebar = () => {
        setIsActive(!isActive); // Toggle the isActive state
    };
    const closeSidebar = () => {
        setIsActive(false); // Set isActive to false to close the sidebar
      };
    // Define menu items with hrefs and label names
    const menuItems = [
        { href: "/", label: "Home", icon: "/icon/iconamoon_home.svg" },
        { href: "/Pages/Profile", label: "My Profile", icon: "/icon/ph_user-bold.svg" },
        { href: "/#", label: "Saved Jobs", icon: "/icon/lucide_bookmark.svg" },
        { href: "/#", label: "My Messages", icon: "/icon/mingcute_message-2-line.svg" },
        { href: "/#", label: "My Application", icon: "/icon/gravity-ui_file.svg" },
        { href: "/#", label: "Settings", icon: "/icon/eva_settings-outline.svg" },
    ];
    return (
        <><div className="mobile-menu">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <Image src="/icon/menu-ic.svg" width={28} height={28} alt="Menu" />
            </button>
           </div>
            <div className={`sidebar ${isActive ? 'active' : ''}`}>
            <div className="flex flex-col p-6 w-full h-[100vh]">
                <div className="mb-8 mobile-close-btn-card">
                    <Link href="/">
                        <Image src="/Logo/logo.png" width={138} height={34} alt="DoPartTime" />
                    </Link>
                    <button onClick={closeSidebar} className="mb-close-btn">
                     <Image src="/icon/close-ic.svg" width={24} height={24} alt="Close" />                        
                    </button>
                </div>

                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const backgroundColor = isActive ? "#EDF1FF" : "transparent";
                    const textColor = isActive ? "#212121" : "#616161";
                    const fontWeight = isActive ? "500" : "400"; // Conditional font weight

                    const pseudoElementStyles: React.CSSProperties = isActive
                        ? {
                            content: '""',
                            position: "absolute",
                            left: "0", // Offset for left border
                            top: "calc(50% - 18.5px)", // Center vertically for 37px height
                            height: "37px",
                            width: "4px",
                            borderRadius: "4px",
                            backgroundColor: "#2523CA",
                        }
                        : {};

                    return (
                        <div className="relative" key={item.href}>
                            <Link
                                href={item.href}
                                onClick={closeSidebar}
                                className="mb-1 flex px-4 py-3 rounded-lg"
                                style={{ backgroundColor }}
                            >
                                {isActive && (
                                    <span className="absolute" style={pseudoElementStyles}></span> // Pseudo-element for left border
                                )}
                                <Image src={item.icon} width={24} height={24} alt={item.label} />
                                <span style={{ color: textColor, fontWeight }} className="mx-2">{item.label}</span>
                            </Link>
                        </div>
                    );
                })}

                <div className="flex-grow">
                    {/* <div>User</div> */}
                </div>
                {/* <Link href="/" className="mb-1 flex py-4">
                    <Image src="/icon/logout-ic.svg" className='' width={24} height={24} alt="Logo" />
                    <span className='mx-2'>Logout</span>
                </Link> */}
            </div>
        </div></>
    );
}
