


"use client"
import { db } from './../../../firbaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
// import '../../globals.css';
import Image from 'next/image';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';

async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "jobs"));
  const data:any = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

export default function Dashboard() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setUserData(data);
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Firebase Data</h1>

      <div className="container my-12 mx-auto px-4 md:px-12">
    <div className="flex flex-wrap -mx-1 lg:-mx-4">

        {/* <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"> */}

            <article className="overflow-hidden rounded-lg shadow-lg">              
                            <header className="flex items-center justify-between leading-none p-2 md:p-4">
                    <a className="flex items-center no-underline text-black" >
                    <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Logo"/>
                       
                       <div>
                       <p className="ml-2 text-sm">Stock checking - Part time Job Stock checking - Part time Job  Part time Job Stock checking </p>
                       <p className="ml-2 text-sm">Stock checking - Part time Job</p>
                      </div> 
                        
                    </a>
                    <div>

                    </div>
                </header>

            </article>

        {/* </div> */}
        
        
    </div>
</div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                   Id
                </th>
                <th scope="col" className="px-6 py-3">
                   Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
                </th>
                <th scope="col" className="px-6 py-3">
                    Message
                </th>
               
            </tr>
        </thead>
        <tbody>
        {userData.map((message:any) => (
            <tr key={message.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {message.title}
                </th>
                <td className="px-6 py-4">
                {message.gender}
                </td>
                <td className="px-6 py-4">
                {message.location}
                </td>
                <td className="px-6 py-4">
                {message.description}
                </td>
                
            </tr>
             ))}
        </tbody>
    </table>
</div>




   
    </main>
  );
}
