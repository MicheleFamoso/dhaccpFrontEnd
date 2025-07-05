//import { div } from "framer-motion/client"
import { useNavigate } from "react-router-dom"
const Home = () => {
  const navigate = useNavigate()
  return (
    <div className=" bg-[url('/4802922.webp')] min-h-screen bg-cover bg-center">
      <div className="ml-10 flex flex-col  ">
        <h1 className="font-[Unna] text-[250px] mt-10 ">d/haccp</h1>
        <p className="text-5xl font-[Unna] ml-15 -mt-20">
          Digital HACCP Management
        </p>
      </div>
      <div className="flex ml-10 justify-center w-180 mt-10">
        <button className="w-25 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-stone-200/50 border-1 border-stone-200 hover:border-stone-300 mr-5">
          Registrati
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-25 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-stone-200/50 border-1 border-stone-200 hover:border-stone-300 ml-5"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Home
