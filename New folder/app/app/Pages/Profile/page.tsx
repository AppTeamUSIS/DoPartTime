import { db } from './../../firbaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

const getData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data:any = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error:any) {
    throw new Error("Failed to fetch data from Firestore: " + error.message);
  }
}

const Profile = async () => {
  try {
    const apiData = await getData();
    return (
      <>
        <h2 className="text-center p-10">Profile</h2>
        <div className="flex min-h-screen flex-col items-center">
          {apiData.map((item:any, index:any) => (
            <div className="wrapper" key={index}>               
              <div className="job-wrpper" key={item.id}>
              <Link href={`/Pages/Profile/Profile_details/${item.id}`}>
                 <div className="job-header">
                  {item.photo_url ? (
                    <Image src={item.photo_url} width={32} height={32} alt="Company" />
                ) : (
                     <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                  )}
                  <div>
                    <p>{item.display_name}</p>
                    {/* <span>{profile.title}</span> */}
                   </div>
                 </div>
                 <div className="job-body">
                  <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                  <span> {item.email}</span>
                </div>  
               </Link>
            </div>
            
           
            </div>
          ))}
        </div>
      </>
    );
  } catch (error:any) {
    console.error(error); 
    return (
      <>
        <h2>Profile</h2>
        <div>Error fetching data: {error.message}</div>
      </>
    );
  }
}

export default Profile;