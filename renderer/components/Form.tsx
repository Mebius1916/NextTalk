'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import { SessionData } from '../lib/type';
import { signIn, useSession } from 'next-auth/react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import mebius from '../public/images/mebius.jpg'
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
const Form = ({ type }: { type: string }) => {
  const { data: session } = useSession();
  const router = useRouter()
  const user = session?.user;
  const home = "home"
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [value, setValue] = useState("example@EMAIL");
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [code, setCode] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const isInvalid = useMemo(() => {
    if (value === "") return false;
    return validateEmail(value) ? false : true;
  }, [value]);

  const validatePassword = (password: string) => password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{3,}$/);
  const passwordInvalid = useMemo(() => {
    // 当密码为空时直接返回 false，表示不无效（即不是无效状态）
    if (password === "") return false;
    // 只有当有输入时，才检查是否匹配正则表达式
    return !validatePassword(password);
  }, [password]);


  // 验证用户名：只能包含英文字母和特定的特殊符号（例如: ._-）
  const validateUsername = (username: string) => /^[a-zA-Z0-9]+$/.test(username);
  const usernameInvalid = useMemo(() => {
    // 当用户名为空时直接返回 false，表示不无效（即不是无效状态）
    if (username === "") return false;
    // 只有当有输入时，才检查是否匹配正则表达式
    return !validateUsername(username);
  }, [username]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SessionData>();
  const onSubmit = async (data: SessionData) => {
    if (type === "register") {
      toast.info("Registering...");
      const allData = {
        ...data,
        code: code
      };
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allData),
        });
    
        if (res.ok) {
          router.push("/auth/login");
        } else {
          // 如果响应不成功，尝试解析错误信息
          const errorResponse = await res.json(); 
          if (errorResponse?.error) {
            toast.error(errorResponse.error);
          }
        }
      } catch (error) {
        // 处理网络或其他类型的错误
        console.error("Network or parsing error:", error);
        toast.error("Network or parsing error");
      }
    }

    if (type === "login") {
      toast.info("Logging in...");
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      })
      // console.log(res);
      if (res?.ok) {
        router.push(`/chats/toChat/${home}`);
      }
      if (res?.error) {
        toast.error(res.error);
      }
    }

    if (type === "reset") {
      toast.info("Resetting...");
      const allData = {
        ...data,
        code: code
      };
      try {
        const res = await fetch("/api/reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allData),
        });
        if (res.ok) {
          router.push("/auth/login");
        } else {
          // 处理可能的错误响应
          const errorResponse = await res.json(); 
          if (errorResponse?.error) {
            toast.error(errorResponse.error);
          }
        }
      } catch (error) {
        // 处理网络或其他类型的错误
        console.error("Network or parsing error:", error);
        toast.error("Network or parsing error");
      }
    }
    
  }
  useEffect(() => {
    if (user) router.push(`/chats/toChat/${home}`);
  }, [session]);

  let timerActive = false; // 记录定时器是否已激活
  let timerStart: number | null = null; // 记录定时器启动的时间戳

  const sendCode = async () => {
    if (isFirstTime) {
      setIsFirstTime(false);
      toast.info('Sending verification code...');
      await fetchVerificationCode();
      toast.success('Verification code sent successfully');
    } else {
      // 如果定时器已经启动，则显示剩余时间
      if (timerActive && timerStart) {
        const remainingTime = Math.round((60000 - (Date.now() - timerStart)) / 1000);
        toast.error(`Please wait for ${remainingTime} seconds and try again`);
        return;
      }
      // 激活定时器标志，并记录启动时间
      timerActive = true;
      timerStart = Date.now();
      // 设置定时器，一分钟后发送验证码
      setTimeout(async () => {
        toast.info('You can send the verification code again')
        setIsFirstTime(true);
        // 定时器结束后重置激活标志和启动时间
        timerActive = false;
        timerStart = null;
      }, 60000); // 60000 毫秒 = 1 分钟
    }
  };

  const fetchVerificationCode = async () => {
    const res = await fetch("/api/email/route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: value, username: username }),
    });
    if (res.ok) {
      const data = await res.json();
      setCode(data.validationCode);
    } else {
      toast.error('Failed to send verification code');
    }
  }
  return (
    <>
      <ToastContainer position="top-center" />
      {type === "login" &&
        <div className='bg-gradient-to-r from-indigo-500 relative h-screen' id='home'>
          <div className='bg-white rounded-3xl shadow-2xl h-96 w-80 border-2 
           border-secondary absolute top-0 right-0 bottom-0 left-0 m-auto overflow-y-hidden'>
            <form className='text-center '
              onSubmit={handleSubmit(onSubmit)}> {/*可让form里的元素都水平居中*/}
              <p className='text-center mt-4 font-sans text-lg antialiased font-medium'>Login</p>
              <div className="flex items-center justify-center"> {/* 添加这个容器 */}
                <Image
                  src={mebius}
                  alt="logo"
                  width={50}
                  height={50}
                  className='mt-2'
                />
              </div>
              <Input
                defaultValue=""
                {...register("email", {
                  required: "Email is required",
                }
                )}
                isClearable
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage="Please enter a valid email"
                onValueChange={setValue}
                onClear={() => console.log("input cleared")}
                className="max-w-72 m-auto mt-4"
              />
              <Input
                defaultValue=""
                {...register("password", {
                  required: "Password is required",
                })}
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                isInvalid={passwordInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage="Password must be at least 3 characters long and include letters, numbers, and symbols."
                onValueChange={setPassword}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="max-w-72 m-auto mt-1"
              />
              <Button color="secondary" variant="bordered" className='mt-2 w-72' type='submit'>
                Sign In
              </Button>
            </form>
            <div className='mt-2'>
              <Link href="/auth/register" className='text-base hover:text-purple-400'>
                <p className='text-center '>Don't have an account? Register Here</p>
              </Link>
            </div>
            <div className='mt-1 underline'>
              <Link href="/auth/reset" className='text-base hover:text-purple-400'>
                <p className='text-center text-small-bold'>Reset your password</p>
              </Link>
            </div>
          </div>
        </div>
      }{type === 'register' &&
        <div className='bg-gradient-to-r from-indigo-500 relative h-screen' id='home'>
          <div className='bg-white rounded-3xl shadow-2xl h-[25rem] w-80 border-2 
             border-secondary absolute top-0 right-0 bottom-0 left-0 m-auto box-border overflow-y-hidden'>
            <form className='text-center' onSubmit={handleSubmit(onSubmit)}> {/*可让form里的元素都水平居中*/}
              <p className='text-center mt-1 font-sans text-lg antialiased font-medium'>Register</p>
              <Input
                {...register("username", {
                  required: "User is required",
                })}
                isInvalid={usernameInvalid}
                color={usernameInvalid ? "danger" : "secondary"}
                errorMessage="Username can only contain letters and the special characters"
                onValueChange={setUsername}
                isClearable
                type="username"
                label="UserName"
                variant="bordered"
                placeholder="Enter your username"
                defaultValue=""
                onClear={() => console.log("input cleared")}
                className="max-w-72 m-auto mt-1"
              />
              <Input
                defaultValue=""
                {...register("email", {
                  required: "Email is required",
                }
                )}

                isClearable
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage="Please enter a valid email"
                onValueChange={setValue}
                onClear={() => console.log("input cleared")}
                className="max-w-72 m-auto mt-1"
              />
              <Input
                defaultValue=""
                {...register("password", {
                  required: "Password is required",
                })}
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                isInvalid={passwordInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage="Password must be at least 3 characters long and include letters, numbers, and symbols."
                onValueChange={setPassword}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="max-w-72 m-auto mt-1"
              />
              <div className='flex'>
                <Input
                  {...register("VerificationCode", {
                    required: "VerificationCode is required",
                  })}
                  onValueChange={setVerificationCode}//可以省略，因为不需要正则比较
                  type="VerificationCode"
                  label="VerificationCode"
                  variant="flat"
                  color="secondary"
                  placeholder="Please check your email"
                  defaultValue=""
                  className="max-w-72 m-auto mt-1 ml-4 "
                />
                <Button color="secondary" variant="shadow" size="sm" className='mr-4 mt-1 h-14 ml-2' onClick={sendCode}>
                  Send
                </Button>
              </div>
              <Button color="secondary" variant="bordered" className='mt-2 w-72' type='submit'>
                Sign Up
              </Button>
            </form>

            <div className='mt-3'>
              <Link href="/auth/login" className='text-base hover:text-purple-400'>
                <p className='text-center'>Already have an account? Sign In Here</p>
              </Link>
            </div>
          </div>
        </div>
      }{type === 'reset' &&
        <div className='bg-gradient-to-r from-indigo-500 relative h-screen' id='home'>
          <div className='bg-white rounded-3xl shadow-2xl h-[25rem] w-80 border-2 
             border-secondary absolute top-0 right-0 bottom-0 left-0 m-auto box-border overflow-y-hidden'>
            <form className='text-center' onSubmit={handleSubmit(onSubmit)}> {/*可让form里的元素都水平居中*/}
              <p className='text-center mt-1 font-sans text-lg antialiased font-medium'>Reset</p>
              <div className="flex items-center justify-center"> {/* 添加这个容器 */}
                <Image
                  src={mebius}
                  alt="logo"
                  width={50}
                  height={50}
                  className='mt-2'
                />
              </div>
              <Input
                defaultValue=""
                {...register("email", {
                  required: "Email is required",
                }
                )}

                isClearable
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage="Please enter a valid email"
                onValueChange={setValue}
                onClear={() => console.log("input cleared")}
                className="max-w-72 m-auto mt-2"
              />
              <Input
                defaultValue=""
                {...register("password", {
                  required: "Password is required",
                })}
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                isInvalid={passwordInvalid}
                color={isInvalid ? "danger" : "secondary"}
                errorMessage="Password must be at least 3 characters long and include letters, numbers, and symbols."
                onValueChange={setPassword}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="max-w-72 m-auto mt-1"
              />
              <div className='flex'>
                <Input
                  {...register("VerificationCode", {
                    required: "VerificationCode is required",
                  })}
                  onValueChange={setVerificationCode}
                  type="VerificationCode"
                  label="VerificationCode"
                  variant="flat"
                  color="secondary"
                  placeholder="Please check your email"
                  defaultValue=""
                  className="max-w-72 m-auto mt-1 ml-4 "
                />
                <Button color="secondary" variant="shadow" size="sm" className='mr-4 mt-1 h-14 ml-2' onClick={sendCode}>
                  Send
                </Button>
              </div>
              <Button color="secondary" variant="bordered" className='mt-3 w-72' type='submit'>
                Reset
              </Button>
            </form>

            <div className='mt-2'>
              <Link href="/auth/login" className='text-base hover:text-purple-400'>
                <p className='text-center text-small-bold underline'>Go back to login page</p>
              </Link>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Form
