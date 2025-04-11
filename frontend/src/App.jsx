// import "dotenv/config";

function App() {
  const url = import.meta.env.VITE_API_URL;
  // console.log(url);
  // console.log("hi");
  return (
    <>
      <h1 className="m-1 p-3 text-3xl font-bold underline">Hello world!</h1>
    </>
  );
}

export default App;
