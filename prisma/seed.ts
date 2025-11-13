// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// const prisma = new PrismaClient();

// async function main() {
//   // Buat user admin default
//   const adminEmail = 'admin@company.com';
//   const adminPassword = 'Admin123!';
//   const hashed = await bcrypt.hash(adminPassword, 10);

//   const adminExists = await prisma.user.findUnique({
//     where: { email: adminEmail },
//   });
//   if (!adminExists) {
//     await prisma.user.create({
//       data: {
//         email: adminEmail,
//         password: hashed,
//         role: 'ADMIN',
//       },
//     });
//     console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
//   } else {
//     console.log('Admin user already exists');
//   }

//   // Buat 20 company
//   const existingCompanies = await prisma.company.count();
//   if (existingCompanies < 20) {
//     const companies = Array.from({ length: 20 }).map((_, i) => ({
//       name: `Company ${i + 1}`,
//       address: `Jl. Contoh No.${i + 1}, Jakarta`,
//     }));
//     await prisma.company.createMany({ data: companies });
//     console.log('Seeded 20 companies');
//   } else {
//     console.log('Companies already seeded');
//   }
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
