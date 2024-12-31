import { useForm } from 'react-hook-form'
import { useAppContext } from '../AppContext'
import { AnalyserData } from '../../../Server/shared/types'
import { useMutation } from 'react-query'
import * as apiClient from '../apiClient'
import ProductDisplay from '../components/ProductDisplay'
import { useState, useRef } from 'react'


const Analyse = () => {
    const [results, setResults] = useState([])
    const { isLoggedIn } = useAppContext()
    const resRef = useRef<HTMLDivElement>(null)
    const concerns = [
      'eye bags',
      'blackheads and whiteheads',
      'dark spots',
      'pigmentation',
      'tan removal',
      'anti-pollution',
      'excess oil',
      'uneven skin tone',
      'dark circles',
      'deep nourishment',
      'pore care',
      'softening and smoothening',
      'dryness',
      'fine lines and wrinkles',
      'acne or blemishes',
      'hydration',
      'daily use',
      'general care',
      'dull skin',
      'sun protection']

    const {handleSubmit, register} = useForm<AnalyserData>();
    
    const mutation = useMutation(apiClient.recommend, {
      onSuccess(data, variables) {
        let products = JSON.parse(data.message)
        setResults(products[variables.productLabel])
        setTimeout(() => {
          if(resRef.current){
          resRef.current.scrollIntoView({behavior :"smooth"})
          }
        }, 50)
        
      },
      onError(error : any) {
        alert("Something went wrong.")
      }
    })
    const onSubmit = handleSubmit((form_data) => mutation.mutate(form_data))
  return (
    <div id='main_container'>
       {
        isLoggedIn ? <>
          <h2 className='text-5xl text-stone-600 mx-10 my-5'>Welcome to the skin analysis and product recommender!</h2>
          <p className='text-stone-500 text-lg mx-20 mb-10'>Our product recommendation system will ask you the type of product you want, and which skin concerns it should be targetting.
          <br/>Answer the questions below to get the best products for your skin.
          </p>

          <form className='flex flex-col mx-[15rem] gap-5' onSubmit = {onSubmit}>
            <label className='text-xl text-stone-500 flex flex-col'>
              Which type of product are you looking for?
              <select className='text-base' {...register("productLabel")}>
                  <option value="face-moisturisers">Face Moisturizer</option>
                  <option value = "mask-and-peel">Masks and Peels</option>
                  <option value="cleanser">Cleanser</option>
                  <option value="sunscreen">Sunscreen</option>
                  <option value="eye-cream">Eye Cream</option>
              </select>
            </label>

            <label className='text-xl text-stone-500 flex flex-col'>
                        Skin type
                        <select className='text-base' {...register("skinType")}>
                            <option value="" disabled>Select...</option>
                            <option value="normal">Normal</option>
                            <option value="dry">Dry</option>
                            <option value="oily">Oily</option>
                            <option value="combination">Combination</option>
                            <option value="sensitive">Sensitive</option>
                        </select>
              </label>
            
            <h3 className='text-xl text-stone-500'>Which concerns are you troubled with?</h3>
            <div className='grid grid-cols-5 space-y-3'>
            {
                        concerns.map(concern => {
                            return (
                                <label className="cursor-pointer">
                                    <input className='peer hidden' type='checkbox' value={concern} {...register("concerns")}/>
                                    <span className='peer-checked:bg-violet-400 bg-gray-300 p-2 rounded-sm font-semibold'>{concern}</span>
                                </label>)
                        })
                    }
            </div>

            <button type='submit'
            className='rounded bg-violet-500 text-white font-bold px-5 py-2 hover:text-violet-500 hover:bg-white duration-150'>Submit</button>
          </form>

          {
            
            results.length > 0 ?
            <div id="results" ref={resRef}><ProductDisplay prods = {results}/></div>
             : <></>
          }
          
        </>
        : <>
            <div className="flex items-center justify-center h-full">
              <div className="bg-violet-400 rounded p-10 shadow-xl text-3xl text-white my-[10rem]">
                Please login to use this feature!
              </div>
            </div>
        </>
      }
    </div>
  )
}

export default Analyse
