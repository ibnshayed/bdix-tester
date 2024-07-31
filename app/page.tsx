"use client";

import { uuid } from "@/common/utils/uuid";
import { bdixServerList } from "@/data";
import { ConfigProvider, Progress } from "antd";
import { SetStateAction, useState } from "react";

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
  const [data, setData] = useState<ServerList[]>([]);
  const [allData, setAllData] = useState<ServerList[]>([]);
  const [dataStatus, setDataStatus] = useState({
    active: 0,
    inactive: 0,
  });

  const handleStart = async () => {
    setData([]);
    setAllData([]);

    const tempData: SetStateAction<ServerList[]> = [];

    for (let url of bdixServerList) {
      const status = (await checkSiteAccessibility(url))
        ? "Active"
        : "Inactive";

      const newData = {
        id: uuid(),
        url,
        status,
      };
      tempData.push(newData);

      setData((preState) => [...preState, newData]);
      setAllData((preState) => [...preState, newData]);
      setDataStatus((preState) =>
        status === "Active"
          ? { ...preState, active: preState.active + 1 }
          : { ...preState, inactive: preState.inactive + 1 }
      );
    }
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    if (status === "all") {
      setData([...allData]);
    } else {
      const filteredData = allData.filter((item) => item.status === status);
      setData(filteredData);
    }
  };

  return (
    <main className="w-full md:w-4/5 mx-auto min-h-screen flex flex-col items-center space-y-10 relative">
      <div className="bg-blue-50 w-full h-[400px] flex flex-col justify-center items-center space-y-5">
        <h1 className="text-4xl font-bold">BDIX Server Tester</h1>

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
            format={() => `${data.length}/${bdixServerList.length}`}
            percent={Math.round((data.length / bdixServerList.length) * 100)}
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
          Active: {dataStatus.active}
        </p>
        <p className="bg-red-500 text-white px-5 py-1 rounded-e-full">
          Inactive: {dataStatus.inactive}{" "}
        </p>
      </div>
      <table className="w-full text-left border-collapse border-[.5px] overflow-auto">
        <thead>
          <tr className="bg-black text-white text-lg">
            <th className="w-3/5 px-5 py-2">Server</th>
            <th className="w-2/5 px-5 py-2 flex space-x-2">
              <span>Status</span>
              {allData.length === bdixServerList.length && (
                <select
                  name="status"
                  className="text-black text-sm"
                  onChange={handleStatus}
                >
                  <option value="all">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="even:bg-gray-100">
              <td className="px-5 py-3 overflow-hidden">
                <span>{index + 1}.</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 hover:text-blue-500 hover:underline"
                >
                  {item.url}
                </a>
              </td>
              <td className={`px-5 py-3`}>
                <span
                  className={`px-2 py-1 w-32 inline-block text-center text-sm text-white font-bold rounded-full ${
                    item.status === "Active" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {item.status}
                </span>
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
