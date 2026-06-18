@import "tailwindcss";

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-neutral-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased transition-colors duration-200;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply text-slate-900 dark:text-slate-50 font-semibold;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-neutral-100 dark:bg-slate-800;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-neutral-300 dark:bg-slate-600 rounded-full hover:bg-neutral-400 dark:hover:bg-slate-500 transition-colors;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium shadow-sm hover:bg-neutral-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-50;
  }

  .btn-danger {
    @apply inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-[0.98] transition-all;
  }

  .input {
    @apply w-full px-4 py-3 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-50 placeholder:text-neutral-400 dark:placeholder:text-slate-500 text-sm transition-all;
  }

  .card {
    @apply bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl shadow-md overflow-hidden transition-all duration-200;
  }

  .card-3d {
    @apply bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl shadow-md overflow-hidden transition-all duration-200;
  }

  .card-3d:hover {
    @apply transform -translate-y-1 shadow-lg border-neutral-300 dark:border-slate-600;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border;
  }

  .badge-blue { @apply bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30; }
  .badge-green { @apply bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30; }
  .badge-amber { @apply bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30; }
  .badge-red { @apply bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30; }
  .badge-slate { @apply bg-neutral-50 text-slate-700 border-neutral-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700; }

  .card-header {
    @apply px-6 py-4 border-b border-neutral-200 dark:border-slate-700 bg-neutral-50/50 dark:bg-slate-900/30;
  }

  .table-head {
    @apply bg-neutral-50 dark:bg-slate-900 text-neutral-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-neutral-200 dark:border-slate-700;
  }

  .table-row {
    @apply border-b border-neutral-100 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors last:border-0;
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }

  .animate-shake {
    animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
