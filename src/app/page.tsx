"use client";
import { AlignJustify, Camera, Dot, FlaskRound, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Error from "./components/Error";
import Mark from "../../public/mark.png";
import Image from "next/image";
import Modal from "./components/Model";
import Sidebar from "./components/Sidebar";
import { Analytics } from "@vercel/analytics/react"
interface Status {
  label: string;
  color: string;
}

interface SearchBarData {
  owner: string;
}

interface Source {
  law_firm: string;
  law_firm_cleaned: string;
  status_type: string;
  first_use_anywhere_date?: string;
  search_bar: SearchBarData;
  registration_number: string;
  mark_description_description?: string[];
  class_codes: string[];
  current_owner: string;
  current_owner_cleaned: string;
  attorney_name: string;
  attorney_name_cleaned: string;
}

interface Hit {
  _id: string;
  _source: Source;
}

interface Bucket {
  key: string;
  doc_count: number;
}

interface Aggregations {
  attorneys: { buckets: Bucket[] };
  current_owners: { buckets: Bucket[] };
  law_firms: { buckets: Bucket[] };
}

interface ApiResponse {
  body: {
    aggregations: Aggregations;
    hits: {
      hits: Hit[];
    };
  };
}

// interface ErrorProps {
//   error: string;
// }

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedLawFirms, setSelectedLawFirms] = useState<string[]>([]);
  const [selectedAttorneys, setSelectedAttorneys] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const statuses: Status[] = [
    { label: "All", color: "bg-blue-500" },
    { label: "Registered", color: "bg-green-500" },
    { label: "Pending", color: "bg-yellow-400" },
    { label: "Abandoned", color: "bg-red-500" },
    { label: "Others", color: "bg-gray-500" },
  ];

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [owners, setOwners] = useState<Bucket[]>([]);
  const [lawFirms, setLawFirms] = useState<Bucket[]>([]);
  const [attorneys, setAttorneys] = useState<Bucket[]>([]);
  const [grid, setGrid] = useState<boolean>(true);
  const [arr, setArr] = useState<Hit[]>([]);
  const [sidebar, setSidebar] = useState<boolean>(false);

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
          console.log("Something went wrong");
        }

        const result = await response.json();
        setData(result as ApiResponse);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterData = (data: ApiResponse | null) => {
    if (!data) return [];
    
    let filteredHits = data.body.hits.hits;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filteredHits = filteredHits.filter(hit => {
        const source = hit._source;
        return (
          source.law_firm?.toLowerCase().includes(query) ||
          source.current_owner?.toLowerCase().includes(query) ||
          source.attorney_name?.toLowerCase().includes(query) ||
          source.registration_number?.toLowerCase().includes(query) ||
          source.mark_description_description?.some(desc => 
            desc?.toLowerCase().includes(query)
          ) ||
          source.search_bar.owner?.toLowerCase().includes(query)
        );
      });
    }

    // Filter by status
    if (selectedStatus !== "All") {
      filteredHits = filteredHits.filter(hit => {
        const status = hit._source.status_type;
        switch (selectedStatus) {
          case "Registered":
            return status === "registered";
          case "Pending":
            return status === "pending";
          case "Abandoned":
            return status === "abandoned";
          case "Others":
            return !["registered", "pending", "abandoned"].includes(status);
          default:
            return true;
        }
      });
    }

    // Filter by owners
    if (selectedOwners.length > 0) {
      filteredHits = filteredHits.filter(hit => 
        selectedOwners.includes(hit._source.current_owner_cleaned)
      );
    }

    // Filter by law firms
    if (selectedLawFirms.length > 0) {
      filteredHits = filteredHits.filter(hit => 
        selectedLawFirms.includes(hit._source.law_firm_cleaned)
      );
    }

    // Filter by attorneys
    if (selectedAttorneys.length > 0) {
      filteredHits = filteredHits.filter(hit => 
        selectedAttorneys.includes(hit._source.attorney_name_cleaned)
      );
    }

    return filteredHits;
  };

  useEffect(() => {
    if (data) {
      setAttorneys(data.body.aggregations.attorneys.buckets || []);
      setOwners(data.body.aggregations.current_owners.buckets || []);
      setLawFirms(data.body.aggregations.law_firms.buckets || []);
      setArr(filterData(data));
    }
  }, [data, selectedStatus, selectedOwners, selectedLawFirms, selectedAttorneys, searchQuery]);

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
      <Analytics />
      <div className="py-5 px-2 xl:px-5 items-center sm:flex sm:justify-between border-b-2 border-b-gray-300 shadow-sm">
        <div className={`${grid && "flex justify-between px-4"}`}>
          <div className="text-xl xl:text-3xl font-semibold text-gray-700 items-center pb-3">
            <span className="text-blue-700">Trade</span>
            <span className="text-black">mark</span>
            <span className="text-orange-500">ia</span>
          </div>
          {grid && <AlignJustify onClick={() => setSidebar(!sidebar)} className="xl:hidden"/>}
        </div>
        <div className="flex items-center gap-3 md:justify-center">
          <div className="flex items-center gap-4 border-1 p-4 ml-2 rounded-2xl border-gray-300">
            <Search className="hidden md:block" />
            <input
              type="text"
              placeholder="Search"
              className="w-[58vw] md:w-[40vw] border-0 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(e.currentTarget.value);
                }
              }}
            />
            <Camera className="hidden md:block" />
          </div>
          <button 
            className="bg-[#4380EC] p-4  xl:px-6 rounded-2xl text-white"
            onClick={() => setSearchQuery(searchQuery)}
          >
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
        {error && <Error error={error} />}
        {!grid && (
          <div className="flex pt-3">
            <div className="w-[69vw] flex justify-between px-9 border-1 mx-4 p-3 rounded-xl border-gray-300 font-semibold">
              <p>Mark</p>
              <p>Status</p>
              <p>Details</p>
              <p>Registration Number</p>
              <p>Class / Description</p>
            </div>
            <div className="w-[25vw] flex px-5 items-center text-gray-400 text-sm"></div>
          </div>
        )}
        <div className="md:flex">
          <div className="sm:w-[71vw] md:w-[100vw] xl:w-[71vw]">
            {arr?.map((e: Hit) => (
              <span key={e._id}>
                <div
                  className={`${
                    !grid && "flex justify-between"
                  } border-1 m-4 p-3 rounded-2xl border-gray-300`}
                >
                  <div className={`flex ${grid && "justify-between"}`}>
                    {!grid && (
                      <Image src={Mark} alt="mark" height={100} width={100} />
                    )}
                    {grid && (
                      <div className="text-xl text-shadow-amber-100 font-semibold p-4">
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
                          const raw = e._source.first_use_anywhere_date?.toString();
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
                        .map((code: string) => `Class ${code}`)
                        .join(", ")}
                    >
                      {e._source.class_codes.slice(0, 4).map((code: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 shrink-0"
                        >
                          <FlaskRound className="w-4 h-4 text-gray-500" />
                          Class {code}
                          {idx < 3 &&
                            idx < e._source.class_codes.length - 1 &&
                            ","}
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
              </span>
            ))}
          </div>
          {sidebar ? (
            <Modal isOpen={sidebar} handleClose={() => setSidebar(false)}>
              <Sidebar
                sidebar={sidebar}
                setSidebar={setSidebar}
                statuses={statuses}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                owners={owners}
                lawFirms={lawFirms}
                attorneys={attorneys}
                grid={grid}
                setGrid={setGrid}
                selectedOwners={selectedOwners}
                setSelectedOwners={setSelectedOwners}
                selectedLawFirms={selectedLawFirms}
                setSelectedLawFirms={setSelectedLawFirms}
                selectedAttorneys={selectedAttorneys}
                setSelectedAttorneys={setSelectedAttorneys}
              />
            </Modal>
          ) : (
            <Sidebar
              sidebar={sidebar}
              setSidebar={setSidebar}
              statuses={statuses}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              owners={owners}
              lawFirms={lawFirms}
              attorneys={attorneys}
              grid={grid}
              setGrid={setGrid}
              selectedOwners={selectedOwners}
              setSelectedOwners={setSelectedOwners}
              selectedLawFirms={selectedLawFirms}
              setSelectedLawFirms={setSelectedLawFirms}
              selectedAttorneys={selectedAttorneys}
              setSelectedAttorneys={setSelectedAttorneys}
            />
          )}
        </div>
      </div>
    </div>
  );
} 