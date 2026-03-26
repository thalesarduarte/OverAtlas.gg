import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const team = await prisma.team.upsert({
    where: { slug: "crazy-raccoon" },
    update: {},
    create: {
      slug: "crazy-raccoon",
      name: "Crazy Raccoon",
      shortName: "CR",
      region: "Asia",
      description: "Equipe de destaque no cenário competitivo de Overwatch."
    }
  });

  await prisma.player.upsert({
    where: { slug: "proper" },
    update: { teamId: team.id },
    create: {
      slug: "proper",
      name: "Proper",
      role: "DPS",
      region: "KR",
      teamId: team.id,
      description: "Exemplo de jogador para popular o banco local."
    }
  });

  await prisma.tournament.upsert({
    where: { slug: "owcs-stage-1" },
    update: {},
    create: {
      slug: "owcs-stage-1",
      name: "OWCS Stage 1",
      location: "Online",
      prizePool: "$250,000"
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
