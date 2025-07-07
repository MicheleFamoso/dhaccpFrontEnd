import SideBar from "./SideBar"
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/solid"

import { useState, useEffect } from "react"
const Azienda = () => {
  const [azienda, setAzienda] = useState([])
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

    fetch("http://localhost:8080/aziende", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Errore nella risposta: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log("Aziende ricevute:", data)
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

    fetch(`http://localhost:8080/aziende/${azienda[0].id}`, {
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
      <div className="flex h-screen   bg-stone-200   ">
        <div>
          <SideBar />
        </div>
        <div className="flex-1 mt-10 justify-items-center justify-center   p-6">
          <div className=" bg-stone-100/70 w-128 backdrop-blur-[3px]  flex   rounded-4xl shadow-xl  border-1 border-stone-200 mr-20 mt-5 ">
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
            {!loading && !error && azienda.length === 0 && !showForm && (
              <div className="flex flex-col items-center text-center w-full py-10 gap-4">
                <p className="text-xl text-center  py-10">
                  Nessuna azienda disponibile.
                </p>
                <button
                  className=" w-60 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-stone-400/60 border-1 border-stone-200 hover:border-stone-300"
                  onClick={() => setShowForm(true)}
                >
                  Aggiunti azienda
                </button>
              </div>
            )}
            {!loading && !error && showForm && (
              <div className="w-full p-6">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Crea azienda
                </h2>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (azienda.length > 0) {
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
                    className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ragione Sociale"
                    value={ragioneSociale}
                    onChange={(e) => setRagioneSociale(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tipologia Attività"
                    value={tipologiaAttivita}
                    onChange={(e) => setTipologiaAttivita(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sede Operativa"
                    value={sedeOperativa}
                    onChange={(e) => setSedeOperativa(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Partita IVA"
                    value={partitaIva}
                    onChange={(e) => setPartitaIva(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-amber-800 focus:outline-hidden"
                    required
                  />
                  <button
                    type="submit"
                    className="w-60 self-center bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 rounded-4xl hover:bg-lime-400/60 border-1 border-stone-200 hover:border-lime-300"
                  >
                    Salva azienda
                  </button>
                </form>
              </div>
            )}
            {!loading &&
              !error &&
              !showForm &&
              azienda.length > 0 &&
              azienda.map((aziende) => {
                return (
                  <div
                    key={aziende.id}
                    className="relative flex flex-col items-center py-10  w-9/12"
                  >
                    <img
                      src="/public/perspective_matte-247-128x128.png"
                      className="absolute -top-18 left-25 -translate-x-1/2 w-30 h-30"
                      alt="img-store"
                    />
                    <div className="      flex flex-col ">
                      <p className="text-5xl font-[Unna] whitespace-nowrap font-bold text-amber-900">
                        {aziende.denominazioneAziendale}
                      </p>
                      <p className=" text-amber-600 -mt-2 mb-5 font-light">
                        {aziende.tipologiaAttivita}
                      </p>
                      <div className="flex items-start gap-2 mb-3">
                        <MapPinIcon className="h-6 w-6 min-w-6 text-red-500 mt-1" />
                        <span className="text-xl">{aziende.sedeOperativa}</span>
                      </div>
                      <div className="flex items-start gap-2 mb-3">
                        <PhoneIcon className="h-6 w-6 min-w-6 text-blue-500 mt-1" />
                        <span className="text-xl">{aziende.telefono}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <EnvelopeOpenIcon className="h-6 w-6 min-w-6 text-teal-500 mt-1" />
                        <span className="text-xl">{aziende.email}</span>
                      </div>

                      <hr className="my-3 w-full h-[1px] bg-stone-300 border-none" />

                      <span className="text-xl mt-5 mb-3 text-gray-600">
                        Partita IVA: {aziende.partitaIva}
                      </span>
                      <span className="text-xl  text-gray-600">
                        Ragione sociale: {aziende.ragioneSociale}
                      </span>
                    </div>
                    <button
                      className="absolute -top-6 -right-30 bg-stone-100/70 shadow-md backdrop-blur-sm text-neutral-900 py-2 px-6 rounded-4xl hover:bg-stone-400/60 border border-stone-200 hover:border-stone-300"
                      onClick={() => {
                        setDenominazioneAziendale(
                          azienda[0].denominazioneAziendale
                        )
                        setRagioneSociale(azienda[0].ragioneSociale)
                        setTipologiaAttivita(azienda[0].tipologiaAttivita)
                        setSedeOperativa(azienda[0].sedeOperativa)
                        setPartitaIva(azienda[0].partitaIva)
                        setTelefono(azienda[0].telefono)
                        setEmail(azienda[0].email)
                        setShowForm(true)
                      }}
                    >
                      Modifica
                    </button>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Azienda
