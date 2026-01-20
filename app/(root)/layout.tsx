import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/lib/typeorm/init";
import { SessionProvider } from "next-auth/react";

export default function Layout({children}: Readonly<{children: React.ReactNode}> ){
    return (
        <main className="font-work-sans">
            <SessionProvider>
            <Navbar />
            {children}
            <Footer />
            </SessionProvider>
        </main>
    )
}