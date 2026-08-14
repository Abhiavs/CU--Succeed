import { prisma } from "../src/lib/prisma";
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@cusucceed.com';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'OFFICIAL'
      }
    });
    
    console.log('Admin account created successfully: admin@cusucceed.com / admin123');
  } else {
    console.log('Admin account already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
