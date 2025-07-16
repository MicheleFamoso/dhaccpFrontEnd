import SideBar from "./SideBar"
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeOpenIcon,
  PencilIcon,
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
      <div className="flex h-screen   bg-beige   ">
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
              <p className="text-xl text-center w-full py-10 text-rosso">
                {error}
              </p>
            )}
            {!loading && !error && !azienda && !showForm && (
              <div className="flex flex-col items-center text-center w-200 py-10 gap-4 bg-salviaChiaro border-1 border-salvia shadow-md shadow-salvia rounded-2xl">
                <p className="text-xl text-center  py-10">
                  Nessuna azienda disponibile.
                </p>
                <button
                  className=" w-50 bg-gray-200 shadow-md shadow-salvia rounded-2xl  text-neutral-900 py-2  hover:bg-salvia border-1 border-salvia  "
                  onClick={() => setShowForm(true)}
                >
                  Aggiunti azienda
                </button>
              </div>
            )}
            {!loading && !error && showForm && (
              <div className="w-200 p-6 bg-salviaChiaro border-1  border-salvia shadow-md shadow-salvia">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700 text-shadow-md">
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
                    className="w-full mb-3   p-2   border-b focus:border-ambra  focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ragione Sociale"
                    value={ragioneSociale}
                    onChange={(e) => setRagioneSociale(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tipologia Attività"
                    value={tipologiaAttivita}
                    onChange={(e) => setTipologiaAttivita(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sede Operativa"
                    value={sedeOperativa}
                    onChange={(e) => setSedeOperativa(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Partita IVA"
                    value={partitaIva}
                    onChange={(e) => setPartitaIva(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3   p-2   border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                    required
                  />
                  <button
                    type="submit"
                    className="w-50 self-center  bg-salvia shadow-md  text-neutral-900 py-2 rounded-2xl hover:bg-ambra border-1 border-salviaScuro  shadow-salviaScuro"
                  >
                    Salva azienda
                  </button>
                </form>
              </div>
            )}
            {!loading && !error && !showForm && azienda && (
              <div
                key={azienda.id}
                className="flex justify-center mt-20 h-[calc(100vh-100px)] w-full"
              >
                <div
                  className="relative w-[500px] h-[250px] cursor-pointer"
                  onClick={() => setFlipped(!flipped)}
                >
                  <div
                    className={`relative w-full h-full duration-600 transform-style preserve-3d transition-transform ${
                      flipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Fronte */}
                    <div className="absolute w-full h-full scale-150 backface-hidden transform rotate-y-[28deg] transition-transform duration-700 ease-in-out bg-salvia p-4 rounded-2xl shadow-md shadow-salviaScuro border-1 border-salviaScuro flex flex-col items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-salviaChiaro/10 via-transparent to-salviaScuro rounded-2xl pointer-events-none" />

                      <p className="text-5xl font-bold text-salviaChiaro font-[Unna] text-shadow-md">
                        {azienda.denominazioneAziendale}
                      </p>
                      <p className="text-md font-light font-[Unna] text-salviaChiaro text-shadow-md ">
                        {azienda.tipologiaAttivita}
                      </p>
                      <p className=" text-salviaChiaro text-shadow-md mt-4 ">
                        →
                      </p>
                    </div>
                    {/* Retro */}
                    <div className="absolute w-full h-full scale-150 backface-hidden transform rotate-y-180 bg-salvia p-4 rounded-2xl shadow-md shadow-salviaScuro border-1 border-salviaScuro  flex  justify-center    ">
                      <div className="w-5/10  flex flex-col items-center">
                        <button
                          className=" p-1 ml-0 mt-0 self-start text-sm bg-salviaScuro shadow-md shadow-salvia rounded-2xl hover:bg-ambra  text-white"
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
                          <PencilIcon className="w-3" />
                        </button>{" "}
                        <h1 className=" font-[Unna] text-center mt-10 text-4xl text-salviaChiaro font-bold text-shadow-md ">
                          {" "}
                          {azienda.denominazioneAziendale}
                        </h1>{" "}
                      </div>
                      <div class="w-px h-50 bg-salviaScuro"></div>
                      <div className=" mt-5 ">
                        <div className="flex  ml-5 mb-3 gap-2">
                          <MapPinIcon className="h-4 w-4 text-ambra" />
                          <p className="text-avorio text-shadow-md text-xs">
                            <span className="text-salviaChiaro font-bold">
                              Sede:
                            </span>{" "}
                            {azienda.sedeOperativa}
                          </p>
                        </div>
                        <div className="flex items-center ml-5 mb-3 gap-2">
                          <PhoneIcon className="h-4 w-4 text-ambra" />
                          <p className="text-avorio text-shadow-md text-xs">
                            <span className="text-salviaChiaro font-bold">
                              {" "}
                              Telefono:
                            </span>{" "}
                            {azienda.telefono}
                          </p>
                        </div>
                        <div className="flex items-center ml-5 mb-3 gap-2">
                          <EnvelopeOpenIcon className="h-4 w-4 text-ambra" />
                          <p className="text-avorio text-shadow-1 text-xs">
                            <span className="text-salviaChiaro font-bold">
                              Email:{" "}
                            </span>
                            {azienda.email}
                          </p>
                        </div>
                        <hr class="my-3 border-t border-salviaScuro" />
                        <p className="text-avorio text-shadow-md ml-5 text-xs mb-3  ">
                          <span className="text-salviaChiaro font-bold">
                            Tipologia attività:{" "}
                          </span>

                          {azienda.tipologiaAttivita}
                        </p>
                        <p className="text-avorio text-shadow-md ml-5 text-xs mb-3  ">
                          <span className="text-salviaChiaro font-bold">
                            Partita iva:{" "}
                          </span>

                          {azienda.partitaIva}
                        </p>
                        <p className="text-avorio text-shadow-md ml-5 text-xs mb-3  ">
                          <span className="text-salviaChiaro font-bold">
                            Ragione sociale:{" "}
                          </span>

                          {azienda.ragioneSociale}
                        </p>
                      </div>
                    </div>{" "}
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
