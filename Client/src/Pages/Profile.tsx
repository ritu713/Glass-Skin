import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from '../apiClient'
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data , error } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser)
  console.log(data,error)
  
  const user = data?.user
  

  const mutation = useMutation(apiClient.logout, {
    onSuccess : async () => {
      await queryClient.invalidateQueries("validateToken")
      alert("Signed out")
      navigate("/")
    },
    onError : (err : Error) => {
      alert("Error during signout")
    }
  })

  const logout = () => {
    const confirm = window.confirm("Are you sure you want to sign out?")
    if(!confirm){
      return
    }
    mutation.mutate()
  }
  
  return (
    <div className="mx-[10rem] my-[2rem]">
      <div className="my-[2rem]">
        <h3 className="text-5xl text-stone-700 font-bold mb-10">My profile</h3>
        <div>
        <span className="font-bold text-2xl text-stone-500">Name</span>
        <span className="text-2xl text-indigo-800 px-5 py-2 rounded ml-5">{user?.profile.fName} {user?.profile.lName}</span>
        </div>

        <div>
        <span className="font-bold text-2xl text-stone-500">Skin type</span>
        <span className="text-2xl text-indigo-800 px-5 py-2 rounded ml-5">{user?.profile.skinType.slice(0,1).toUpperCase()}{user?.profile.skinType.slice(1)}</span>
        </div>

        <div>
        <span className="font-bold text-2xl text-stone-500">Skin concerns</span>
        <span className="text-2xl text-indigo-800 px-5 py-2 rounded ml-5">{user?.profile.skinConcerns.join(", ")}</span>
        </div>

        <div>
        <span className="font-bold text-2xl text-stone-500">Email</span>
        <span className="text-2xl text-indigo-800 px-5 py-2 rounded ml-5">{user?.emailID}</span>
        </div>

        <div>
        <span className="font-bold text-2xl text-stone-500">User since</span>
        <span className="text-2xl text-indigo-800 px-5 py-2 rounded ml-5">{new Date(user?.createdAt).toDateString()}</span>
        </div>
        
        
      </div>
      <button className="text-white bg-red-600 rounded px-5 py-2 font-bold text-xl hover:text-red-600 hover:bg-white shadow duration-150" onClick={logout}>Logout</button>
    </div>
  )
}

export default Profile
