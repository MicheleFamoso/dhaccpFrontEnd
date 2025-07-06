import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  HomeIcon,
  UserIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  XCircleIcon,
  BugAntIcon,
  TruckIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div
      className={` h-9/10 my-5 bg-stone-100/70 ml-5 backdrop-blur-[3px] rounded-4xl shadow-xl  border-1 border-stone-200  ${
        isExpanded ? "w-60" : "w-18"
      } p-3 flex flex-col`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-10 ml-1   self-baseline border-1 rounded-full  bg-stone-100/90 shadow-md backdrop-blur-sm  border-stone-200 hover:bg-stone-200"
      >
        {isExpanded ? (
          <>
            {" "}
            <ChevronLeftIcon className="h-5 w-5 m-1 text-stone-500" />
          </>
        ) : (
          <ChevronRightIcon className="h-5 w-5 m-1 text-stone-500" />
        )}
      </button>
      <div
        onClick={() => navigate("/Profilo")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/Profilo" ? "bg-stone-200/60" : ""
        }`}
      >
        <UserIcon
          className={`h-8 w-8 p-1  backdrop-blur-sm   ${
            location.pathname === "/Profilo"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className={`text-sm `}>Profilo</span>}
      </div>
      <hr className="my-3 border-t border-stone-300" />
      <div
        onClick={() => navigate("/HomePage")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/HomePage" ? "bg-stone-200/60" : ""
        }`}
      >
        <HomeIcon
          className={`h-6 w-6    backdrop-blur-sm ${
            location.pathname === "/HomePage"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Dashboard</span>}
      </div>
      <hr className="my-3 border-t border-stone-300" />
      <div
        onClick={() => navigate("/temperatura")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/temperatura" ? "bg-stone-200/60" : ""
        }`}
      >
        <ClipboardDocumentListIcon
          className={`h-6 w-6    backdrop-blur-sm ${
            location.pathname === "/temperatura"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Controllo Temperatura</span>}
      </div>
      <div
        onClick={() => navigate("/pulizie")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/pulizie" ? "bg-stone-200/60" : ""
        }`}
      >
        <SparklesIcon
          className={`h-6 w-6    backdrop-blur-sm  ${
            location.pathname === "/pulizie"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Pianificazione Pulizie</span>}
      </div>
      <div
        onClick={() => navigate("/infestanti")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/infestanti" ? "bg-stone-200/60" : ""
        }`}
      >
        <BugAntIcon
          className={`h-6 w-6    backdrop-blur-sm  ${
            location.pathname === "/infestanti"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Controllo Infestanti</span>}
      </div>
      <hr className="my-3 border-t border-stone-300" />

      <div
        onClick={() => navigate("/fornitori")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 mt-2 ${
          location.pathname === "/fornitori" ? "bg-stone-200/60" : ""
        }`}
      >
        <TruckIcon
          className={`h-6 w-6    backdrop-blur-sm  ${
            location.pathname === "/fornitori"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Fornitori</span>}
      </div>
      <div
        onClick={() => navigate("/forniture")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/forniture" ? "bg-stone-200/60" : ""
        }`}
      >
        <ArchiveBoxIcon
          className={`h-6 w-6    backdrop-blur-sm  ${
            location.pathname === "/forniture"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Forniture</span>}
      </div>
      <hr className="my-3 border-t border-stone-300" />
      <div
        onClick={() => navigate("/utenti")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 mt-2 ${
          location.pathname === "/utenti" ? "bg-stone-200/60" : ""
        }`}
      >
        <UsersIcon
          className={`h-6 w-6    backdrop-blur-sm  ${
            location.pathname === "/utenti" ? "text-blue-600" : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Utenti</span>}
      </div>
      <div
        onClick={() => navigate("/azienda")}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/azienda" ? "bg-stone-200/60" : ""
        }`}
      >
        <BuildingStorefrontIcon
          className={`h-6 w-6    backdrop-blur-sm  ${
            location.pathname === "/azienda"
              ? "text-blue-600"
              : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Azienda</span>}
      </div>
      <hr className="my-3 border-t border-stone-300" />
      <div
        onClick={() => {
          navigate("/")
          localStorage.removeItem("token")
        }}
        className={`flex items-center gap-3 p-2 rounded-4xl cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/" ? "bg-stone-200/60" : ""
        }`}
      >
        <XCircleIcon
          className={`h-6 w-6    backdrop-blur-sm  ${
            location.pathname === "/" ? "text-blue-600" : "text-stone-500"
          }`}
        />
        {isExpanded && <span className="text-sm">Log Out</span>}
      </div>
    </div>
  )
}

export default SideBar
