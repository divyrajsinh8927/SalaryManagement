const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

(async () => {
  try {
    const hash = crypto.createHash('md5').update('123456').digest('hex');
    await prisma.users.create({
      data: {
        name: 'Admin',
        email: 'admin@admin.com',
        mobile_number: '1234567890' + Date.now(),
        password: hash,
        theme: 'light'
      }
    });
    console.log('Admin user created successfully.');
  } catch(e) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
