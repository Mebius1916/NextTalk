import { TextArea } from '@apideck/components'
import { useState } from 'react'
import { useMessages } from '../lib/useMessages'

const MessageForm = () => {
  const [content, setContent] = useState('')
  const { addMessage } = useMessages()

  const handleSubmit = async (e?: any) => {
    e?.preventDefault()
    addMessage(content)
    setContent('')
  }
  return (
    <form className="relative  rounded-t-xl bottom-4" onSubmit={handleSubmit}>
      <div className=" mx-auto max-w-3xl flex">
        <div className ='text-gray-900 border-0 shadow-none w-[40rem] ml-12'>
        <TextArea
            name="content"
            //@ts-ignore
            placeholder="Enter your message here..."
            rows={3}
            value={content}
            autoFocus
            style={{ outline: 'none'}}
            onChange={(e: any) => setContent(e.target.value)}
            className='h-12'
          />
        </div>
        <button className="ml-2" type="submit">
          <img src="/images/send.png" alt="send" className="w-10 h-10 rounded-full hover:scale-125 ease-in-out duration-300" />
        </button>
      </div>
    </form>
  )
}

export default MessageForm
