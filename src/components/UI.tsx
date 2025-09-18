import { atom, useAtom } from "jotai";

export const currentPageAtom = atom<string>("intro");

export const UI = () => {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  return (
    <div className="fixed inset-0 pointer-evets-none">
      <section
        className={`flex w-full h-full flex-col items-center justify-center duration-500 ${
          currentPage === "home" ? "" : "opacity-0"
        }`}
      >
        <div className="h-[66%]"></div>
        <button
          onClick={() => setCurrentPage("explore")}
          className="pointer-events-auto cursor-pointer px-6 py-4 bg-[#5d8d11] text-white font-black rounded-full hover:bg-[#3b5a0a] ease-in-out duration-300 shadow-lg"
        >
          ENTER
        </button>
      </section>
    </div>
  );
};
