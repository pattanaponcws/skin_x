import axios from "axios";

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
interface PostSelectProp {
  post: PostProp;
  status: number;
}

interface PostPropsAllData {
  posts: PostProp[];
  total: number;
  allTags: TagProp[];
}

export const getPostByTags = async (author: string, tags: string[]) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL_POST}/tags`,
    {
      params: {
        author: author,
        tags: tags,
      },
      paramsSerializer: {
        indexes: null,
      },
      withCredentials: true,
    }
  );

  return {
    posts: res.data.data,
    total: res.data.total,
  };
};

export const getPosts = async (page: number): Promise<PostPropsAllData> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL_POST}`, {
    params: { page: page, limit: 20 },
  });

  return {
    posts: res.data.data,
    total: res.data.total,
    allTags: res.data.tags,
  };
};

export const getPostById = async (id: number): Promise<PostSelectProp> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL_POST}/${id}`,
    {
      withCredentials: true,
    }
  );

  return { post: res.data, status: res.status };
};
