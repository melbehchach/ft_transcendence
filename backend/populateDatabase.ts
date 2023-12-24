/* eslint-disable @typescript-eslint/no-var-requires */
const {
  PrismaClient,
  ChannelType,
  Status,
  GameType,
} = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  // Create some users
  const users = await Promise.all(
    ['Alice', 'Bob', 'Charlie', 'Dave'].map(async (username) => {
      const hashedPassword = await argon2.hash('aBcd!123');
      return prisma.user.create({
        data: {
          username,
          email: `${username.toLowerCase()}@example.com`,
          password: hashedPassword,
          avatar: 'avatar.png',
          socketId: 'socketId',
          isAuthenticated: true,
        },
      });
    }),
  );

  // Create some friend requests
  await prisma.friendRequest.create({
    data: {
      senderId: users[0].id,
      receiverId: users[1].id,
      status: Status.PENDING,
    },
  });

  // Create some channels
  const channels = await Promise.all(
    ['Channel1', 'Channel2'].map((name) =>
      prisma.channel.create({
        data: {
          name,
          image: 'image.png',
          type: ChannelType.PUBLIC,
          ownerId: users[0].id,
        },
      }),
    ),
  );

  // Create some chats
  const chats = await Promise.all(
    users.map((user, index) =>
      prisma.chat.create({
        data: {
          myself: { connect: { id: user.id } },
          myfriend: { connect: { id: users[(index + 1) % users.length].id } },
        },
      }),
    ),
  );

  // Create some messages
  await prisma.message.create({
    data: {
      body: 'Hello, world!',
      senderId: users[0].id,
      receiverId: users[1].id,
      channelId: channels[0].id,
      chatId: chats[0].id,
      delivered: true,
    },
  });

  // Create some games
  await prisma.game.create({
    data: {
      Player: { connect: { id: users[0].id } },
      Opponent: { connect: { id: users[1].id } },
      type: GameType.FriendMatch,
      playerScore: 10,
      opponentScore: 5,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
