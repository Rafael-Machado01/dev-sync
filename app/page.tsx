import NavBar from "@/app/components/NavBar";
import { tailwindData } from "@/app/constants/tailwindData";
import SideCard from "@/app/components/sidecard/SideCard";
import Modal from "./components/ui/Modal";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className={tailwindData.gridLayoutSync}>
        <aside className={tailwindData.gridLayoutLeftSide}>
          <SideCard />
        </aside>
        <main className={tailwindData.gridLayoutMain}></main>
        <aside className={tailwindData.gridLayoutRightSide}></aside>
      </div>
    </div>
  );
}
