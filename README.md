# NextTalk
<img src="https://github.com/user-attachments/assets/3cfb9427-4dae-4a69-b5c3-f3e34bf2df7b" width="150" height="150">

### 简介

该项目是一个基于Nextron(NextJS+Electron)的桌面端实时聊天工具。

体验安装包我放在了release里，目前只打包了windows版本。

github:[Mebius1916/NextTalk: A real-time chat tool based on nextron (NextJS+electron) with integrated AI functions](https://github.com/Mebius1916/NextTalk "Mebius1916/NextTalk: A real-time chat tool based on nextron (NextJS+electron) with integrated AI functions")

觉得不错的话给个star吧\~

***

### 技术栈

前端：NextJS(react)+Tailwindcss+Typescript+ThreeJS+NextUI+MaterialUI(icons)+NextAuth+Cloudinary+Electron+Pusher+React-toastify+OpenAI+React-email

后端：NextJS(ssr)+MongoDB+Mongoose

***

### 功能

#### 登陆、注册、重制密码与邮箱验证
![image](https://github.com/user-attachments/assets/321da116-38a6-488b-ad32-46fa50fb72a2)
![image](https://github.com/user-attachments/assets/bfe84366-22fa-4f92-bc7a-88d13e4e9a49)
![image](https://github.com/user-attachments/assets/ce871b89-7368-4bb1-b2a0-b8a080e7ba94)

注册和重置模块需要邮箱验证，发送code后请及时查看注册邮箱填写验证码。

#### 聊天界面
![image](https://github.com/user-attachments/assets/bfd1d4e5-755c-4572-a19b-dbf907857591)


右上角登出按钮可登出账号。

#### 创建聊天
![image](https://github.com/user-attachments/assets/b373ec86-5a7d-4b7b-b1de-dd03e1915674)


单选创建一对一聊天，多选创建群组聊天。

右边是个3D星球，可自行旋转

#### 申请好友、同意申请
![image](https://github.com/user-attachments/assets/66d9b0ce-481a-49d5-b0c4-36e589814422)


成为好友之前是不能发送消息的，请点击`Add friend`按钮发送好友请求。

![image](https://github.com/user-attachments/assets/ac8dc728-c32a-40a6-8323-748a83f967b1)

对方接受到好友请求后点击消息旁的对勾即可加为好友。

#### 圣地巡礼
![image](https://github.com/user-attachments/assets/dd897aa0-daf7-4906-84b9-239d5594046f)


用内联框架嵌入，因为个人很喜欢这个网站所以嵌入哈哈哈。

右下角功能键最上方有个刷新图标，点击可以重置页面。
#### AI助手
![image](https://github.com/user-attachments/assets/23c9d97b-4a4e-4e0a-a9ef-7c5e1fb6e984)


GPT3.5助手，比较粗糙，没有对生产消息做格式处理，不能生产`markdown`等格式只能生成普通文本格式。

#### 修改个人头像名字、群组头像名称
![image](https://github.com/user-attachments/assets/b1676f37-adb4-4014-812e-9738d38bd74c)
点击聊天界面右上角即可修改自己的头像和名字。

![image](https://github.com/user-attachments/assets/bee8e522-aacd-45a6-8324-19e85e341eef)
点击聊天中的群聊头像，即可修改群聊头像和名称。

***

### 注意

该项目虽然是基于Nextron的，但是当我打包的时候发现Nextron生产环境是不支持NextJS的ssr及api route的（我使用了），所以这个项目只能在开发环境运行，这就导致我并不喜欢nextron，具体体现在以下几点：

1. 我认为api route(ssr)是NextJS中不可或缺的一部分，我之所以使用NextJS便是因为其可以快速开发全栈项目的特性，而Nextron阉割掉了这个功能就让我感觉Nextron只是拥有NextJS生态的react+electron。作者说阉割是因为安全问题，而我个人认为这个功能可以不用，但是得存在，像我这种个人开发者并不担心什么安全性问题。
2. Nextron中不支持app route的写法，只支持传统的pages route，这就是为什么我的项目中使用的是pages route而不是ap route这是不好的，app route才是NextJS的未来。
3. Nextron只支持webpack打包，我个人认为在现在webpack作为打包工具唯一的优势应该就是其生态广阔，我个人还是更加喜欢vite打包。

***

### 运行

下载依赖：`npm install`

开发环境运行：`npm run dev`

注意`.env`文件在`/renderer`目录下，请补全后运行。

***

### 网页版

网页版通过vercel部署。

github：[Mebius1916/NextTalk\_web: NextTalk项目的网页版](https://github.com/Mebius1916/NextTalk_web "Mebius1916/NextTalk_web: NextTalk项目的网页版")

体验地址：[https://nexttalk.mebius.fun](https://nexttalk.mebius.fun/ "https://nexttalk.mebius.fun")

***

### 提交pr

可以参考我设置的`issue`，当然你有不错的想法也是可以的，不局限于我设置的`issue`。

如果有想法且不会配置`.env`的可以提`issue`，审核通过后给你发我自己的`.env`。

***

#### 免责申明

写该项目的初衷是因为我初学`react`和`nextjs`所以想自己从0到1写一个项目来熟悉语法，所以该项目代码难免会粗糙，各位当成小玩具看待就可以啦。

