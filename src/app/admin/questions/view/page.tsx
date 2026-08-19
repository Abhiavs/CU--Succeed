import { redirect } from "next/navigation";

export default function ViewQuestionsRedirect() {
  redirect("/admin/questions");
}
