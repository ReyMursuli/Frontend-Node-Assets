<template>
  <div class="min-h-screen flex items-center justify-center bg-white font-sans">
    <div class="w-full max-w-sm p-8 flex flex-col items-center">
      
      <div class="mb-8 text-gray-400">
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          class="w-32 h-32"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>

      <form class="w-full space-y-6">
        
        <div class="flex flex-col items-center">
          <label class="text-xl font-normal mb-2 text-black">Username</label>
          <input 
            type="text" 
            class="w-full h-14 border-4 border-gray-600 rounded-3xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="flex flex-col items-center">
          <label class="text-xl font-normal mb-2 text-black">Password</label>
          <input 
            type="password" 
            class="w-full h-14 border-4 border-gray-600 rounded-3xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div class="flex justify-center pt-4">
          <button 
            type="button"
            class="bg-[#0047AB] text-white text-2xl px-12 py-3 rounded-3xl hover:bg-blue-800 transition-colors shadow-sm"
          >
            Log in
          </button>
        </div>

      </form>
    </div>
  </div>
</template>