[<a href="https://github.com/Mebius1916/NextTalk/blob/main/README_en.md">English</a> / <a href="https://github.com/Mebius1916/NextTalk/blob/main/README.md">Chinese</a> ]
# NextTalk
<img src="https://github.com/user-attachments/assets/3cfb9427-4dae-4a69-b5c3-f3e34bf2df7b" width="150" height="150">

### Introduction

This project is a desktop-based real-time chat tool developed using Nextron (NextJS + Electron).

Please download and install the installation package from the releases on the right.

Why use Page Route? Since Nextron only supports page route, I would like to use API route as well.

ps: The modification of the project will be synchronized with the modification of the web version.

If you like it, give it a star\~

***

### Technology Stack

Frontend: NextJS (React) + TailwindCSS + TypeScript + ThreeJS + NextUI + MaterialUI (icons) + NextAuth + Cloudinary + Electron + Pusher + React-toastify + OpenAI + React-email

Backend: NextJS (api route) + MongoDB + Mongoose

***

### Features

#### Login, Registration, Password Reset, and Email Verification
![image](https://github.com/user-attachments/assets/321da116-38a6-488b-ad32-46fa50fb72a2)
![image](https://github.com/user-attachments/assets/bfe84366-22fa-4f92-bc7a-88d13e4e9a49)
![image](https://github.com/user-attachments/assets/ce871b89-7368-4bb1-b2a0-b8a080e7ba94)

Registration and password reset modules require email verification; please check your registered email for the verification code.

#### Chat Interface
![image](https://github.com/user-attachments/assets/bfd1d4e5-755c-4572-a19b-dbf907857591)

The logout button at the top right allows you to log out of your account.

#### Sending Messages and Pictures
![image](https://github.com/user-attachments/assets/9637a3cc-a3f5-437c-8607-a1615ba94b6e)

Click the image button next to the input box to send pictures.

#### Creating Chats
![image](https://github.com/user-attachments/assets/b373ec86-5a7d-4b7b-b1de-dd03e1915674)


Choose single selection to create one-on-one chats, or multiple selection to create group chats.

On the right is a 3D planet that you can rotate.

#### Friend Requests and Acceptances
![image](https://github.com/user-attachments/assets/66d9b0ce-481a-49d5-b0c4-36e589814422)


Before becoming friends, you cannot send messages. Please click the `Add friend` button to send a friend request.

![image](https://github.com/user-attachments/assets/ac8dc728-c32a-40a6-8323-748a83f967b1)

After receiving a friend request, the recipient can click the check mark next to the message to become friends.

#### Pilgrimage Site
![image](https://github.com/user-attachments/assets/dd897aa0-daf7-4906-84b9-239d5594046f)


Embedded using an inline frame, because I personally really like this website, I included it for fun.

The top icon on the right bottom function key is a refresh symbol; clicking it resets the page.
#### AI Assistant
![image](https://github.com/user-attachments/assets/23c9d97b-4a4e-4e0a-a9ef-7c5e1fb6e984)


GPT-3.5 assistant, which is quite rudimentary. It doesn't format production messages, so it can't produce formats like `markdown`, only plain text.

#### Modifying Personal and Group Avatars and Names
![image](https://github.com/user-attachments/assets/b1676f37-adb4-4014-812e-9738d38bd74c)
Click the top right corner of the chat interface to change your avatar and name.

![image](https://github.com/user-attachments/assets/bee8e522-aacd-45a6-8324-19e85e341eef)
Click on the group chat avatar in the chat to change the group chat avatar and name.

***

### Notes

Although this project is based on Nextron, I realized when packaging that Nextron's production environment does not support NextJS's SSR and API routes (which I used), so this project can only run in a development environment, meaning it is strictly a NextJS project. This has led me to dislike Nextron, for the following reasons:

1. I believe API route is an indispensable part of NextJS, the reason I use NextJS is for its capability to rapidly develop full-stack projects, and Nextron's omission of this feature makes it feel like merely React + Electron with a NextJS ecosystem. The author mentioned this was omitted due to security concerns, but I think this feature should exist, even if not used, as personal developers like me are not concerned about security issues.
2. Nextron does not support the app route method, only the traditional pages route, which is why my project uses pages route and not app route. This is not ideal, as app route is the future of NextJS.
3. Nextron only supports webpack for packaging. Personally, I think the only advantage of webpack as a packaging tool nowadays is its extensive ecosystem, but I prefer using Vite.

***

### Running

Install dependencies: `npm install`

Run in development environment: `npm run dev`

Note: The `.env` file is located in the `/renderer` directory. Please complete it before running.

***

### Web Version

The web version is deployed through Vercel.

GitHub: [Mebius1916/NextTalk\_web: Web version of the NextTalk project](https://github.com/Mebius1916/NextTalk_web "Mebius1916/NextTalk_web: Web version of the NextTalk project")

Experience address: https://next-talk-six.vercel.app

***

### Submit PR

You can refer to the `issues` I've set up, but of course, if you have good ideas, they are welcome too, not limited to the issues I've listed.

If you have ideas and need help configuring `.env`, you can submit an `issue`. After review, I'll send you my own `.env`.

***

#### Disclaimer

The initial intention of writing this project was to familiarize myself with `react` and `nextjs` by developing a project from scratch, so the code might be rough. Please treat it as a fun little toy.
