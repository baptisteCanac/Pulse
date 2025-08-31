class appSidebar extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        const template = `
        <aside class="bg-gray-800 w-full md:w-64 p-6 flex flex-row md:flex-col justify-between md:justify-start">
      <div>
        <!-- Logo -->
        <div class="flex items-center space-x-2 mb-10">
          <span class="text-blue-400 text-2xl">⌁</span>
          <span class="text-xl font-bold">PULSE</span>
        </div>

        <!-- Menu -->
        <nav class="flex md:flex-col space-x-6 md:space-x-0 md:space-y-6">
          <a href="#" class="flex items-center space-x-2 hover:text-blue-400 transition text-blue-400">
            <span>🏠</span>
            <span>Home</span>
          </a>
          <a id="exportToHtml" href="#" class="flex items-center space-x-2 hover:text-blue-400 transition">
            <span>🌐</span>
            <span>Export to HTML</span>
          </a>
          <a href="#" class="flex items-center space-x-2 hover:text-blue-400 transition">
            <span>📄</span>
            <span>Export to PDF</span>
          </a>
          <a href="#" class="flex items-center space-x-2 hover:text-blue-400 transition">
            <span>🧑‍💻</span>
            <span>Code</span>
          </a>
          <a id="settings" href="#" class="flex items-center space-x-2 hover:text-blue-400 transition">
            <span>⚙️</span>
            <span>Settings</span>
          </a>
        </nav>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-sm text-gray-400">
        version <span id="version"></span>
      </div>
    </aside>
        `
        this.innerHTML = template;
        this.dispatchEvent(new CustomEvent("rendered", { bubbles: true }));
    }
}

customElements.define('app-sidebar', appSidebar);