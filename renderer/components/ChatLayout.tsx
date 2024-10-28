
import LeftBar from "./LeftBar"
import TopBar from "./TopBar"
export default function ChatLayout({ children }:any) {
  return (
    <div className="flex h-screen">
      {/* leftbar */}
      <LeftBar/>
      <div className="flex-1">
        {/* topbar */}
        <TopBar/>
        <main>{children}</main>
      </div>

    </div>
  )
}