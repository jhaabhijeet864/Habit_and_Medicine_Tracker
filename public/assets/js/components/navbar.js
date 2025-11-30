// Shared App Navbar Component
// Injects a consistent navbar into any element with [data-app-navbar]
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.querySelector('[data-app-navbar]');
  if (!mount) return;

  mount.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <img src="../../assets/images/icons/logo.png" alt="Logo" class="w-8 h-8" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="w-8 h-8 bg-blue-600 rounded-full hidden items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-xl font-bold text-blue-600">Habit Sync</span>
        </div>

        <!-- Center Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="../dashboard/index.html" class="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
          <a href="../habits/index.html" class="text-gray-600 hover:text-gray-900 font-medium">My Habits</a>
          <a href="../medicine/index.html" class="text-gray-600 hover:text-gray-900 font-medium">My Medicine</a>
          <a href="../settings/index.html" class="text-gray-600 hover:text-gray-900 font-medium">Settings</a>
        </div>

        <!-- Right Icons -->
        <div class="flex items-center space-x-4">
          <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg" aria-label="Profile">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
});