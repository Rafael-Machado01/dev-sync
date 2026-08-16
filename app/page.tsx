import NavBar from "@/app/components/NavBar";
import { tailwindData } from "@/app/constants/tailwindData";
import SideCard from "@/app/components/sidecard/SideCard";
import Posts from "@/app/components/posts/Posts";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className={tailwindData.gridLayoutSync}>
        <aside className={`${tailwindData.gridLayoutLeftSide}  z-9999`}>
          <SideCard />
        </aside>
        <main className={tailwindData.gridLayoutMain}>
          <Posts />
        </main>
        <aside className={tailwindData.gridLayoutRightSide}></aside>
      </div>
    </div>
  );
}
