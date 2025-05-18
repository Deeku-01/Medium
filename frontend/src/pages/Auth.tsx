import type { SignupInput } from "@ukeed/medium-common"
import { useState, type ChangeEvent} from "react"
import {Link , useNavigate} from "react-router-dom"
import axios  from "axios"
import { Backend_Blogpost } from "../config"

export const Auth=({type}:{type:"signup"|"signin"})=>{
    const navigate=useNavigate();

    const [PostInputs,setPostInputs] =useState<SignupInput>({
        email:"",
        username:"",
        password:""
    })

    async function SendReq(){
        try{
            const response= await axios.post(`${Backend_Blogpost}/api/v1/user/${type=="signin"?"signin":"signup"}`,PostInputs);
            const jwt =response.data;
            localStorage.setItem("Authorization",jwt);
            navigate("/Blogs")
        }catch(e){
            // Alert the user
            alert("Error While Signing Up ") 
            console.log(e);
        }
       
    }

    return<div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">   
            <div>
                <div className="text-3xl font-extrabold">
                    Create an account 
                </div>
                <div className="text-slate-400">
                    {type=="signup"? "Already have an Account?":"Don't Have an Account?" }
                    <Link className="pl-2 underline" to={type=="signin"?"/Signup":"/Signin"}>{type=="signin"?"Create":"Login"}</Link>
                </div>
                <div className="space-y-2 mt-5">
                    <div>
                        <LabeledInput label="Email" placeholder="Enter your Email" onChange={(e)=>{
                            setPostInputs(c=>({
                                ...c,
                                email:e.target.value
                            }))
                        }}/>
                    </div>
                    
                    <div>
                        {type=="signup"?<LabeledInput label="Username" placeholder="Username" onChange={(e)=>{
                            setPostInputs(c=>({
                                ...c,
                                username:e.target.value
                            }))
                        }}/>:null}
                        
                    </div>
                    <div>
                        <LabeledInput label="Password" placeholder="Password" type="password" onChange={(e)=>{
                            setPostInputs(c=>({
                                ...c,
                                password:e.target.value
                            }))
                        }}/>
                    </div>
                     <button onClick={()=>SendReq()} className=" mt-2 bg-slate-200 hover:bg-gray-100 text-gray-800 font-semibold py-1.5 px-5 border border-gray-400 rounded shadow">{type=="signin"?"Sign IN":"Sign Up"}</button>
                </div>
            </div>
        </div>
    </div>
}

interface Labelinputtype{
    label:string,
    placeholder:string,
    onChange:(e:ChangeEvent<HTMLInputElement>)=> void
    type?:string | "text"
}
function LabeledInput({label,placeholder,onChange,type}:Labelinputtype){
    return <div>
        <div className="relative mb-5">
            <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">{label}</label>
                <input onChange={onChange} type={type} id={placeholder} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
            </div>
        </div>
    </div>

}