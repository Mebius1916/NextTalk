"use client";
import Loader from "../../components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import {Button} from "@nextui-org/react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { SessionData } from "../../lib/type";
import { useRouter } from 'next/navigation'
const Profile = () => {
  const router = useRouter();
  const home = "home"
  const { data: session } = useSession();
  const user = session?.user as SessionData;
  const [loading, setLoading] = useState(true);//加载中。。。
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageError = () => {
    if (imageRef.current) {
      imageRef.current.src = user?.image || "/images/person.jpg";
    }
  };

  useEffect(() => {

    if (imageRef.current) {
      imageRef.current.onerror = handleImageError;//给onerror绑定处理函数

    }
  }, [user?.image]);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.image,
      });
    }
    setLoading(false);//加载完成
  }, [user]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors: error },

  } = useForm();

  const uploadPhoto = (result: any) => {
    setValue("profileImage", result?.info?.secure_url);
  };
  const updateUser = async (data: SessionData) => {
    setLoading(true);//加载中。。。
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);//加载完成
      if(res.ok){
        router.push(`/chats/toChat/${home}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="mt-16 flex flex-col gap-11 items-center justify-center">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="flex flex-col gap-9" onSubmit={handleSubmit(updateUser as SubmitHandler<FieldValues>)}>
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl cursor-pointer shadow-2xl ">
        <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="w-64 max-sm:w-full outline-none"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {error?.username && (
          <p className="text-red-500">{error.username.message as ReactNode}</p>
        )}

        <div className="flex items-center">
          <img
            ref={imageRef}
            src={
              watch("profileImage") ||
              user?.image ||
              "/images/person.jpg"
            }
            alt="profile"
            className="w-20 h-20 rounded-full my-10"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={uploadPhoto}
            uploadPreset="kdm7bzdm"

          >
            <p className="text-body-bold ml-16">Upload new photo</p>
          </CldUploadButton>
        </div>

        <Button color="secondary" variant="bordered" type="submit" className="w-80">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Profile;
