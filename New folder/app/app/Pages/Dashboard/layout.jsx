"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({children}) {
  const router = useRouter();
  const home = () =>{
    alert("hai");
    router.push('/Pages/Dashboard/Home');
  }
  return (
    <section>
      {/* <h1>A href working </h1>
         <a href="/Pages/Dashboard"><h1>Dashboar</h1> </a>
        <a href="/Pages/Dashboard/Home">Home              </a> 
        <a href="/Pages/Dashboard/About">            About            </a> 
        <a href="/Pages/Dashboard/Settings">              Setting        </a>

    <br />
    <br /> */}

        {/* <h1>Link Working</h1>
         <Link href="/Pages/Dashboard"><h1>Dashboar</h1> </Link>
        <Link href="/Pages/Dashboard/Home">Home              </Link> 
        <Link href="/Pages/Dashboard/About">            About            </Link> 
        <Link href="/Pages/Dashboard/Settings">              Setting        </Link>


        <br />
        <br /> */}

        {/* <h1>Routing Function</h1> */}
        {/* <button onClick={home}>Home</button> */}
        {children}
        {/* <h1>Fotter</h1> */}
    </section>
  );
}