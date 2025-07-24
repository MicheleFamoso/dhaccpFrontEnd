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
  const [isExpanded, setIsExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem("token")
  const ruolo = token ? jwtDecode(token).role : null

  return (
    <div
      className={`  hidden md:flex bg-salviaScuro h-dvh  bg-gradient-to-r from-salvia/20 via-transparent to-salviaScuro   ${
        isExpanded ? "w-70" : "w-16 "
      } p-3 flex flex-col `}
    >
      <div className=""></div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-10 ml-1   self-baseline"
      >
        {isExpanded ? (
          <>
            <Bars3BottomLeftIcon className="lg:h-8 lg:w-8 w-10 h-10 m-1 text-salvia  transform transition-transform duration-200 ease-in-out   hover:text-ambra hover:scale-120" />
          </>
        ) : (
          <Bars3BottomRightIcon className="lg:h-8 lg:w-8 w-10 h-10 m-1 text-salvia transform transition-transform duration-200 ease-in-out hover:scale-120 hover:text-ambra" />
        )}
      </button>
      <div
        onClick={() => navigate("/Profilo")}
        className={`flex items-center gap-3 p-2 mb-5 rounded-3xl cursor-pointer hover:bg-salvia  ${
          location.pathname === "/Profilo" ? "bg-ambra" : ""
        }`}
      >
        <UserIcon
          className={`h-6 w-6   text-slate-800 transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/Profilo" ? " scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={` text-lg text-slate-800 ${
              location.pathname === "/Profilo" ? " font-bold " : ""
            }`}
          >
            Profilo
          </span>
        )}
      </div>

      <div
        onClick={() => navigate("/HomePage")}
        className={`flex items-center gap-3 p-2 mb-6 rounded-3xl cursor-pointer hover:bg-salvia ${
          location.pathname === "/HomePage" ? "bg-ambra" : ""
        }`}
      >
        <HomeIcon
          className={`h-6 w-6 text-slate-800   backdrop-blur-sm transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/HomePage" ? "scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg  text-slate-800${
              location.pathname === "/HomePage" ? " font-bold" : ""
            }`}
          >
            Dashboard
          </span>
        )}
      </div>

      <div
        onClick={() => navigate("/temperatura")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salvia mb-1 ${
          location.pathname === "/temperatura" ? "bg-ambra" : ""
        }`}
      >
        <ClipboardDocumentListIcon
          className={`h-6 w-6  text-slate-800  backdrop-blur-sm transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/temperatura" ? "scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg  text-slate-800 ${
              location.pathname === "/temperatura" ? " font-bold" : ""
            }`}
          >
            Controllo Temperatura
          </span>
        )}
      </div>
      <div
        onClick={() => navigate("/pulizie")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salvia mb-1 ${
          location.pathname === "/pulizie" ? "bg-ambra" : ""
        }`}
      >
        <SparklesIcon
          className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/pulizie" ? " scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg   text-slate-800${
              location.pathname === "/pulizie" ? " font-bold" : ""
            }`}
          >
            Pianificazione Pulizie
          </span>
        )}
      </div>
      <div
        onClick={() => navigate("/infestanti")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salvia mb-6 ${
          location.pathname === "/infestanti" ? "bg-ambra" : ""
        }`}
      >
        <BugAntIcon
          className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/infestanti" ? " scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg  text-slate-800 ${
              location.pathname === "/infestanti" ? " font-bold" : ""
            }`}
          >
            Controllo Infestanti
          </span>
        )}
      </div>

      <div
        onClick={() => navigate("/fornitori")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salvia mt-2  mb-1  ${
          location.pathname === "/fornitori" ? "bg-ambra" : ""
        }`}
      >
        <TruckIcon
          className={`h-6 w-6  text-slate-800  backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/fornitori" ? " scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg  text-slate-800 ${
              location.pathname === "/fornitori" ? " font-bold" : ""
            }`}
          >
            Fornitori
          </span>
        )}
      </div>
      <div
        onClick={() => navigate("/forniture")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salvia mb-6 ${
          location.pathname === "/forniture" ? "bg-ambra" : ""
        }`}
      >
        <ArchiveBoxIcon
          className={`h-6 w-6 text-slate-800    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/forniture" ? "scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg  text-slate-800 ${
              location.pathname === "/forniture" ? "font-bold" : ""
            }`}
          >
            Forniture
          </span>
        )}
      </div>

      {ruolo === "ADMIN" && (
        <div
          onClick={() => navigate("/utenti")}
          className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salvia mt-2  mb-1 ${
            location.pathname === "/utenti" ? "bg-ambra" : ""
          }`}
        >
          <UsersIcon
            className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
              location.pathname === "/utenti" ? " scale-110" : ""
            }`}
          />
          {isExpanded && (
            <span
              className={`lg:text-sm text-lg  text-slate-800 ${
                location.pathname === "/utenti" ? "font-bold" : ""
              }`}
            >
              Dipendenti
            </span>
          )}
        </div>
      )}
      <div
        onClick={() => navigate("/azienda")}
        className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salvia mb-1  ${
          location.pathname === "/azienda" ? "bg-ambra" : ""
        }`}
      >
        <BuildingStorefrontIcon
          className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/azienda" ? "scale-110 h-7 w-7" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg   text-slate-800${
              location.pathname === "/azienda" ? "font-bold" : ""
            }`}
          >
            Azienda
          </span>
        )}
      </div>
      <hr className="my-3 border-t border-salviaScuro" />
      <div
        onClick={() => {
          navigate("/")
          localStorage.removeItem("token")
          localStorage.removeItem("ruolo")
        }}
        className={`flex items-center  gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro ${
          location.pathname === "/" ? "bg-ambra" : ""
        }`}
      >
        <XCircleIcon
          className={`h-6 w-6  text-slate-800  backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
            location.pathname === "/" ? " scale-110" : ""
          }`}
        />
        {isExpanded && (
          <span
            className={`lg:text-sm text-lg  text-slate-800 ${
              location.pathname === "/" ? " font-bold" : ""
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
