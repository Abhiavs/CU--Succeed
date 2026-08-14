import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding mock data for assessments...");

  // 1. Create a Program
  const program = await prisma.program.upsert({
    where: { name: 'Employability Mentorship' },
    update: {},
    create: {
      name: 'Employability Mentorship',
      description: 'Core program for developing employability and soft skills.',
    },
  });
  console.log(`Program created: ${program.name}`);

  // 2. Create Questions
  const questionsData = [
    {
      text: "Which of the following is an example of active listening?",
      type: "MULTIPLE_CHOICE",
      parameter: "Communication",
      correctAnswer: "B",
      options: [
        { id: "A", text: "Formulating your response while the other person is talking." },
        { id: "B", text: "Nodding and providing feedback to ensure understanding." },
        { id: "C", text: "Interrupting to share a similar personal story." },
        { id: "D", text: "Looking at your phone while they speak." }
      ]
    },
    {
      text: "If a train travels 60km in 1.5 hours, what is its average speed in km/h?",
      type: "MULTIPLE_CHOICE",
      parameter: "Aptitude",
      correctAnswer: "C",
      options: [
        { id: "A", text: "30 km/h" },
        { id: "B", text: "35 km/h" },
        { id: "C", text: "40 km/h" },
        { id: "D", text: "45 km/h" }
      ]
    },
    {
      text: "What is the most professional way to handle a mistake at work?",
      type: "MULTIPLE_CHOICE",
      parameter: "Soft Skills",
      correctAnswer: "C",
      options: [
        { id: "A", text: "Ignore it and hope no one notices." },
        { id: "B", text: "Blame a colleague who was also involved." },
        { id: "C", text: "Acknowledge the mistake, inform your manager, and propose a solution." },
        { id: "D", text: "Wait until performance review to bring it up." }
      ]
    }
  ];

  const createdQuestions = [];
  for (const q of questionsData) {
    const question = await prisma.question.create({
      data: {
        text: q.text,
        type: q.type,
        parameter: q.parameter,
        correctAnswer: q.correctAnswer,
        options: q.options,
      }
    });
    createdQuestions.push(question);
  }
  console.log(`Created ${createdQuestions.length} questions.`);

  // 3. Create an Assessment and link questions
  const assessment = await prisma.assessment.create({
    data: {
      title: "Pre-Test: Employability Module 1",
      description: "Initial assessment to gauge baseline skills.",
      type: "PRE_TEST",
      durationMinutes: 30,
      isActive: true,
      programId: program.id,
      questions: {
        create: createdQuestions.map(q => ({
          questionId: q.id
        }))
      }
    }
  });

  console.log(`Assessment created: ${assessment.title}`);
  console.log("Mock data seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
