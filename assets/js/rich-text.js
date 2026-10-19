// A deliberately small Markdown subset built with DOM nodes, never innerHTML.
(function () {
  function inline(parent, text) {
    const pattern = /(\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`)/g;
    let end = 0;
    for (const m of text.matchAll(pattern)) {
      parent.append(document.createTextNode(text.slice(end, m.index)));
      const node = document.createElement(m[2] ? 'strong' : m[3] ? 'em' : 'code');
      node.textContent = m[2] || m[3] || m[4]; parent.append(node);
      end = m.index + m[0].length;
    }
    parent.append(document.createTextNode(text.slice(end)));
  }
  function render(node, text) {
    node.replaceChildren();
    let paragraph = null, list = null;
    for (const line of String(text).split('\n')) {
      if (!line.trim()) { paragraph = null; list = null; continue; }
      const heading = line.match(/^#{1,6}\s+(.+)$/);
      const bullet = line.match(/^\s*(?:[-*]|\d+[.)])\s+(.+)$/);
      if (heading) {
        const h = document.createElement('h3'); inline(h, heading[1]); node.append(h); paragraph = null; list = null;
      } else if (bullet) {
        const tag = /^\s*\d/.test(line) ? 'OL' : 'UL';
        if (!list || list.tagName !== tag) { list = document.createElement(tag.toLowerCase()); node.append(list); }
        const item = document.createElement('li'); inline(item, bullet[1]); list.append(item); paragraph = null;
      } else {
        list = null;
        if (!paragraph) { paragraph = document.createElement('p'); node.append(paragraph); }
        else paragraph.append(document.createElement('br'));
        inline(paragraph, line);
      }
    }
  }
  window.TravisRichText = { render };
})();
