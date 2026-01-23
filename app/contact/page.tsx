export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-semibold mb-10">Contact Us</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-400">Name</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-gray-700 dark:text-gray-400 dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-400">Email</span>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-gray-700 dark:text-gray-400 dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-400">Message</span>
            <textarea
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-gray-700 dark:text-gray-400 dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
