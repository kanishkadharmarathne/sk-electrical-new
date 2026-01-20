import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { isAdmin, isTechnician } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Camera,
  Search,
  ListOrdered,
  User,
} from "lucide-react";

const homeNavbar = async () => {
  const session = await auth();
  const isUserAdmin = isAdmin(session?.user?.email);
  const isUserTechnician = isTechnician(session?.user?.email);

  return (
    <header className="justify-center shadow-sm">
      <nav className="px-12 flex items-center justify-between py-2 fixed w-full bg-gradient-to-b from-slate-900 via-slate-900 to-transparent bg-opacity-80 backdrop-blur-md z-50 border-b border-cyan-500 border-opacity-20 shadow-lg">
        <Link className="p-3" href="/">
          <Image src="/logo.png" alt="logo" width={144} height={20} />
        </Link>

        <div className="flex gap-2">
          <Link
            className="group relative px-6 py-2 text-cyan-100 font-light transition-colors duration-300 hover:text-white text-sm"
            href="/"
          >
            Home
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>

          <Link
            className="group relative px-6 py-2 text-cyan-100 font-light transition-colors duration-300 hover:text-white text-sm"
            href="/products"
          >
            Shop All
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>

          <Link
            className="group relative px-6 py-2 text-cyan-100 font-light transition-colors duration-300 hover:text-white text-sm"
            href="/cctv-packages"
          >
            Packages
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>

          <Link
            className="group relative px-6 py-2 text-cyan-100 font-light transition-colors duration-300 hover:text-white text-sm"
            href="/contact"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </div>

        <div className="flex items-center">
          {session?.user ? (
            <>
              {isUserAdmin && (
                <Link
                  className="group relative px-6 py-2 text-cyan-100 font-light transition-colors duration-300 hover:text-white text-sm"
                  href="/admin"
                >
                  Admin Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              )}

              {isUserTechnician && (
                <Link
                  className="p-3 text-cyan-100 hover:text-cyan-300 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-cyan-500 hover:bg-opacity-10 relative group"
                  href="/technician"
                >
                  Technician Dashboard
                </Link>
              )}

              <Link
                className="p-3 text-cyan-100 hover:text-cyan-300 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-cyan-500 hover:bg-opacity-10 relative group"
                href="/orders"
              >
                <ListOrdered size={30} />
              </Link>

              <Link
                href={`/profile`}
                className="p-3 text-cyan-100 hover:text-cyan-300 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-cyan-500 hover:bg-opacity-10 relative group"
              >
                {session.user.image ? (
                  // <Image
                  //   src={session.user.image}
                  //   alt="Profile"
                  //   width={32}
                  //   height={32}
                  //   className="rounded-full"
                  // />
                  <User size={30} />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {session.user.name?.[0] || "?"}
                  </div>
                )}
              </Link>

              <Link
                className="p-3 text-cyan-100 hover:text-cyan-300 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-cyan-500 hover:bg-opacity-10 relative group"
                href="/shoppingcart"
              >
                <ShoppingCart size={30} />
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-black transition"
              >
                <img
                  src="https://www.gstatic.com/images/branding/product/1x/gsa_64dp.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-sm font-light text-cyan-100">
                  Sign in with Google
                </span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default homeNavbar;
