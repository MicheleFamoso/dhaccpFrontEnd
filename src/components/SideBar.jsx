import { useState } from "react"
import { jwtDecode } from "jwt-decode"
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
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
} from "@heroicons/react/24/outline"

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem("token")
  const ruolo = token ? jwtDecode(token).role : null

  return (
    <div
      className={` h-9/10 my-5 bg-neutral-100 ml-5 backdrop-blur-[3px] rounded-3xl  shadow-xl shadow-neutral-300    ${
        isExpanded ? "w-60" : "w-18"
      } p-3 flex flex-col`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-10 ml-1   self-baseline"
      >
        {isExpanded ? (
          <>
            <Bars3BottomLeftIcon className="h-8 w-8 m-1 text-stone-100 transform transition-transform duration-200 ease-in-out   hover:text-lime-300 hover:scale-170" />
          </>
        ) : (
          <Bars3BottomRightIcon className="h-8 w-8 m-1 text-stone-100 transform transition-transform duration-200 ease-in-out hover:scale-170 hover:text-lime-300" />
        )}
      </button>
      <div
        onClick={() => navigate("/Profilo")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-lime-600  ${
          location.pathname === "/Profilo" ? "bg-lime-400" : ""
        }`}
      >
        <UserIcon
          className={`h-8 w-8 p-1   transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/Profilo"
              ? "text-slate-800 scale-110"
              : "text-slate-100"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/Profilo"
                ? "text-slate-800 font-bold"
                : "text-slate-50 hover:text-slate-800"
            }`}
          >
            Profilo
          </span>
        )}
      </div>
      <hr className="my-3 border-t border-slate-600" />
      <div
        onClick={() => navigate("/HomePage")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-lime-600 ${
          location.pathname === "/HomePage" ? "bg-lime-400" : ""
        }`}
      >
        <HomeIcon
          className={`h-6 w-6    backdrop-blur-sm transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/HomePage"
              ? "text-blue-600 scale-110"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/HomePage" ? "text-blue-600 font-bold" : ""
            }`}
          >
            Dashboard
          </span>
        )}
      </div>
      <hr className="my-3 border-t border-stone-300" />
      <div
        onClick={() => navigate("/temperatura")}
        className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/temperatura" ? "bg-stone-200/60" : ""
        }`}
      >
        <ClipboardDocumentListIcon
          className={`h-6 w-6    backdrop-blur-sm transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/temperatura"
              ? "text-blue-600 scale-110"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/temperatura"
                ? "text-blue-600 font-bold"
                : ""
            }`}
          >
            Controllo Temperatura
          </span>
        )}
      </div>
      <div
        onClick={() => navigate("/pulizie")}
        className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/pulizie" ? "bg-stone-200/60" : ""
        }`}
      >
        <SparklesIcon
          className={`h-6 w-6    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/pulizie"
              ? "text-blue-600 scale-110"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/pulizie" ? "text-blue-600 font-bold" : ""
            }`}
          >
            Pianificazione Pulizie
          </span>
        )}
      </div>
      <div
        onClick={() => navigate("/infestanti")}
        className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/infestanti" ? "bg-stone-200/60" : ""
        }`}
      >
        <BugAntIcon
          className={`h-6 w-6    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/infestanti"
              ? "text-blue-600 scale-110"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/infestanti"
                ? "text-blue-600 font-bold"
                : ""
            }`}
          >
            Controllo Infestanti
          </span>
        )}
      </div>
      <hr className="my-3 border-t border-stone-300" />

      <div
        onClick={() => navigate("/fornitori")}
        className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 mt-2 ${
          location.pathname === "/fornitori" ? "bg-stone-200/60" : ""
        }`}
      >
        <TruckIcon
          className={`h-6 w-6    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/fornitori"
              ? "text-blue-600 scale-110"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/fornitori"
                ? "text-blue-600 font-bold"
                : ""
            }`}
          >
            Fornitori
          </span>
        )}
      </div>
      <div
        onClick={() => navigate("/forniture")}
        className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/forniture" ? "bg-stone-200/60" : ""
        }`}
      >
        <ArchiveBoxIcon
          className={`h-6 w-6    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/forniture"
              ? "text-blue-600 scale-110"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/forniture"
                ? "text-blue-600 font-bold"
                : ""
            }`}
          >
            Forniture
          </span>
        )}
      </div>
      <hr className="my-3 border-t border-stone-300" />
      {ruolo === "ADMIN" && (
        <div
          onClick={() => navigate("/utenti")}
          className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 mt-2 ${
            location.pathname === "/utenti" ? "bg-stone-200/60" : ""
          }`}
        >
          <UsersIcon
            className={`h-6 w-6    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
              location.pathname === "/utenti"
                ? "text-blue-600 scale-110"
                : "text-stone-500"
            }`}
          />
          {isExpanded && (
            <span
              className={`text-sm ${
                location.pathname === "/utenti" ? "text-blue-600 font-bold" : ""
              }`}
            >
              Utenti
            </span>
          )}
        </div>
      )}
      <div
        onClick={() => navigate("/azienda")}
        className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/azienda" ? "bg-stone-200/60" : ""
        }`}
      >
        <BuildingStorefrontIcon
          className={`h-6 w-6    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/azienda"
              ? "text-blue-600 scale-110 h-7 w-7"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/azienda" ? "text-blue-600 font-bold" : ""
            }`}
          >
            Azienda
          </span>
        )}
      </div>
      <hr className="my-3 border-t border-stone-300" />
      <div
        onClick={() => {
          navigate("/")
          localStorage.removeItem("token")
          localStorage.removeItem("ruolo")
        }}
        className={`flex items-center gap-3 p-2 rounded-sm cursor-pointer hover:bg-stone-200 ${
          location.pathname === "/" ? "bg-stone-200/60" : ""
        }`}
      >
        <XCircleIcon
          className={`h-6 w-6    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/"
              ? "text-blue-600 scale-110"
              : "text-stone-500"
          }`}
        />
        {isExpanded && (
          <span
            className={`text-sm ${
              location.pathname === "/" ? "text-blue-600 font-bold" : ""
            }`}
          >
            Log Out
          </span>
        )}
      </div>
    </div>
  )
}

export default SideBar
