import Modal from "./Model";
import {OrbitProgress} from "react-loading-indicators"
// app/dashboard/loading.tsx
export default function Loading() {
    return (<Modal isOpen={true} handleClose={() => {}}>
      <p className="flex justify-center items-center text-center text-gray-500 w-full h-full p-20">
      <OrbitProgress dense color="#E6670D" size="medium" text="" textColor="" />
      </p>
    </Modal>);
  }
  