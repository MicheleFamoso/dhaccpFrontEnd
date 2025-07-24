import SideBar from "./SideBar"
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeOpenIcon,
  PencilIcon,
} from "@heroicons/react/24/solid"
import { jwtDecode } from "jwt-decode"

import { useState, useEffect } from "react"
import SidebMobile from "./SidebMobile"

const Azienda = () => {
  const [azienda, setAzienda] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const token = localStorage.getItem("token")
  const ruolo = token ? jwtDecode(token).role : null

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
        <div className="flex-1 justify-items-center justify-center overflow-auto">
          <div className="w-full flex flex-col md:flex-row items-center justify-between px-20 py-2 bg-salviaChiaro sticky top-0 left-0 z-50 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
            <h1 className="lg:text-6xl text-2xl font-[Unna] text-salviaScuro text-shadow-xs mb-2 md:mb-0">
              Azienda
            </h1>
            <SidebMobile></SidebMobile>
          </div>
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
              <div className="md:w-150 w-80 p-6 rounded-4xl bg-salviaChiaro border-1  border-salvia shadow-md shadow-salvia mt-4">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-700 text-shadow-md">
                  Azienda
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
                  <div className="relative mt-6">
                    <input
                      id="azienda"
                      type="text"
                      placeholder=""
                      value={denominazioneAziendale}
                      onChange={(e) =>
                        setDenominazioneAziendale(e.target.value)
                      }
                      className="ww-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                      required
                    />{" "}
                    <label
                      htmlFor="azienda"
                      className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                      Denominazione Aziendale
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      id="societa"
                      type="text"
                      placeholder=""
                      value={ragioneSociale}
                      onChange={(e) => setRagioneSociale(e.target.value)}
                      className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                      required
                    />
                    <label
                      htmlFor="societa"
                      className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                      Ragione Sociale
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      id="attivita"
                      type="text"
                      placeholder=""
                      value={tipologiaAttivita}
                      onChange={(e) => setTipologiaAttivita(e.target.value)}
                      className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                      required
                    />
                    <label
                      htmlFor="attivita"
                      className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                      Tipologia Attività
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      id="sede"
                      type="text"
                      placeholder=""
                      value={sedeOperativa}
                      onChange={(e) => setSedeOperativa(e.target.value)}
                      className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                      required
                    />
                    <label
                      htmlFor="sede"
                      className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                      Sede Operativa
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      id="iva"
                      type="text"
                      placeholder=""
                      value={partitaIva}
                      onChange={(e) => setPartitaIva(e.target.value)}
                      className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                      required
                    />
                    <label
                      htmlFor="iva"
                      className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                      Partita IVA
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      id="telefono"
                      type="text"
                      placeholder="Telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                      required
                    />
                    <label
                      htmlFor="telefono"
                      className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                      Telefono
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      id="email"
                      type="email"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mb-3  transition-colors focus:outline-none peer bg-inherit  border-b focus:border-ambra focus:border-b-2 focus:outline-hidden"
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute -top-4 text-sm text-gray-600 left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-ambra peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                      Email
                    </label>
                  </div>

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
              <>
                {/* desktop: card girevole */}
                <div className="hidden md:flex justify-center mt-20 h-[calc(100vh-100px)] w-full">
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
                      <div className="absolute w-full h-full scale-150 backface-hidden transform rotate-y-180 bg-salvia p-4 rounded-2xl shadow-md shadow-salviaScuro border-1 border-salviaScuro flex justify-center">
                        <div className="w-5/10 flex flex-col items-center">
                          {ruolo === "ADMIN" && (
                            <button
                              className="p-1 ml-0 mt-0 self-start text-sm bg-salviaScuro shadow-md shadow-salvia rounded-2xl hover:bg-ambra text-white"
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
                            </button>
                          )}

                          <h1 className="font-[Unna] text-center mt-10 text-4xl text-salviaChiaro font-bold text-shadow-md">
                            {azienda.denominazioneAziendale}
                          </h1>
                        </div>
                        <div className="w-px h-50 bg-salviaScuro"></div>
                        <div className="mt-5">
                          <div className="flex ml-5 mb-3 gap-2">
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
                          <hr className="my-3 border-t border-salviaScuro" />
                          <p className="text-avorio text-shadow-md ml-5 text-xs mb-3">
                            <span className="text-salviaChiaro font-bold">
                              Tipologia attività:{" "}
                            </span>
                            {azienda.tipologiaAttivita}
                          </p>
                          <p className="text-avorio text-shadow-md ml-5 text-xs mb-3">
                            <span className="text-salviaChiaro font-bold">
                              Partita iva:{" "}
                            </span>
                            {azienda.partitaIva}
                          </p>
                          <p className="text-avorio text-shadow-md ml-5 text-xs mb-3">
                            <span className="text-salviaChiaro font-bold">
                              Ragione sociale:{" "}
                            </span>
                            {azienda.ragioneSociale}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* mobile*/}
                <div className="md:hidden flex justify-center w-full  mt-8">
                  <div className="w-full p-6 bg-salvia  rounded-2xl shadow-md shadow-salviaScuro border-1 border-salviaScuro">
                    <h1 className="text-3xl font-bold text-center text-salviaChiaro font-[Unna] text-shadow-md mb-2">
                      {azienda.denominazioneAziendale}
                    </h1>
                    <p className=" text-salviaChiaro text-shadow-md mb-2">
                      <span className="font-bold">Tipologia:</span>{" "}
                      {azienda.tipologiaAttivita}
                    </p>
                    <p className=" text-salviaChiaro text-shadow-md mb-2">
                      <span className="font-bold">Sede:</span>{" "}
                      {azienda.sedeOperativa}
                    </p>
                    <p className=" text-salviaChiaro text-shadow-md mb-2">
                      <span className="font-bold">Telefono:</span>{" "}
                      {azienda.telefono}
                    </p>
                    <p className=" text-salviaChiaro text-shadow-md mb-2">
                      <span className="font-bold">Email:</span> {azienda.email}
                    </p>
                    <p className=" text-salviaChiaro text-shadow-md mb-2">
                      <span className="font-bold">Partita IVA:</span>{" "}
                      {azienda.partitaIva}
                    </p>
                    <p className=" text-salviaChiaro text-shadow-md mb-3">
                      <span className="font-bold">Ragione sociale:</span>{" "}
                      {azienda.ragioneSociale}
                    </p>
                    {ruolo === "ADMIN" && (
                      <div className="flex items-center justify-center">
                        <button
                          className=" bg-salviaChiaro/30 text-white  px-3 py-1 rounded-2xl hover:bg-ambra shadow-xs"
                          onClick={() => {
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
                          Modifica
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Azienda
