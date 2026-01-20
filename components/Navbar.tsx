import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { isAdmin, isTechnician } from "@/lib/utils";
import BannerSlider from "./Banner";

const Navbar = async () => {
  const session = await auth();
  const isUserAdmin = isAdmin(session?.user?.email);
  const isUserTechnician = isTechnician(session?.user?.email);

  return (
    <header className="justify-center shadow-sm">
      {/* <div className="bg-blue-400 w-full text-center text-white p-1 text-sm overflow-hidden">
        <div className="animate-slide inline-block whitespace-nowrap">
          <span className="mx-4">Welcome to our site!</span>
          <span className="mx-4">Big discounts available now!</span>
          <span className="mx-4">Fast delivery worldwide!</span>
        </div>
      </div> */}

      <BannerSlider/>

      <nav className="px-12 flex items-center justify-between">
        <Link className="p-3" href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div>
          <Link className="p-3" href="/">
            Home
          </Link>
          <Link className="p-3" href="/products">
            Shop All
          </Link>
          <Link className="p-3" href="/cctv-packages">
            Packages
          </Link>
          <Link className="p-3" href="/contact">
            Contact
          </Link>
          {session?.user && (
            <Link className="p-3" href="/shoppingcart">
              Cart
            </Link>
          )}
        </div>

        <div className="flex items-center">
          {session?.user ? (
            <>
              {isUserAdmin && (
                <Link className="p-3" href="/admin">
                  Admin Dashboard
                </Link>
              )}

              {isUserTechnician && (
                <Link className="p-3" href="/technician">
                  Technician Dashboard
                </Link>
              )}

              <Link
                href={`/profile`}
                className="p-3 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {session.user.name?.[0] || "?"}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
