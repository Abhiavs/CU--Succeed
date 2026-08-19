import { redirect } from "next/navigation";

export default function AddQuestionRedirect() {
  redirect("/admin/questions/new");
}
