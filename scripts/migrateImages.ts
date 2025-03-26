import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateImages() {
  console.log('Starting image migration...');
  
  try {
    const homes = await prisma.home.findMany();
    let updatedCount = 0;

    for (const home of homes) {
      if (home.photo && (!home.images || home.images.length === 0)) {
        await prisma.home.update({
          where: { id: home.id },
          data: { images: [home.photo] }
        });
        updatedCount++;
        console.log(`Updated home ${home.id}`);
      }
    }

    console.log(`Migration complete! Updated ${updatedCount} homes.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateImages();