"use client";
import Loader from "../../../components/Loader";
import { GroupOutlined, PersonOutline } from "@mui/icons-material";
import { CldUploadButton } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { chatData, SessionData } from "../../../lib/type";
interface GroupInfo {
  name: string;
  groupPhoto: string;
}

const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<chatData>({
    _id:'',
    members: [],
    messages: [],
    isGroup: false,
    createdAt: new Date(),
    lastMessageAt: new Date(),
  });

  const { chatId } = useParams()??{};

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}/route`);
      const data = await res.json();
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadPhoto = (result:any) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const router = useRouter();

  const updateGroupChat  = async (data:GroupInfo) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (res.ok) {
        router.push(`/chats/toChat/${chatId}`);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="mt-2 flex flex-col gap-11 items-center justify-center">
      <h1 className="text-heading3-bold">Edit Group Info</h1>

      <form className="flex flex-col gap-9" onSubmit={handleSubmit(updateGroupChat as any)}>
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl cursor-pointer shadow-2xl">
          <input
            {...register("name", {
              required: "Group chat name is required",
            })}
            type="text"
            placeholder="Group chat name"
            className="w-64 max-sm:w-full outline-none"
          />
          <GroupOutlined sx={{ color: "#737373" }} />
        </div>
        {errors?.name && <p className="text-red-500">{errors.name.message as ReactNode}</p>}
        <div className="flex items-center justify-between">
          <img
            src={watch("groupPhoto") || "/images/group.png"}
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={uploadPhoto}
            uploadPreset="kdm7bzdm"
          >
            <p className="text-body-bold ">Upload new photo</p>
          </CldUploadButton>
        </div>

        <div className="flex flex-row flex-wrap content-start overflow-y-auto gap-1 h-10">
          {chat?.members?.map((member:SessionData, index) => (

            <p className="text-small-bold p-2 border-1 border-purple-500 rounded-md bg-white" key={index}>{member.username}</p>
          ))}
        </div>

        <button className="flex items-center justify-center rounded-xl p-3 bg-gradient-to-l from-blue-1 to-blue-3 text-body-bold text-white" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default GroupInfo;
