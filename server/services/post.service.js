const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getPostByAuthor = async ({ page, limit, author, tags }) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(author && { postedBy: author }),
    ...(tags &&
      tags.length > 0 && {
        tags: {
          some: {
            tag: {
              name: {
                in: tags,
              },
            },
          },
        },
      }),
  };

  const [totalPost, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "asc" },
      include: {
        tags: { include: { tag: true } },
      },
    }),
  ]);

  const filteredPosts = posts.filter((post) => {
    const tagNames = post.tags.map((t) => t.tag.name);
    return tags.every((tag) => tagNames.includes(tag));
  });

  const total = filteredPosts.length;

  return { total, page, limit, data: filteredPosts };
};
exports.getPosts = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const [total, posts, tags] = await Promise.all([
    prisma.post.count(),
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { id: "asc" },
      include: {
        tags: { include: { tag: true } },
      },
    }),
    prisma.tag.findMany(),
  ]);

  return {
    total,
    page,
    limit,
    tags,
    data: posts,
  };
};

exports.getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return post;
};
