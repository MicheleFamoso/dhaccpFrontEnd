import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid"
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { jwtDecode } from "jwt-decode"
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
  Bars3BottomRightIcon,
} from "@heroicons/react/24/outline"

const SidebMobile = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem("token")
  const ruolo = token ? jwtDecode(token).role : null

  return (
    <>
      <div className="md:hidden fixed top-3 left-3 z-90">
        <button onClick={() => setIsOpen(!isOpen)} className="">
          <Bars3BottomLeftIcon className="h-6 w-6 text-salviaScuro" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-700/30 h-dvh z-80"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 h-dvh w-80 z-90 bg-salviaScuro  text-white p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="mb-4  w-full text-salviaChiaro "
            >
              <Bars3BottomLeftIcon className="h-6 w-6 text-salvia" />
            </button>
            <nav className="space-y-4">
              <div
                onClick={() => navigate("/Profilo")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro  ${
                  location.pathname === "/Profilo" ? "bg-ambra" : ""
                }`}
              >
                <UserIcon
                  className={`h-6 w-6   text-slate-800 transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/Profilo" ? " scale-110" : ""
                  }`}
                />

                <span
                  className={` text-lg text-slate-800${
                    location.pathname === "/Profilo" ? " font-bold " : ""
                  }`}
                >
                  Profilo
                </span>
              </div>
              <hr className="my-3 border-t border-green-950" />
              <div
                onClick={() => navigate("/HomePage")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro ${
                  location.pathname === "/HomePage" ? "bg-ambra" : ""
                }`}
              >
                <HomeIcon
                  className={`h-6 w-6 text-slate-800   backdrop-blur-sm transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/HomePage" ? "scale-110" : ""
                  }`}
                />

                <span
                  className={`lg:text-sm text-lg  text-slate-800${
                    location.pathname === "/HomePage" ? " font-bold" : ""
                  }`}
                >
                  Dashboard
                </span>
              </div>
              <hr className="my-3 border-t border-salviaScuro" />
              <div
                onClick={() => navigate("/temperatura")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro ${
                  location.pathname === "/temperatura" ? "bg-ambra" : ""
                }`}
              >
                <ClipboardDocumentListIcon
                  className={`h-6 w-6  text-slate-800  backdrop-blur-sm transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/temperatura" ? "scale-110" : ""
                  }`}
                />

                <span
                  className={`lg:text-sm text-lg  text-slate-800 ${
                    location.pathname === "/temperatura" ? " font-bold" : ""
                  }`}
                >
                  Controllo Temperatura
                </span>
              </div>
              <div
                onClick={() => navigate("/pulizie")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro ${
                  location.pathname === "/pulizie" ? "bg-ambra" : ""
                }`}
              >
                <SparklesIcon
                  className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/pulizie" ? " scale-110" : ""
                  }`}
                />

                <span
                  className={`lg:text-sm text-lg   text-slate-800${
                    location.pathname === "/pulizie" ? " font-bold" : ""
                  }`}
                >
                  Pianificazione Pulizie
                </span>
              </div>
              <div
                onClick={() => navigate("/infestanti")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro ${
                  location.pathname === "/infestanti" ? "bg-ambra" : ""
                }`}
              >
                <BugAntIcon
                  className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/infestanti" ? " scale-110" : ""
                  }`}
                />

                <span
                  className={`lg:text-sm text-lg  text-slate-800 ${
                    location.pathname === "/infestanti" ? " font-bold" : ""
                  }`}
                >
                  Controllo Infestanti
                </span>
              </div>
              <hr className="my-3 border-t border-salviaScuro" />

              <div
                onClick={() => navigate("/fornitori")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro mt-2 ${
                  location.pathname === "/fornitori" ? "bg-ambra" : ""
                }`}
              >
                <TruckIcon
                  className={`h-6 w-6  text-slate-800  backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/fornitori" ? " scale-110" : ""
                  }`}
                />

                <span
                  className={`lg:text-sm text-lg  text-slate-800 ${
                    location.pathname === "/fornitori" ? " font-bold" : ""
                  }`}
                >
                  Fornitori
                </span>
              </div>
              <div
                onClick={() => navigate("/forniture")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro ${
                  location.pathname === "/forniture" ? "bg-ambra" : ""
                }`}
              >
                <ArchiveBoxIcon
                  className={`h-6 w-6 text-slate-800    backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/forniture" ? "scale-110" : ""
                  }`}
                />

                <span
                  className={`lg:text-sm text-lg  text-slate-800 ${
                    location.pathname === "/forniture" ? "font-bold" : ""
                  }`}
                >
                  Forniture
                </span>
              </div>
              <hr className="my-3 border-t border-salviaScuro" />
              {ruolo === "ADMIN" && (
                <div
                  onClick={() => navigate("/utenti")}
                  className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro mt-2 ${
                    location.pathname === "/utenti" ? "bg-ambra" : ""
                  }`}
                >
                  <UsersIcon
                    className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                      location.pathname === "/utenti" ? " scale-110" : ""
                    }`}
                  />

                  <span
                    className={`lg:text-sm text-lg  text-slate-800 ${
                      location.pathname === "/utenti" ? "font-bold" : ""
                    }`}
                  >
                    Dipendenti
                  </span>
                </div>
              )}
              <div
                onClick={() => navigate("/azienda")}
                className={`flex items-center gap-3 p-2 rounded-3xl cursor-pointer hover:bg-salviaScuro ${
                  location.pathname === "/azienda" ? "bg-ambra" : ""
                }`}
              >
                <BuildingStorefrontIcon
                  className={`h-6 w-6 text-slate-800   backdrop-blur-sm  transform transition-transform duration-200 ease-in-out hover:scale-125 ${
                    location.pathname === "/azienda" ? "scale-110 h-7 w-7" : ""
                  }`}
                />

                <span
                  className={`lg:text-sm text-lg   text-slate-800${
                    location.pathname === "/azienda" ? "font-bold" : ""
                  }`}
                >
                  Azienda
                </span>
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

                <span
                  className={`lg:text-sm text-lg  text-slate-800 ${
                    location.pathname === "/" ? " font-bold" : ""
                  }`}
                >
                  Log Out
                </span>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}

export default SidebMobile
