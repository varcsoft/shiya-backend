import prisma, { generateUUID } from "./database.js";
import { hashPassword } from "./sec.js";
const roles = {
  ADMIN : "ADMIN",
  USER : "USER",
  STAFF : "STAFF",
}


const seedAdminAccount = async () => {
  const role = await prisma.role.findUnique({
    where: {
      name: roles.ADMIN,
    },
  });
  await prisma.user.create({
    data: {
      id: generateUUID(),
      firstName: "Admin",
      email: "admin@shiya.in",
      password: await hashPassword("shiya@87926"),
      roleId : role.id,
    },
  });
}
// seedAdminAccount();

export { roles };
const seeddb = async () => {
  await prisma.$transaction([
    prisma.role.createMany({
      skipDuplicates: true,
      data: [
        {
          id: generateUUID(),
          name: roles.USER,
          description: "User role",
        },
        {
          id: generateUUID(),
          name: roles.ADMIN,
          description: "Admin role",
        },
        {
          id: generateUUID(),
          name: roles.STAFF,  
          description: "Staff role",
        },
      ],
    }),
    prisma.collection.createMany({
      skipDuplicates: true,
      data: [
        {
          id: generateUUID(),
          name: "Featured Products",
          key: "FEATURED_PRODUCTS",
        },
      ],
    }),
  ]);
};

export default seeddb;
