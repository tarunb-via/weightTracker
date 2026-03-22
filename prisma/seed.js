import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

const sampleEntries = [
  { daysAgo: 120, weight: 191.8, note: 'Started a more consistent morning routine.' },
  { daysAgo: 105, weight: 190.6, note: 'Good hydration this week.' },
  { daysAgo: 90, weight: 189.9, note: 'Added more walks after dinner.' },
  { daysAgo: 75, weight: 188.7, note: 'Strength training felt strong.' },
  { daysAgo: 60, weight: 187.8, note: 'Travel week, still stayed on track.' },
  { daysAgo: 45, weight: 186.9, note: 'Meal prep helped a lot.' },
  { daysAgo: 30, weight: 186.1, note: 'Steady progress through the month.' },
  { daysAgo: 21, weight: 185.7, note: 'Slept better and felt lighter.' },
  { daysAgo: 14, weight: 185.2, note: 'Weekend was balanced.' },
  { daysAgo: 7, weight: 184.8, note: 'Kept sodium lower this week.' },
  { daysAgo: 3, weight: 184.4, note: 'Felt energized after workouts.' },
  { daysAgo: 0, weight: 184.1, note: 'Current check-in.' },
];

async function main() {
  for (const entry of sampleEntries) {
    const date = subDays(new Date(), entry.daysAgo);
    date.setUTCHours(0, 0, 0, 0);
    await prisma.weightEntry.upsert({
      where: { date },
      update: { weight: entry.weight, note: entry.note },
      create: { date, weight: entry.weight, note: entry.note },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
