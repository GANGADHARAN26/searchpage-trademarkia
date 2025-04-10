"use client";
import {
  AlignJustify,
  Camera,
  Dot,
  FlaskRound,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Error from "./components/Error";
import Mark from "../../public/mark.png";
import Image from "next/image";
import Sidebar from "./components/Sidebar";

// Types
interface TrademarkHit {
  _id: string;
  _source: {
    law_firm: string;
    status_type: string;
    registration_number: string;
    search_bar: {
      owner: string;
    };
    mark_description_description?: string[];
    class_codes: string[];
    first_use_anywhere_date?: string;
  };
}

interface AggregationBucket {
  key: string;
  doc_count: number;
}

interface APIResponse {
  body: {
    hits: {
      hits: TrademarkHit[];
    };
    aggregations: {
      current_owners?: { buckets: AggregationBucket[] };
      attorneys?: { buckets: AggregationBucket[] };
      law_firms?: { buckets: AggregationBucket[] };
    };
  };
}

interface Status {
  label: string;
  color: string;
}

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const statuses: Status[] = [
    { label: "All", color: "bg-blue-500" },
    { label: "Registered", color: "bg-green-500" },
    { label: "Pending", color: "bg-yellow-400" },
    { label: "Abandoned", color: "bg-red-500" },
    { label: "Others", color: "bg-gray-500" },
  ];

  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [owners, setOwners] = useState<AggregationBucket[]>([]);
  const [lawFirms, setLawFirms] = useState<AggregationBucket[]>([]);
  const [attorneys, setAttorneys] = useState<AggregationBucket[]>([]);
  const [grid, setGrid] = useState<boolean>(true);
  const [arr, setArr] = useState<TrademarkHit[]>([]);
  const [sidebar, setSidebar] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://vit-tm-task.api.trademarkia.app/api/v3/us",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input_query: "check",
              input_query_type: "",
              sort_by: "default",
              status: [],
              exact_match: false,
              date_query: false,
              owners: [],
              attorneys: [],
              law_firms: [],
              mark_description_description: [],
              classes: [],
              page: 1,
              rows: 10,
              sort_order: "desc",
              states: [],
              counties: [],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const result: APIResponse = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setAttorneys(data?.body.aggregations.attorneys?.buckets || []);
    setOwners(data?.body.aggregations.current_owners?.buckets || []);
    setLawFirms(data?.body.aggregations.law_firms?.buckets || []);
    setArr(data?.body.hits.hits || []);
  }, [data]);

  useEffect(() => {
    const checkScreenSize = () => {
      setGrid(window.innerWidth < 1480);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="py-5 px-2 xl:px-5 items-center sm:flex sm:justify-between border-b-2 border-b-gray-300 shadow-sm">
        <div className={`${grid && "flex justify-between px-4"}`}>
          <div className="text-xl xl:text-3xl font-semibold text-gray-700 items-center pb-3">
            <span className="text-blue-700">Trade</span>
            <span className="text-black">mark</span>
            <span className="text-orange-500">ia</span>
          </div>
          {grid && <AlignJustify onClick={() => setSidebar(!sidebar)} />}
        </div>
        <div className="flex items-center gap-3 md:justify-center">
          <div className="flex items-center gap-4 border-1 p-4 rounded-2xl border-gray-300">
            <Search className="hidden md:block" />
            <input
              type="text"
              placeholder="Search"
              className="w-[60vw] md:w-[40vw] border-0 outline-none"
            />
            <Camera className="hidden md:block" />
          </div>
          <button className="bg-[#4380EC] p-4 px-6 rounded-2xl text-white">
            Search
          </button>
        </div>
        <div>
          <button className="bg-[#E6670D] p-4 px-6 rounded-2xl text-white hidden xl:block">
            Apply for Trademark
          </button>
        </div>
      </div>

      <div>
        {loading && <Loading />}
        {error && <Error />}

        {!grid && (
          <div className="flex pt-3">
            <div className="w-[69vw] flex justify-between px-9 border-1 mx-4 p-3 rounded-xl border-gray-300 font-semibold">
              <p>Mark</p>
              <p>Status</p>
              <p>Details</p>
              <p>Registration Number</p>
              <p>Class / Description</p>
            </div>
          </div>
        )}

        <div className="md:flex">
          <div className="sm:w-[71vw] md:w-[100vw] xl:w-[71vw]">
            {arr?.map((e) => (
              <div
                key={e._id}
                className={`${
                  !grid && "flex justify-between"
                } border-1 m-4 p-3 rounded-2xl border-gray-300`}
              >
                <div className={`flex ${grid && "justify-between"}`}>
                  {!grid && (
                    <Image src={Mark} alt="mark" height={100} width={100} />
                  )}
                  {grid && (
                    <div className="text-xl font-semibold p-4">
                      {e._source.law_firm}
                    </div>
                  )}
                  <div
                    className={`flex-col justify-center items-center gap-1 p-2 ${
                      !grid && "p-5"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1 text-green-400 ${
                        !grid && "justify-center"
                      }`}
                    >
                      <Dot className="text-4xl" />
                      {" Live / " + e._source.status_type}
                    </div>
                    <p className="flex items-center gap-1 justify-center">
                      On{" "}
                      {(() => {
                        const raw =
                          e._source.first_use_anywhere_date?.toString();
                        if (!raw || raw.length !== 8) return "N/A";

                        const year = raw.slice(0, 4);
                        const month = raw.slice(4, 6);
                        const day = raw.slice(6, 8);

                        const date = new Date(`${year}-${month}-${day}`);
                        return date.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className={`p-5 ${!grid && "w-[20vw]"}`}>
                    <p>{e._source.law_firm}</p>
                    <p>{e._source.search_bar.owner}</p>
                  </div>
                  <div className="flex justify-center items-center gap-2 p-5">
                    {e._source.registration_number}
                  </div>
                </div>

                <div className={`${!grid && "flex py-5 flex-col items-center"}`}>
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    className={`px-5 text-sm ${!grid && "w-[20vw]"}`}
                  >
                    {e._source.mark_description_description?.[0]}
                  </p>
                  <p
                    className="px-5 text-sm flex gap-2 items-center"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={e._source.class_codes
                      .map((code) => `Class ${code}`)
                      .join(", ")}
                  >
                    {e._source.class_codes.slice(0, 4).map((code, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 shrink-0"
                      >
                        <FlaskRound className="w-4 h-4 text-gray-500" />
                        Class {code}
                        {idx < 3 && idx < e._source.class_codes.length - 1 && ","}
                      </span>
                    ))}
                    {e._source.class_codes.length > 4 && <span>, ...</span>}
                  </p>
                </div>

                {grid && (
                  <div className="p-5">
                    <button className="border-2 border-blue-500 p-4 px-9 rounded-2xl text-blue-500 hover:bg-blue-500 hover:text-white">
                      View
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
