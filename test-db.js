const { PrismaClient } = require('@prisma/client');
const { Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 測試數據庫連接...');

  try {
    // 測試連接
    await prisma.$connect();
    console.log('✅ 數據庫連接成功');

    // 檢查 User 表是否存在
    const userCount = await prisma.user.count();
    console.log(`✅ User 表存在，共有 ${userCount} 個用戶`);

    // 檢查其他表
    const assetCount = await prisma.asset.count();
    const familyCount = await prisma.familyMember.count();
    const willCount = await prisma.will.count();

    console.log(`✅ Asset 表: ${assetCount} 個資產`);
    console.log(`✅ FamilyMember 表: ${familyCount} 個成員`);
    console.log(`✅ Will 表: ${willCount} 份遺囑`);

    // 創建測試用戶
    console.log('\n🧪 創建測試用戶...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@onheritage.com',
        name: '測試用戶',
        passwordHash: 'test123', // 這應該是 bcrypt hash
      },
    });
    console.log('✅ 測試用戶創建成功');
    console.log(`用戶 ID: ${testUser.id}`);
    console.log(`用戶名: ${testUser.name}`);
    console.log(`用戶郵箱: ${testUser.email}`);

    // 驗證創建
    const verifiedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    console.log('✅ 用戶驗證成功');

    // 清理測試用戶
    console.log('\n🧹 清理測試數據...');
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log('✅ 測試用戶已刪除');

    console.log('\n🎉 所有測試通過！數據庫工作正常！');

  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
