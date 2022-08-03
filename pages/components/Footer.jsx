import Link from "next/link"

export default function Foot(){
    return(
        <footer className="mt-40 inset-x-0 bottom-0 sm-2 flex justify-center items-center">
            <div className=" bg-white border-t-2 p-2 border-black flex flex-row w-full relative justify-center">
            <span className="flex flex-row text-2xl">
                <div className="w-8 h-8 rounded-2xl bg-blue-600"></div>
&nbsp;2022 - 
                <a
                    href="https://github.com/toine08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='text-2xl'
                >
            &nbsp;togido 
                </a>
        &nbsp;
        </span>
            </div>
            
      </footer>
    )
}