import { auth } from "../../auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/quiz");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            セキュリティクイズ
          </h1>
          <p className="text-gray-600">
            社内の情報セキュリティに関する理解度をチェックします。
            <br />
            全問正解するまで繰り返し挑戦してください。
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            受験するにはログインしてください
          </h2>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>全15問 / 4択形式 / 全問正解で合格</p>
        </div>
      </div>
    </main>
  );
}
