import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Enrolling existing students in default program...");

  const program = await prisma.program.findFirst({
    where: { name: 'Employability Mentorship' }
  });

  if (!program) {
    console.log("Default program not found. Run seedData.mjs first.");
    return;
  }

  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' }
  });

  for (const student of students) {
    await prisma.user.update({
      where: { id: student.id },
      data: {
        programs: {
          connect: { id: program.id }
        }
      }
    });
    console.log(`Enrolled student ${student.email}`);
  }

  console.log("Enrollment complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
