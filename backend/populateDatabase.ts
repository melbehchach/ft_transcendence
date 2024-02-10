/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  // Create some users
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const users = await Promise.all(
    ['Mugiwara', 'Sanji', 'Zoro', 'Brook'].map(async (username) => {
      const hashedPassword = await argon2.hash('aBcd!123');
      return prisma.user.create({
        data: {
          username,
          email: `${username.toLowerCase()}@pong.com`,
          password: hashedPassword,
          avatar: '/img/avatar.png',
          isAuthenticated: true,
          TFAenabled: username !== 'Mugiwara' ? true : false,
          TFAsecret: 'EFQW2S2TOQSVGS32LZGTK5TYFZZTIYLILZBWK3LLJRDXURTGINZA',
        },
      });
    }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
