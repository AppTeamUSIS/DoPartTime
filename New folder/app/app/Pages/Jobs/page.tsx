// import { db } from './../../firbaseconfig';
// import { collection, getDocs } from 'firebase/firestore';

// const getData = async () => {

//   const response = await fetch('https://gorest.co.in/public/v2/users');
//   console.log(response)

//   // const response:any = await getDocs(collection(db, "jobs"));
//   // const data: any = [];
//   // response.forEach((doc:any) => {
//   //   const message: any = { id: doc.id, ...doc.data() };
//   //   data.push({ id: doc.id, ...doc.data() });
//   // });


//   if (!response.ok) {
//     throw new Error("failed to fetch API data");
//   }
//   return response;
// }


//   const Login = async () => {

//     const apiData = await getData();

//     return(
//       <>
//       <h2>Login</h2>
//       <div>
//         {JSON.stringify(apiData)}
//       </div>
//       </>
//     )
//   }

//   export default Login;




import { db } from './../../firbaseconfig';
import { collection, getDocs } from 'firebase/firestore';

const getData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const data:any = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error:any) {
    throw new Error("Failed to fetch data from Firestore: " + error.message);
  }
}

const Login = async () => {
  try {
    const apiData = await getData();
    return (
      <>
        <h2>Login</h2>
        <div>
          {JSON.stringify(apiData)}
        </div>
      </>
    );
  } catch (error:any) {
    console.error(error); 
    return (
      <>
        <h2>Login</h2>
        <div>Error fetching data: {error.message}</div>
      </>
    );
  }
}

export default Login;

  
  
  
  
  
  
  


