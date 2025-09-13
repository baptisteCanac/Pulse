export default class MarkdownParser {
  constructor(invoke) {
    this.invoke = invoke;
  }

  parseMarkdownHeadings(md) {
  return String(md)
    // Titres
    .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.*)$/gm,  '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm,   '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm,    '<h1>$1</h1>')
    // Gras
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Transformer les lignes qui commencent par * en <li>
    .replace(/^\*\s+(.*)$/gm, '<li>$1</li>')
    // Regrouper les <li> consécutifs dans un <ul> avec une classe
    .replace(/(<li>.*<\/li>(\r?\n)?)+/g, match => `<ul class="bullet-list">\n${match.trim()}\n</ul>`);
}


  parseMarkdownLists(md) {
    const lines = md.split("\n");
    const stack = [];
    let html = "";

    lines.forEach(line => {
      const match = line.match(/^(\s*)-\s+(.*)$/);
      if (!match) {
        while (stack.length) {
          html += "</ul>";
          stack.pop();
        }
        html += line + "\n";
        return;
      }

      const indent = match[1].length;
      const content = match[2];
      const level = Math.floor(indent / 3);

      if (level > stack.length - 1) {
        html += "<ul>".repeat(level - stack.length + 1);
        stack.push(...Array(level - stack.length + 1).fill(true));
      } else if (level < stack.length - 1) {
        while (stack.length > level + 1) {
          html += "</ul>";
          stack.pop();
        }
      }

      html += `<li>${content}</li>`;
    });

    while (stack.length) {
      html += "</ul>";
      stack.pop();
    }

    return html;
  }

  parseCodeBlocks(md) {
    return md.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
    });
  }

  parseInlineCode(md) {
    return md.replace(/`([^`]+)`/g, (match, content) => {
      const escaped = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<span class="inline-code">${escaped}</span>`;
    });
  }

  parseBlockQuotes(md) {
    const lines = md.split("\n");
    let html = "";
    let inQuote = false;
    let buffer = [];

    lines.forEach(line => {
      if (/^\s*>/.test(line)) {
        buffer.push(line.replace(/^\s*> ?/, ""));
        inQuote = true;
      } else {
        if (inQuote) {
          html += `<span class="quote">${buffer.join("\n")}</span>\n`;
          buffer = [];
          inQuote = false;
        }
        html += line + "\n";
      }
    });

    if (inQuote) {
      html += `<span class="quote">${buffer.join("\n")}</span>\n`;
    }

    return html;
  }

  parseTables(md) {
    return md.replace(/((?:^\|.*\|$\n?)+)/gm, match => {
      const lines = match.trim().split("\n").filter(l => l.trim() !== "");
      if (lines.length < 2) return match;
      const separatorLine = lines[1].trim();
      if (!/^\|[- :|]+\|$/.test(separatorLine)) return match;

      let tableHTML = "<table><thead><tr>";
      const headers = lines[0].split("|").map(h => h.trim()).filter(Boolean);
      headers.forEach(h => tableHTML += `<th>${h}</th>`);
      tableHTML += "</tr></thead><tbody>";
      for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split("|").map(c => c.trim()).filter(Boolean);
        if (cells.length === 0) continue;
        tableHTML += "<tr>";
        cells.forEach(c => tableHTML += `<td>${c}</td>`);
        tableHTML += "</tr>";
      }
      tableHTML += "</tbody></table>";
      return tableHTML;
    });
  }

  async fixImagePaths(html, mdPath) {
    let mdDir = mdPath.replace(/\/?[^\/\\]+$/, '');
    const imgRegex = /<img\s+src=["'](.*?)["']\s*>/g;
    const matches = [...html.matchAll(imgRegex)];

    for (const match of matches) {
      const src = match[1];
      if (/^(\/|https?:)/.test(src)) continue;

      let parts = src.split(/[\\/]/);
      let baseParts = mdDir.split(/[\\/]/);
      for (let part of parts) {
        if (part === "..") baseParts.pop();
        else if (part !== ".") baseParts.push(part);
      }
      const resolvedPath = baseParts.join("/");

      let bytes;
      try {
        bytes = await this.invoke("read_image", { path: resolvedPath });
      } catch (e) {
        console.error("Erreur lecture image :", e);
        continue;
      }

      const blob = new Blob([new Uint8Array(bytes)]);
      const url = URL.createObjectURL(blob);
      html = html.replace(match[0], `<img src="${url}">`);
    }
    return html;
  }

   parseMermaidBlocks(md) {
  // Cherche tous les blocs ```mermaid ... ```
  return md.replace(/```mermaid\n([\s\S]*?)```/g, (match, mermaidCode) => {
    // Nettoyage : enlever retours chariot Windows, décoder entités, trim
    const cleanedCode = mermaidCode
      .replace(/\r/g, "")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&")
      .trim();

    // Retourne un bloc <pre> prêt pour Mermaid avec retours à la ligne conservés
    return `<pre class="mermaid">\n${cleanedCode}\n</pre>`;
  });
}



    convertHtmlMermaidToMermaidPre(html) {
  return html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (match, content) => {
      // Décode les entités HTML (ici juste &gt; -> >)
      const cleaned = content.replace(/&gt;/g, ">")
                             .replace(/&lt;/g, "<")
                             .replace(/&amp;/g, "&")
                             .trim();
      return `<pre class="mermaid">${cleaned}</pre>`;
    }
  );
}

  async parseAll(md, mdPath) {
    let html = this.parseMarkdownHeadings(md);
    html = this.parseMarkdownLists(html);
    html = this.parseCodeBlocks(html);
    html = this.parseMermaidBlocks(html);
    html = this.convertHtmlMermaidToMermaidPre(html);
    html = this.parseInlineCode(html);
    html = this.parseBlockQuotes(html);
    html = this.parseTables(html);
    html = await this.fixImagePaths(html, mdPath);
    return html;
  }
}
