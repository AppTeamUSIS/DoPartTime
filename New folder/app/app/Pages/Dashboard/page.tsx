import Link from "next/link";
// import { useRouter } from "next/navigation";


export default function details({params}:any){

  // const router:any = useRouter();
  // const { id } = router.query;

  return <div>
      <h1>details: {params.slug}</h1>
      {/* <p>Details for ID: {id}</p> */}
  </div>
}


