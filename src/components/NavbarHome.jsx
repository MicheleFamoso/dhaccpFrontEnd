import { useState } from "react"

import {
  BuildingStorefrontIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  BugAntIcon,
  UserCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid"

const NavbarHome = () => {
  const [activePanel, setActivePanel] = useState(null)
  return (
    <>
      <div className=" flex md:justify-end justify-center  ">
        <div className=" md:mr-20 md:mt-2 mt-4  bg-salviaChiaro border-1 border-salvia rounded-3xl ">
          <button
            onClick={() =>
              setActivePanel(activePanel === "features" ? null : "features")
            }
            className={`px-7 py-3 rounded-4xl  text-gray-900 ${
              activePanel === "features" ? "bg-salvia" : "hover:bg-salvia/50"
            }`}
          >
            Funzionalità
          </button>
          <button
            onClick={() => setActivePanel(activePanel === "noi" ? null : "noi")}
            className={`px-8 py-3 rounded-4xl  text-gray-900 ${
              activePanel === "noi" ? "bg-salvia" : "hover:bg-salvia/50"
            }`}
          >
            Chi siamo
          </button>
          <button
            onClick={() =>
              setActivePanel(activePanel === "contact" ? null : "contact")
            }
            className={`px-7 py-3 rounded-4xl  text-gray-900 ${
              activePanel === "contact" ? "bg-salvia" : "hover:bg-salvia/50"
            }`}
          >
            Contatti
          </button>
        </div>
      </div>
      {activePanel === "features" && (
        <div className="absolute md:right-20 md:top-16 mt-2 right-2 z-50 ">
          <div className="bg-avorio  rounded-3xl shadow-md shadow-salvia border-1 border-salvia w-100 p-6">
            <p className="m2-3 flex items-center gap-2">
              <BuildingStorefrontIcon className="h-5 w-5 text-amber-600" />
              Registrare e gestire più ristoranti
            </p>
            <p className="mt-3 flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-yellow-500 " />
              Tenere traccia delle operazioni di pulizia
            </p>
            <p className="mt-3 flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
              Monitorare temperature giornaliere
            </p>
            <p className="mt-3 flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5 text-green-600" />
              Gestire fornitori e forniture
            </p>
            <p className="mt-3 flex items-center gap-2">
              <BugAntIcon className="h-5 w-5 text-red-500" />
              Controllare infestanti e scadenze
            </p>
          </div>
        </div>
      )}
      {activePanel === "noi" && (
        <div className="absolute md:right-28 md:top-16 mt-2 right-12 z-10  ">
          <div className="bg-avorio  rounded-3xl shadow-md shadow-salvia border-1 border-salvia w-80 p-6">
            <p className=" text-wrap">
              <span className="font-[Unna] font-bold text-xl ">d/HACCP</span> è
              una piattaforma digitale pensata per semplificare la gestione
              dell’HACCP per ristoratori e aziende alimentari. Il nostro
              obiettivo è digitalizzare i controlli per migliorare l’efficienza
              e la conformità.
            </p>
          </div>
        </div>
      )}
      {activePanel === "contact" && (
        <div className="absolute md:right-22 md:top-16 mt-2 right-2 z-10 ">
          <div className="bg-avorio  rounded-3xl shadow-md shadow-salvia border-1 border-salvia w-70 px-6 py-3">
            <p className="mt-1 flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-blue-600" />
              Michele Famoso
            </p>
            <p className="mt-3 flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-red-500" />
              michelefamoso@gmail.com
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default NavbarHome
