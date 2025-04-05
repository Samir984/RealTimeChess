export default function loading() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
      <div className="relative w-16 h-16 animate-spin rounded-full border-t-4 border-b-4 border-white-500">
        <div className="absolute inset-0 flex justify-center items-center"></div>
      </div>
      <div className=" text-lg font-semibold text-gray-400 animate-pulse">
        Loading the content ...
      </div>
    </div>
  );
}
