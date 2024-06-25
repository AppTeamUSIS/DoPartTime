import { db } from './../../../../firbaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

const Profile = async ({ params }: any) => {
  const getData = async () => {
    try {
      const docRef = doc(db, 'users', params.slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('User not found');
      }
    } catch (error:any) {
      throw new Error("Failed to fetch data from Firestore: " + error.message);
    }
  };

  try {
    const apiData:any = await getData();
    return (
      <>
        <h2  className="text-center p-10">Profile Detsils</h2>
        <div>
          <div className="flex min-h-screen flex-col items-center m-10" key={apiData.id}>

            <div className="wrapper job-wrpper">            
              <div className="job-wrpper">
                {apiData.photo_url ? (
                  <Image src={apiData.photo_url} width={32} height={32} alt="Company" />
                ) : (
                  <Image src="https://flowbite.com/docs/images/logo.svg" width={32} height={32} alt="Default Company Logo" />
                )}
                <div>
                  <p>{apiData.display_name}</p>
                </div>
              </div>

              <div className="job-wrpper">
                <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                <span> {apiData.email}</span>
              </div>
              <div className="job-wrpper">
                <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                <span> {apiData.phone_number}</span>
              </div>
              <div className="job-wrpper">
                <Image src="/icon/map-pin.svg" width={16} height={16} alt="Logo" />
                <span> {apiData.gender}</span>
              </div>
            
            </div>

            <div className="wrapper job-wrpper">            
              <div className="job-wrpper">
              <h2>BIO</h2>
              <br />
                <span>{apiData.bio}</span>
                </div>
                </div>


                <div className="wrapper job-wrpper">            
              <div className="job-wrpper">
              <h2>Experience</h2>
              <br />
              {apiData.experience && apiData.experience.length > 0 ? (
      apiData.experience.map((exp: string, index: number) => (
        <p key={index}>{exp}</p>
      ))
    ) : (
      <p>No experience available</p>
    )}
                </div>
                </div>

                <div className="wrapper job-wrpper">            
              <div className="job-wrpper">
              <h2>Skill</h2>
              <br />
              {/* {apiData.skill.map((ski: string, index: number) => (
              <p key={index}>{ski}</p>
            ))} */}

{apiData.skill && apiData.skill.length > 0 ? (
      apiData.skill.map((exp: string, index: number) => (
        <p key={index}>{exp}</p>
      ))
    ) : (
      <p>No skill available</p>
    )}
                </div>
                </div>
          </div>
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
};

export default Profile;
