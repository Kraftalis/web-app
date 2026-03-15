import { handleSignOut } from "./actions";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign out
      </button>
    </form>
  );
}
