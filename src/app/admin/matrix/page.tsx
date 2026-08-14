import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, Award } from "lucide-react";

export default async function TrainingMatrixPage() {
  // Fetch all completed attempts with program data
  const attempts = await prisma.attempt.findMany({
    where: { status: "COMPLETED", score: { not: null } },
    include: {
      assessment: {
        include: { program: true }
      }
    }
  });

  // Aggregate stats per program
  const programStats: Record<string, {
    programName: string;
    totalAttempts: number;
    totalScore: number;
    passedAttempts: number;
  }> = {};

  let overallScoreSum = 0;
  let overallPassed = 0;

  attempts.forEach(attempt => {
    const programId = attempt.assessment.programId;
    const programName = attempt.assessment.program.name;
    const score = attempt.score || 0;

    if (!programStats[programId]) {
      programStats[programId] = {
        programName,
        totalAttempts: 0,
        totalScore: 0,
        passedAttempts: 0,
      };
    }

    programStats[programId].totalAttempts += 1;
    programStats[programId].totalScore += score;
    if (score >= 50) {
      programStats[programId].passedAttempts += 1;
      overallPassed += 1;
    }
    
    overallScoreSum += score;
  });

  const matrixData = Object.values(programStats).map(stat => ({
    ...stat,
    averageScore: stat.totalAttempts > 0 ? (stat.totalScore / stat.totalAttempts) : 0,
    passRate: stat.totalAttempts > 0 ? (stat.passedAttempts / stat.totalAttempts) * 100 : 0
  })).sort((a, b) => b.averageScore - a.averageScore);

  const totalCompleted = attempts.length;
  const overallAverage = totalCompleted > 0 ? overallScoreSum / totalCompleted : 0;
  const overallPassRate = totalCompleted > 0 ? (overallPassed / totalCompleted) * 100 : 0;

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Training Matrix Analytics</h1>
          <p className="text-muted-foreground font-light">Aggregate performance metrics across all programs and assessments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-light mb-1">Platform Average Score</div>
            <div className="text-2xl font-bold text-white">{overallAverage.toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-light mb-1">Total Assessments Completed</div>
            <div className="text-2xl font-bold text-white">{totalCompleted}</div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <Award size={24} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-light mb-1">Overall Pass Rate</div>
            <div className="text-2xl font-bold text-white">{overallPassRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold text-white mb-6">Program Performance Matrix</h3>
        
        {matrixData.length > 0 ? (
          <div className="space-y-6">
            {matrixData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="font-medium text-white">{data.programName}</div>
                  <div className="text-sm font-mono text-muted-foreground">Avg: <span className="text-white font-bold">{data.averageScore.toFixed(1)}%</span></div>
                </div>
                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden flex relative border border-white/5">
                  <div 
                    className={`h-full transition-all duration-1000 ${data.averageScore >= 75 ? 'bg-emerald-500' : data.averageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, data.averageScore)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-light">
                  <div>{data.totalAttempts} Submissions</div>
                  <div>Pass Rate: {data.passRate.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <p>Not enough data to generate training matrix.</p>
          </div>
        )}
      </div>
    </div>
  );
}
