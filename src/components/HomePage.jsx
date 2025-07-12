import { useState, useEffect } from "react"
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns"
import SideBar from "./SideBar"

const HomePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [datiCalendario, setDatiCalendario] = useState([])

  useEffect(() => {
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd")
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd")

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
  }, [currentMonth])

  const groupedByDate = datiCalendario.reduce((acc, item) => {
    if (!item?.data || isNaN(new Date(item.data))) return acc
    if (!acc[item.data]) acc[item.data] = []
    acc[item.data].push(item)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedByDate).sort()

  const getCardSize = (items) => {
    const mediaLunghezzaDescrizione =
      items.reduce((acc, i) => acc + (i.descrizione?.length || 0), 0) /
      items.length

    if (items.length > 2 || mediaLunghezzaDescrizione > 40) {
      return "md:col-span-2 md:row-span-2"
    } else if (items.length === 1 && mediaLunghezzaDescrizione < 20) {
      return "md:col-span-1 md:row-span-1"
    } else {
      return "md:col-span-2"
    }
  }

  return (
    <div className="flex h-screen bg-neutral-100">
      <SideBar />
      <main className="flex-1  p-20 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            ◀ Mese Precedente
          </button>
          <h1 className="text-2xl font-bold">
            Controlli - {format(currentMonth, "MMMM yyyy")}
          </h1>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Mese Successivo ▶
          </button>
        </div>

        {sortedDates.length === 0 ? (
          <p className="text-gray-600">
            Nessun controllo disponibile per questo mese.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(100px,_auto)] gap-4">
            {sortedDates
              .filter((date) => date && !isNaN(new Date(date)))
              .map((date) => {
                const items = groupedByDate[date]
                return (
                  <div
                    key={date}
                    className={`bg-neutral-200 p-4 rounded-3xl shadow-md ${getCardSize(
                      items
                    )}`}
                  >
                    <h2 className="font-semibold text-lg mb-2 text-blue-800 text-center">
                      {format(parseISO(date), "dd MMMM yyyy")}
                    </h2>
                    <ul className="space-y-2 text-sm">
                      {items.map((item, i) => (
                        <li key={i} className="  rounded-3xl p-4 text-center">
                          <p>
                            <strong>Tipo:</strong> {item.tipoControllo}
                          </p>
                          <p>
                            <strong>descrizione:</strong> {item.descrizione}{" "}
                          </p>
                          <p>
                            <strong>Esito:</strong>{" "}
                            <span
                              className={
                                item.conformita === "CONFORME"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {item.conformita}
                            </span>
                          </p>
                          {item.note && (
                            <p>
                              <strong>Note:</strong> {item.note}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage
