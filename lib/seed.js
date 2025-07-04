const path = require("path");
const { PrismaClient } = require("@prisma/client");

// resolve import manually without alias
const prisma = new PrismaClient();

async function seedProducts() {
  const sampleProducts = Array.from({ length: 100 }, (_, i) => ({
    name: `Sample Product ${i + 1}`,
    description: `This is a description for product ${i + 1}.`,
    price: (Math.random() * 100).toFixed(2),
    stock: Math.floor(Math.random() * 50) + 1,
    image_url: `https://via.placeholder.com/150?text=Product+${i + 1}`,
  }));

  try {
    await prisma.product.createMany({
      data: sampleProducts,
      skipDuplicates: true,
    });

    console.log("✅ Successfully seeded 100 products.");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
