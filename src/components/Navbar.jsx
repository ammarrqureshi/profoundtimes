
import Link from "next/link"

function Navbar() {
  return (
    <nav className="flex items-center justify-center
     border border-text 
    rounded-lg p-6   space-x-4">
       <div className="flex space-x-7">
        <Link href="/" className=" hover:underline">
          Home
        </Link>
        <Link href="/library" className=" hover:underline">
          Library
        </Link>
        <Link href="/chapters" className=" hover:underline">
          Chapters
        </Link>
        <div className="w-6"></div>
        </div>
    </nav>
  )
}

export default Navbar