import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AddQuestionPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "OFFICIAL") {
    redirect("/login");
  }

  // TODO: Fetch categories and years from DB, for now static mock
  const category = "Aptitude";
  const year = "2026";

  return (
    <div className="min-h-screen bg-mint p-8 flex justify-center items-start">
      <div className="bg-paper p-10 rounded-xl shadow-sm border border-line w-full max-w-3xl mt-10">
        <h2 className="text-2xl font-bold text-center mb-2 text-ink">Add Question</h2>
        <div className="text-center text-ink-muted mb-8 text-sm">
          {category} | Year {year}
        </div>

        <form action="/api/questions" method="POST" className="max-w-2xl mx-auto flex flex-col gap-4">
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="year" value={year} />

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-ink">Question</label>
            <textarea
              name="text"
              rows={3}
              required
              className="w-full p-3 border border-line rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="font-semibold text-ink">Options</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="option1" placeholder="Option 1" required className="w-full p-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-forest" />
              <input type="text" name="option2" placeholder="Option 2" required className="w-full p-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-forest" />
              <input type="text" name="option3" placeholder="Option 3" required className="w-full p-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-forest" />
              <input type="text" name="option4" placeholder="Option 4" required className="w-full p-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-forest" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="font-bold text-ink block mb-4">Correct Answer</span>
            <div className="flex justify-center gap-12">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col items-center text-sm gap-1">
                  <input type="radio" name="correctAnswer" value={num} required className="w-4 h-4 text-forest" />
                  <label>{num}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button type="submit" className="px-8 py-3 bg-blue text-paper font-medium rounded-md hover:bg-blue-dark transition-colors">
              Add Question
            </button>
            <Link href="/admin/questions/view" className="px-8 py-3 bg-forest text-paper font-medium rounded-md hover:bg-forest-dark transition-colors text-center">
              View Questions
            </Link>
            <Link href="/admin" className="px-8 py-3 bg-ink-muted text-paper font-medium rounded-md hover:bg-ink transition-colors text-center">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
