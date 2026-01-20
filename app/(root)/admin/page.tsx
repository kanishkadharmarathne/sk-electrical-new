import { auth } from "@/auth"
import Adminpanel from "@/components/Adminpanel"
import { isAdmin } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/')
  }

  const isUserAdmin = isAdmin(session.user.email)
  
  if (!isUserAdmin) {
    redirect('/')
  }

  return (
    <Adminpanel/>
  );
}
