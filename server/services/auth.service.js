const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createUser = async ({ username, email, hash }) => {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hash,
      provider: "creatials",
    },
  });

  console.log("USER USER : ", user);

  return user;
};
