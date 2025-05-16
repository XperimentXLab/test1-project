

const Home = () => {
  return (
    <div className="flex flex-col justify-between items-center gap-3 p-2 mt-2">

      <div>
        <h1 className="font-bold text-md">Home</h1>
      </div>

      <div className="grid grid-rows-2 gap-3">

        <div className="flex flex-col border rounded-xl p-3">
          <span className="font-bold text-md">Latest News</span>
          <span>
            Hello, welcome to MMS
            <br />
            Begin your journey here...
          </span>
        </div>

        <div className="flex flex-col border rounded-xl p-3">
          <span className="font-bold text-md">About</span>
          <span>
            MONEY MANAGEMENT SOLUTION (MMS) is a platform to manage and increase your assets by trading cryptocurrency
          </span>
        </div>
        
      </div>
      
    </div>
  )
}

export default Home
