import { useState, useEffect } from "react"
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  subWeeks,
  addWeeks,
} from "date-fns"
import { it } from "date-fns/locale"
import SideBar from "./SideBar"
import SidebMobile from "./SidebMobile"

const HomePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const start = format(
    startOfWeek(currentMonth, { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  )
  const end = format(endOfWeek(currentMonth, { weekStartsOn: 1 }), "yyyy-MM-dd")

  const [datiCalendario, setDatiCalendario] = useState([])

  useEffect(() => {
    const fetchDati = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(
          `http://localhost:8080/controlli/calendario?start=${start}&end=${end}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const data = await res.json()
        setDatiCalendario(data)
        console.log(data)
      } catch (err) {
        console.error("Errore fetch calendario:", err)
      }
    }

    fetchDati()
  }, [currentMonth, start, end])

  const groupedByDate = datiCalendario.reduce((acc, item) => {
    if (!item?.data || isNaN(new Date(item.data))) return acc
    if (!acc[item.data]) acc[item.data] = []
    acc[item.data].push(item)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedByDate).sort()

  const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 })
  const endDate = endOfWeek(currentMonth, { weekStartsOn: 1 })

  const formatMonthDisplay = () => {
    if (startDate.getMonth() === endDate.getMonth()) {
      return format(startDate, "MMM", { locale: it })
    } else {
      return `${format(startDate, "MMM", { locale: it })}-${format(
        endDate,
        "MMM",
        { locale: it }
      )}`
    }
  }

  return (
    <div className="flex h-screen bg-beige">
      <SideBar />

      <main className="flex-1   overflow-auto">
        {" "}
        <div className="w-full flex flex-col md:flex-row items-center justify-between md:px-20 px:4 py-2 bg-salviaChiaro/80 sticky top-0 left-0 z-50 backdrop-blur-sm shadow-xs shadow-salvia inset-shadow-sm inset-shadow-salvia/50">
          <div>
            <SidebMobile />
          </div>
          <h1 className="lg:text-6xl text-2xl font-[Unna] text-salviaScuro text-shadow-xs mb-2 md:mb-0">
            Dashboard
          </h1>{" "}
          <div className="flex md:justify-center  md:items-center gap-2 w-full md:w-auto mb-2 md:mb-0">
            <button
              onClick={() => setCurrentMonth(subWeeks(currentMonth, 1))}
              className="md:text-xl text-xs bg-avorio border-1 border-salvia shadow-md shadow-salviaChiaro  text-gray-700  rounded-4xl w-40 h-10 md:w-35 md:h-15 disabled:opacity-50 hover:bg-salviaChiaro"
            >
              <p className="text-center ">{formatMonthDisplay()}</p>
              {format(
                startOfWeek(subWeeks(currentMonth, 1), { weekStartsOn: 1 }),
                "dd",
                { locale: it }
              )}{" "}
              -{" "}
              {format(
                endOfWeek(subWeeks(currentMonth, 1), { weekStartsOn: 1 }),
                "dd",
                { locale: it }
              )}
            </button>
            <div className="bg-ambra shadow-md shadow-salvia w-40 h-11 md:w-35 md:h-15 rounded-4xl md:rounded-full">
              <p className="text-center">{formatMonthDisplay()}</p>
              <h1 className="md:text-2xl text-xs font-bold text-center">
                {format(startDate, "dd", { locale: it })} -{" "}
                {format(endDate, "dd", { locale: it })}
              </h1>
            </div>

            <button
              onClick={() => setCurrentMonth(addWeeks(currentMonth, 1))}
              className="md:text-xl text-xs bg-avorio border-1 border-salvia shadow-md shadow-salviaChiaro  text-gray-700  rounded-4xl w-40 h-10 md:w-35 md:h-15 disabled:opacity-50   hover:bg-salviaChiaro"
            >
              <p className="text-center">{formatMonthDisplay()}</p>
              {format(
                startOfWeek(addWeeks(currentMonth, 1), { weekStartsOn: 1 }),
                "dd",
                { locale: it }
              )}{" "}
              -{" "}
              {format(
                endOfWeek(addWeeks(currentMonth, 1), { weekStartsOn: 1 }),
                "dd",
                { locale: it }
              )}
            </button>
          </div>
        </div>
        {sortedDates.length === 0 ? (
          <p className="text-gray-600 text-center">
            Nessun controllo disponibile per questa settimana.
          </p>
        ) : (
          <div className="grid md:grid-cols-[100px_1fr] grid-cols-[60px_1fr] gap-1 ml-5 mt-5">
            {" "}
            {sortedDates.map((date) => (
              <div key={date} className="contents">
                <div className="font-semibold  text-gray-700 flex items-center justify-end mr-5">
                  <div className="flex flex-col items-center bg-ambra rounded-full p-3  ">
                    {" "}
                    <p className="md:text-3xl text-xs">
                      {format(parseISO(date), "d", { locale: it })}
                    </p>
                    <p className="md:text-sm text-2xs">
                      {" "}
                      {format(parseISO(date), "EEE", { locale: it })}
                    </p>
                  </div>
                </div>

                <div className="flex  gap-3 ">
                  {groupedByDate[date].map((controllo, index) => (
                    <>
                      <div
                        key={index}
                        className={`md:w-56 md:h-40 w-32 h-23 pt-2 px-4 md:px-0 md:pt-4  text-center rounded-2xl border-1 flex flex-col justify-between ${
                          controllo.conformita === "NON_CONFORME"
                            ? "bg-rosso/10 border-rosso/30"
                            : "bg-salvia/10 border-salvia/30"
                        }`}
                      >
                        <p className="  md:mb-2 text-xs md:text-base">
                          <span className="font-bold text-gray-700 ">
                            {controllo.tipoControllo}:{" "}
                          </span>
                          <span className="md:text-lg text-gray-900">
                            {controllo.descrizione}
                          </span>
                        </p>
                        <p
                          className={`mb-1 md:text-base text-xs md:mx-6 text-shadow-2xs md:mb-3 md:rounded-3xl py-2 ${
                            controllo.conformita === "NON_CONFORME"
                              ? "md:bg-rosso text-red-900"
                              : "md:bg-salvia md:text-salviaChiaro text-salviaScuro"
                          } `}
                        >
                          {controllo.conformita}
                        </p>
                      </div>
                    </>
                  ))}
                </div>
                <div className="col-span-2">
                  <hr className="border-t border-salvia my-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage
