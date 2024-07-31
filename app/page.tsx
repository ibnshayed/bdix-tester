"use client";

import { uuid } from "@/common/utils/uuid";
import { bdixServerList } from "@/data";
import { ConfigProvider, Progress } from "antd";
import { useState } from "react";

type ServerList = {
  id: string;
  url: string;
  status: string;
};

const checkSiteAccessibility = async (url: string) => {
  try {
    const response = await fetch(`/api/proxy?url=${url}`);
    const data = await response.json();
    return data.status;
  } catch (error: any) {
    return false;
  }
};

export default function Home() {
  const [data, setData] = useState<{
    active: ServerList[];
    inactive: ServerList[];
  }>({
    active: [],
    inactive: [],
  });

  const [urlStatus, setUrlStatus] = useState<string>("all");

  const handleStart = async () => {
    setData({
      active: [],
      inactive: [],
    });

    for (let url of bdixServerList) {
      const status = (await checkSiteAccessibility(url))
        ? "Active"
        : "Inactive";

      const newData = {
        id: uuid(),
        url,
        status,
      };

      if (status === "Active") {
        setData((preState) => ({
          ...preState,
          active: [...preState.active, newData],
        }));
      } else {
        setData((preState) => ({
          ...preState,
          inactive: [...preState.inactive, newData],
        }));
      }
    }
  };

  return (
    <main className="w-full md:w-4/5 mx-auto min-h-screen flex flex-col items-center space-y-10 relative">
      <div className="bg-blue-50 w-full h-[400px] flex flex-col justify-center items-center space-y-5">
        <h1 className="text-xl md:text-4xl font-bold">BDIX Server Tester</h1>

        <ConfigProvider
          theme={{
            components: {
              Progress: {
                circleTextFontSize: ".5em",
              },
            },
          }}
        >
          <Progress
            type="dashboard"
            trailColor="rgba(0, 0, 0, 0.06)"
            steps={10}
            strokeWidth={20}
            format={() =>
              `${[...data.active, ...data.inactive].length}/${
                bdixServerList.length
              }`
            }
            percent={Math.round(
              ([...data.active, ...data.inactive].length /
                bdixServerList.length) *
                100
            )}
            size={200}
          />
        </ConfigProvider>

        <button
          className="bg-blue-500 px-20 py-3 rounded-full text-white text-xl font-bold shadow-md uppercase"
          onClick={handleStart}
        >
          Start
        </button>
      </div>

      <div className="flex">
        <p className="bg-green-500 text-white px-5 py-1 rounded-s-full">
          Active: {[...data.active].length}
        </p>
        <p className="bg-red-500 text-white px-5 py-1 rounded-e-full">
          Inactive: {[...data.inactive].length}{" "}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <p>Status:</p>
        <select
          name="urlStatus"
          className="w-40 text-black mt-1 rounded-md text-xs"
          onChange={(e) => setUrlStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <table className="w-full text-left border-collapse border-[.5px]">
        <thead>
          <tr className="bg-black text-white text-lg">
            <th className="w-4/5 px-5 py-2">Server</th>
            <th className="w-1/5 px-5 py-2">
              <p>Status</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {(urlStatus === "active"
            ? [...data.active]
            : urlStatus === "inactive"
            ? [...data.inactive]
            : [...data.active, ...data.inactive]
          ).map((item, index) => (
            <tr key={item.id} className="even:bg-gray-100">
              <td className="max-w-0 px-5 py-2 truncate">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 hover:underline"
                >
                  {index + 1}. {item.url}
                </a>
              </td>
              <td
                className={`px-5 py-3 text-center text-sm font-bold ${
                  item.status === "Active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer>
        <div className="w-screen bg-black text-center py-2 left-0 bottom-0 fixed">
          <span className="text-sm text-white">
            Made by ❤️{" "}
            <a
              href="https://www.facebook.com/ibnshayed"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Emran Ibn Shayed
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
