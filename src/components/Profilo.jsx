import SideBar from "./SideBar"

const Profilo = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div>
        <SideBar />
      </div>
      <div className="flex-1 p-6">
        <h1>Profilo</h1>
      </div>
    </div>
  )
}
export default Profilo
