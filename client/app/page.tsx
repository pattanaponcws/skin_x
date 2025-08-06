"use client";
import { useEffect, useRef, useState } from "react";
import { getPosts, getPostById, getPostByTags } from "./lib/posts";
import { useAuth } from "./components/auth-povider";
import { FaLock } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

interface TagProp {
  id: number;
  name: string;
}

interface TagsProp {
  postId: number;
  tagsId: number;
  tag: TagProp;
}

interface PostProp {
  id: number;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  tags: TagsProp[];
}

export default function Home() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [authorSelect, setAuthorSelect] = useState<string>("");
  const [tags, setTags] = useState<TagProp[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [posts, setPosts] = useState<PostProp[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [postSelect, setPostSelect] = useState<PostProp | null>(null);
  const [postSelectStatus, setPostSelectStatus] = useState<number>();
  const [postSelectLoading, setPostSelectLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const postsPerPage = 20;
  const totalPages = Math.ceil(total / postsPerPage);

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tagName));
    } else {
      setSelectedTags((prev) => [...prev, tagName]);
    }
    setSearch("");
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTags.includes(tag.name)
  );

  const handleFocus = () => setShowDropdown(true);
  const handleBlur = () => {
    // ใช้ setTimeout เพื่อให้ click ด้านใน dropdown ทำงานก่อน blur
    setTimeout(() => setShowDropdown(false), 150);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoad(true);
      try {
        const { posts, total, allTags } = await getPosts(page);
        setPosts(posts);
        setTotal(total);
        setTags(allTags);
      } catch (error) {
        setErr(error as string);
      } finally {
        setLoad(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    setPostSelect(null);
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoad(true);
      try {
        if (selectedTags.length === 0) {
          const { posts, total } = await getPosts(page);
          setPosts(posts);
          setTotal(total);
          return;
        }
        const { posts, total } = await getPostByTags(
          authorSelect,
          selectedTags
        );
        setPosts(posts);
        setTotal(total);
      } catch (error) {
        setErr(error as string);
      } finally {
        setLoad(false);
      }
    };

    fetchPosts();
    console.log(totalPages);
  }, [page, selectedTags]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
    window.scrollTo(0, 0);
  };

  const handleSelectPost = async (id: number) => {
    setPostSelectLoading(true);
    try {
      const { post, status } = await getPostById(id);
      setPostSelectStatus(status);
      setPostSelect(post);
    } catch (error) {
      console.log(error);
    } finally {
      setPostSelectLoading(false);
    }
  };

  return (
    <div className=" w-full h-full mb-20">
      {load ? (
        <div className=" w-full h-screen flex items-center justify-center">
          <h1>Loading...</h1>
        </div>
      ) : err.length > 0 ? (
        <h1>Someting have err,please try again</h1>
      ) : (
        <div className="mx-10">
          {/* Author Section */}
          <div className=" flex items-center space-x-10 my-5">
            {/* <div>
              {authorSelect.length > 0 && (
                <div className=" flex items-center space-x-10 my-5">
                  <div className="h-full  text-2xl font-bold flex items-center space-x-2">
                    <span>Author:</span>
                    <div className="relative bg-black text-white px-3 py-1 rounded-full flex items-center space-x-2">
                      <span>{authorSelect}</span>
                      <button
                        onClick={() => setAuthorSelect("")}
                        className=" absolute -top-2 -right-2 w-5 h-5 cursor-pointer rounded-full bg-white text-black text-sm font-bold flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition"
                        aria-label="Remove author"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div> */}
            {/* Search Section */}
            <div className=" w-full relative">
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-black text-white px-3 font-bold py-1 rounded-full flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => toggleTag(tag)}
                      className="text-white hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={inputRef}
                type="text"
                className="w-full border py-2 px-3 rounded"
                placeholder="Search tags"
                value={search}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Dropdown List */}
              {showDropdown && (
                <ul className="absolute z-10 bg-white border w-full rounded shadow max-h-40 overflow-y-auto mt-1">
                  {(search
                    ? filteredTags
                    : tags.filter((t) => !selectedTags.includes(t.name))
                  ).map((tag) => (
                    <li
                      key={tag.id}
                      className="flex space-x-4 items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => toggleTag(tag.name)}
                    >
                      <span className="text-gray-800">{tag.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className=" flex  space-x-10 ">
            <div className="w-1/3 h-full overflow-hidden ">
              {posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <div
                      onClick={() => handleSelectPost(post.id)}
                      key={post.id}
                      className={` border-2 border-gray-300 rounded-2xl p-5 mb-10 hover:border-gray-500 cursor-pointer ${
                        post.id === postSelect?.id
                          ? "border-gray-500 border-3"
                          : ""
                      }`}
                    >
                      <div>
                        <h1 className=" text-lg font-bold ">{post.title}</h1>

                        <span
                          onClick={() => setAuthorSelect(post.postedBy)}
                          className=" text-gray-400  hover:underline hover:text-black"
                        >
                          {post.postedBy}
                        </span>
                        <div className="flex gap-2 my-3 flex-wrap">
                          {post.tags.map((tagGroup) => (
                            <div
                              key={tagGroup.tag.id}
                              className=" p-2 bg-black text-white rounded-xl text-sm font-bold"
                            >
                              {tagGroup.tag.name}
                            </div>
                          ))}
                        </div>

                        <p className=" text-gray-400 ">
                          {new Date(post.postedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center mt-4 gap-2 flex-wrap">
                    <button
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                      className="px-3 py-1 text-gray-300 font-bold disabled:opacity-50 cursor-pointer hover:text-black"
                    >
                      ย้อนกลับ
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          // แสดงเฉพาะหน้าใกล้ๆ page ปัจจุบัน เช่น page-2 ถึง page+2
                          p >= Math.max(1, page - 2) &&
                          p <= Math.min(totalPages, page + 2)
                      )
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`px-3 py-1 rounded cursor-pointer ${
                            page === p
                              ? "bg-black text-white"
                              : "hover:bg-gray-300"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                    <button
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                      className="px-3 py-1 text-gray-300 font-bold disabled:opacity-50 cursor-pointer hover:text-black"
                    >
                      ถัดไป
                    </button>
                  </div>
                </>
              ) : (
                <div className=" flex items-center justify-center w-full h-full">
                  <h1>No Post</h1>
                </div>
              )}
            </div>
            <div className="w-2/3 relative">
              <div className="sticky top-20 h-screen">
                {postSelectLoading ? (
                  <div className=" flex items-center justify-center w-full h-full">
                    Loading...
                  </div>
                ) : user == undefined ? (
                  <div className="w-full bg-gray-200 rounded-2xl h-full flex items-center justify-center">
                    <div className="flex items-center justify-center h-full flex-col space-y-10">
                      <FaLock className="text-5xl text-gray-800" />
                      <h1 className="text-2xl text-gray-800 font-extrabold">
                        เข้าสู่ระบบเพื่อดูข้อมูลของโพส
                      </h1>
                    </div>
                  </div>
                ) : postSelect == null ? (
                  <div className="w-full bg-gray-200 rounded-2xl h-full flex items-center justify-center">
                    <div className="flex items-center justify-center h-full space-y-10">
                      <div className=" flex flex-row items-center justify-center">
                        <IoMdArrowRoundBack className="text-5xl text-gray-800" />
                        <h1 className="text-2xl text-gray-800 font-extrabold">
                          เลือกโพสเพื่อดูรายละเอียด
                        </h1>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className=" w-full h-full overflow-y-scroll relative">
                    <div className=" flex flex-col space-y-5 pb-30">
                      <h1 className=" text-4xl font-bold">
                        {postSelect.title}
                      </h1>
                      <p className=" text-gray-500 font-semibold">
                        Author : {postSelect.postedBy}
                      </p>
                      <p className=" text-gray-500 font-semibold">
                        Date : {postSelect.postedAt}
                      </p>
                      <div
                        dangerouslySetInnerHTML={{ __html: postSelect.content }}
                        className="prose"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
