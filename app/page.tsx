import NavBar from "@/app/components/NavBar";
import { tailwindData } from "@/app/constants/tailwindData";
import SideCard from "@/app/components/sidecard/SideCard";
import Posts from "@/app/components/posts/Posts";
import getCurrentUser from "./lib/auth-user";
import NewPost from "./components/posts/NewPost";
import { getAllPosts } from "./actions";

export default async function Home() {
  const isAuth = await getCurrentUser();
  const allPosts = await getAllPosts();
  return (
    <div>
      <NavBar isAuth={isAuth} />
      <div className={tailwindData.gridLayoutSync}>
        <aside className={`${tailwindData.gridLayoutLeftSide}  z-9999`}>
          <SideCard isAuth={isAuth} />
        </aside>
        <main className={tailwindData.gridLayoutMain}>
          {isAuth && <NewPost isAuth={isAuth} />}
          <Posts posts={allPosts} isAuth={isAuth} />
        </main>
        <aside className={tailwindData.gridLayoutRightSide}>
          <span>a</span>
        </aside>
      </div>
    </div>
  );
}
