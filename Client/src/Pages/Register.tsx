import {useForm} from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import {RegisterFormData} from '../../../Server/shared/types'
import * as apiClient from '../apiClient' ;
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const {register, watch,  handleSubmit, formState: {errors}} = useForm<RegisterFormData>();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    //use to call api
    const mutation = useMutation(apiClient.createNewUser, {
        onSuccess : async () => {
            await queryClient.invalidateQueries("validateToken")
            navigate('/');
        },
        onError : (err : Error) => console.log("Oops... looks like something went wrong! " )
    });

    const onSubmit = handleSubmit((form_data) => mutation.mutate(form_data))

    const concerns = [
        'Acne',
        'Blackheads',
        'Dark circles',
        'Dull',
        'Fine lines',
        'Pigmentation',
        'Pores',
        'Redness',
        'Dryness',
        'Sensitivity',
        'Whiteheads',
        'Wrinkles'
      ];

  return (
    <form className="flex flex-col items-center" onSubmit={onSubmit} >
            <h2 className='text-stone-500 text-4xl font-semibold my-10'>Create an account</h2>
                <div className='w-[50vw] space-y-5 bg-violet-100 p-10 rounded-xl'>
                    <label className='font-semibold flex-1'>
                        Email 
                        <input type='text' 
                        className='rounded border border-2 w-full mb-3'
                        {...register("emailID", {required : "Please enter a valid email"})}></input>
                        {errors.emailID &&
                             <p className="text-red-500 font-normal text-sm">{errors.emailID.message}</p>
                        }
                    </label>
                    <label className='font-semibold flex-1'>
                        Password 
                        <input type='password' 
                        className='rounded border border-2 w-full mb-3'
                        {...register("password", {required : "Please enter a password", minLength: 8})}></input>
                        {errors.password &&
                             <p className="text-red-500 font-normal text-sm">{errors.password.message}</p>
                        }
                    </label>
                    <label className='font-semibold flex-1'>
                        Confirm Password 
                        <input type='text' 
                        className='rounded border border-2 w-full mb-3'
                        {...register("confirmPassword", {validate: (val) => {
                            if(!val){
                                return "Please re-enter your password"
                            }
                            if(watch("password") != val){
                                return "Password does not match!"
                            }
                        }})}></input>

                        {errors.confirmPassword &&
                             <p className="text-red-500 font-normal text-sm">{errors.confirmPassword.message}</p>
                        }
                    </label>

                    <label className='font-semibold flex-1'>
                        First Name 
                        <input type='text' 
                        className='rounded border border-2 w-full mb-3'
                        {...register("fName", {required : "Please enter your first name"})}></input>
                        {errors.fName &&
                             <p className="text-red-500 font-normal text-sm">{errors.fName.message}</p>
                        }
                    </label>
                    <label className='font-semibold flex-1'>
                        Last Name 
                        <input type='text' 
                        className='rounded border border-2 w-full mb-3'
                        {...register("lName", {required : "Please enter your last name"})}></input>
                        {errors.lName &&
                             <p className="text-red-500 font-normal text-sm">{errors.lName.message}</p>
                        }
                    </label>
                    <label className='font-semibold flex-1'>
                        Skin type
                        <select {...register("skinType", {required : "Please select your skin type"})} className=' mb-3 rounded border border-2  w-full py-1'>
                            <option value="" disabled>Select...</option>
                            <option value="normal">Normal</option>
                            <option value="dry">Dry</option>
                            <option value="oily">Oily</option>
                            <option value="combination">Combination</option>
                            <option value="sensitive">Sensitive</option>
                        </select>
                    </label>
                    
                    <b>Skin Concern</b> 
                    <br/>
                    <div className='grid grid-cols-4 space-y-4'>
                    {
                        concerns.map(concern => {
                            return (
                                <label className="cursor-pointer">
                                    <input className='peer hidden' type='checkbox' {...register("skinConcerns")} value={concern}/>
                                    <span className='peer-checked:bg-violet-400 bg-gray-300 p-2 rounded-sm font-semibold'>{concern}</span>
                                </label>)
                        })
                    }
                    </div>
                    <button type='submit' 
                    className='w-full rounded bg-violet-500 text-white font-bold px-5 py-2 hover:text-violet-500 hover:bg-white duration-150'>Submit</button>
                </div>
                <div></div>
    </form>
    
  )
}

export default Register
