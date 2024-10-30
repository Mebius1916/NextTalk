import Head from 'next/head'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  title?: string
  description?: string
  favicon?: string
}

const Layout = ({
  children,
  title = 'NextTalk',
  description = 'A real-time chat tool based on nextron (NextJS+electron) with integrated AI functions',
  favicon = 'https://github.com/user-attachments/assets/3cfb9427-4dae-4a69-b5c3-f3e34bf2df7b'
}: Props) => (
  <div className="font-basier-circle">
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href={favicon} />
    </Head>
    <div className=" bg-gray-100">{children}</div>
  </div>
)

export default Layout
