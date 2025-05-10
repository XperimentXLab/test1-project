

const Home = () => {
  return (
    <div className="flex flex-col justify-between items-center gap-3 p-2 mt-2">


      <div>
        <h1 className="font-bold text-md">Home</h1>
      </div>

      <div className="grid grid-rows-2 gap-3">

        <div className="grid grid-rows-2">
          <span className="font-bold text-md">Latest News</span>
          <span>News.......</span>
        </div>

        <div className="grid grid-rows-3">
          <span className="font-bold text-md">About</span>
          <h3>Test1 - Project</h3>
          <span>Project Description</span>
        </div>
        
      </div>
      
    </div>
  )
}

export default Home
