import MessagesList from '../components/MessageList'
import { MessagesProvider } from '../lib/useMessages'
import Layout from '../components/Layout'
import ChatLayout from '../components/ChatLayout'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SessionData } from '../lib/type'
const IndexPage = () => {
  const { data: session } = useSession();
  const currentUser = session?.user as SessionData;
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) router.push("/auth/login");
  }, [session]);
  return (
    <MessagesProvider>
      <Layout>
        <div >
          <MessagesList />
        </div>
      </Layout>
    </MessagesProvider>
  )
}

IndexPage.getLayout = function getLayout(page:any) {
  return (
    <ChatLayout>
      {page}
    </ChatLayout>
  )
}
export default IndexPage
