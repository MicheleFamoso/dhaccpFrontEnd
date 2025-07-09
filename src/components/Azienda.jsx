import SideBar from "./SideBar"
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/solid"

import { useState, useEffect } from "react"
const Azienda = () => {
  const [azienda, setAzienda] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [denominazioneAziendale, setDenominazioneAziendale] = useState("")
  const [ragioneSociale, setRagioneSociale] = useState("")
  const [tipologiaAttivita, setTipologiaAttivita] = useState("")
  const [sedeOperativa, setSedeOperativa] = useState("")
  const [partitaIva, setPartitaIva] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")

  const getAziende = () => {
    const token = localStorage.getItem("token")
    console.log("Token:", token)
    if (!token) {
      console.warn("Nessun token trovato, fetch annullata.")
      setError("Nessun token trovato, impossibile caricare le aziende.")
      return
    }
    setLoading(true)
    setError(null)

    fetch("http://localhost:8080/aziende/mia", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Errore nella risposta: ${res.statusText}`)
        return res.text()
      })
      .then((text) => {
        if (!text) {
          setAzienda(null)
          setLoading(false)
          return
        }
        const data = JSON.parse(text)
        console.log("Azienda ricevuta:", data)
        setAzienda(data)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Errore nella fetch aziende:", error)
        setError("Errore nel caricamento delle aziende.")
        setLoading(false)
      })
  }
  useEffect(() => {
    getAziende()
  }, [])

  const creaAzienda = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Token mancante, impossibile creare l'azienda.")
      return
    }

    fetch("http://localhost:8080/aziende", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        denominazioneAziendale,
        ragioneSociale,
        tipologiaAttivita,
        sedeOperativa,
        partitaIva,
        telefono,
        email,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella creazione dell'azienda.")
        return res.json()
      })
      .then(() => {
        setShowForm(false)
        getAziende()
      })
      .catch((err) => {
        console.error(err)
        setError("Errore durante la creazione dell'azienda.")
      })
  }

  const modificaAzienda = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Token mancante, impossibile modificare l'azienda.")
      return
    }

    fetch(`http://localhost:8080/aziende/${azienda.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        denominazioneAziendale,
        ragioneSociale,
        tipologiaAttivita,
        sedeOperativa,
        partitaIva,
        telefono,
        email,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella modifica dell'azienda.")
        return res.json()
      })
      .then(() => {
        setShowForm(false)
        getAziende()
      })
      .catch((err) => {
        console.error(err)
        setError("Errore durante la modifica dell'azienda.")
      })
  }

  return (
    <div>
      <div className="flex h-screen   bg-gray-100   ">
        <div>
          <SideBar />
        </div>
        <div className="flex-1 mt-10 justify-items-center justify-center   p-6">
          <div className="     flex     ">
            {loading && (
              <p className="text-xl text-center w-full py-10">
                Caricamento in corso...
              </p>
            )}
            {error && (
              <p className="text-xl text-center w-full py-10 text-red-600">
                {error}
              </p>
            )}
            {!loading && !error && !azienda && !showForm && (
              <div className="flex flex-col items-center text-center w-200 py-10 gap-4 bg-neutral-50 border-1 border-neutral-300 shadow-xl">
                <p className="text-xl text-center  py-10">
                  Nessuna azienda disponibile.
                </p>
                <button
                  className=" w-50 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-sm hover:bg-green-400/60 border-1 border-stone-200 hover:border-green-300 hover:shadow-2xl hover:shadow-green-400/50"
                  onClick={() => setShowForm(true)}
                >
                  Aggiunti azienda
                </button>
              </div>
            )}
            {!loading && !error && showForm && (
              <div className="w-200 p-6 bg-neutral-50 border-1 border-neutral-300 shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Crea azienda
                </h2>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (azienda) {
                      modificaAzienda()
                    } else {
                      creaAzienda()
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Denominazione Aziendale"
                    value={denominazioneAziendale}
                    onChange={(e) => setDenominazioneAziendale(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-blue-800  focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ragione Sociale"
                    value={ragioneSociale}
                    onChange={(e) => setRagioneSociale(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-blue-800 focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tipologia Attività"
                    value={tipologiaAttivita}
                    onChange={(e) => setTipologiaAttivita(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-blue-800 focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sede Operativa"
                    value={sedeOperativa}
                    onChange={(e) => setSedeOperativa(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-blue-800 focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Partita IVA"
                    value={partitaIva}
                    onChange={(e) => setPartitaIva(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-blue-800 focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-blue-800 focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-blue-800 focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <button
                    type="submit"
                    className="w-50 self-center  bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-sm hover:bg-green-400/60 border-1 border-stone-200 hover:border-green-300 hover:shadow-2xl hover:shadow-green-400/50"
                  >
                    Salva azienda
                  </button>
                </form>
              </div>
            )}
            {!loading && !error && !showForm && azienda && (
              <div
                key={azienda.id}
                className="flex justify-center items-center h-[calc(100vh-100px)] w-full"
              >
                <div
                  className="relative w-[350px] h-[200px] perspective cursor-pointer  "
                  onClick={() => setFlipped(!flipped)}
                >
                  <div
                    className={`relative w-full h-full duration-700 transform-style preserve-3d transition-transform ${
                      flipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Fronte */}
                    <div className="absolute w-full h-full scale-150 backface-hidden transform rotate-y-0 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-sm shadow-xl flex flex-col items-center justify-center   ">
                      <p className="text-5xl font-bold text-neutral-700 font-[Unna] text-shadow-1 ">
                        {azienda.denominazioneAziendale}
                      </p>
                      <p className="text-md font-light font-[Unna] text-neutral-600 text-shadow-1">
                        {azienda.tipologiaAttivita}
                      </p>
                    </div>

                    {/* Retro */}
                    <div className="absolute w-full h-full scale-150 backface-hidden transform rotate-y-180 bg-gradient-to-br from-neutral-300 to-neutral-400 rounded-sm shadow-lg flex flex-col justify-center    ">
                      <div className="flex items-center ml-5 mb-3 gap-2">
                        <MapPinIcon className="h-4 w-4 text-red-400" />
                        <p className="text-neutral-700 text-shadow-1 text-xs">
                          {azienda.sedeOperativa}
                        </p>
                      </div>
                      <div className="flex items-center ml-5 mb-3 gap-2">
                        <PhoneIcon className="h-4 w-4 text-blue-400" />
                        <p className="text-neutral-700 text-shadow-1 text-xs">
                          {azienda.telefono}
                        </p>
                      </div>
                      <div className="flex items-center ml-5 mb-3 gap-2">
                        <EnvelopeOpenIcon className="h-4 w-4 text-teal-400" />
                        <p className="text-neutral-700 text-shadow-1 text-xs">
                          {azienda.email}
                        </p>
                      </div>

                      <p className="text-neutral-700 text-shadow-1 ml-5 text-xs mb-3  ">
                        Partita iva: {azienda.partitaIva}
                      </p>
                      <p className="text-neutral-700 text-shadow-1 ml-5 text-xs mb-3  ">
                        Ragione sociale: {azienda.ragioneSociale}
                      </p>
                      <button
                        className="mt-2 self-end me-4 w-32 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-1 rounded-sm hover:bg-blue-400/60 border border-stone-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-400/50 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDenominazioneAziendale(
                            azienda.denominazioneAziendale
                          )
                          setRagioneSociale(azienda.ragioneSociale)
                          setTipologiaAttivita(azienda.tipologiaAttivita)
                          setSedeOperativa(azienda.sedeOperativa)
                          setPartitaIva(azienda.partitaIva)
                          setTelefono(azienda.telefono)
                          setEmail(azienda.email)
                          setShowForm(true)
                        }}
                      >
                        Modifica azienda
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Azienda
