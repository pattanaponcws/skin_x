const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//Seed Json to DB
async function main() {
  const filePath = path.join(__dirname, "posts.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const posts = JSON.parse(raw);

  for (const post of posts) {
    // 1. สร้างหรือหา tag ทั้งหมด
    const tagRecords = await Promise.all(
      (post.tags ?? []).map(async (tagName) => {
        return prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
      })
    );

    // 2. สร้าง post
    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        postedAt: new Date(post.postedAt),
        postedBy: post.postedBy,
      },
    });

    // 3. เชื่อม tag กับ post ผ่าน PostTag
    await Promise.all(
      tagRecords.map((tag) => {
        return prisma.postTag.create({
          data: {
            postId: createdPost.id,
            tagId: tag.id,
          },
        });
      })
    );
  }

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
