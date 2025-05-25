import Link from "next/link";

function Navbar() {
  return (
    <nav className="flex items-center border border-text rounded-l-lg p-6">
      <img
        src="/logo.svg"
        alt="Logo"
        className="h-10 w-auto"
      />
      <div className="flex justify-center flex-1 mr-30 space-x-6">
        <Link href="/" className="text-card-foreground no-underline hover:underline">
          Home
        </Link>
        <Link href="/library" className="text-card-foreground no-underline hover:underline">
          Library
        </Link>
        <Link href="/chapters" className="text-card-foreground no-underline hover:underline">
          Chapters
        </Link>
        <div className="w-3"></div>
      </div>
    </nav>
  );
}

export default Navbar;