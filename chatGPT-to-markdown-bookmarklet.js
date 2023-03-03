javascript: (function () {
    var odd = document.querySelectorAll(".items-center .group:nth-child(odd) .items-start");
    var even = document.querySelectorAll(".items-center .group:nth-child(even) .items-start");

    if (odd.length === 0 || even.length === 0) {
        alert("Failed to find expected html elements.\nIs this a chat.openai.com/chat/ page?");
        return;
    }
    if (odd.length != even.length) {
        alert("count mismatch");
        return;
    }

    var title = document.querySelector("title").innerHTML;
    var timestamp = new Date().toISOString();

    var s = "# " + title + " " + timestamp + "\n\n";
    for (var i = 0; i < odd.length; i++) {

        s += "## HUMAN:\n\n" + odd[i].innerHTML + "\n\n";

        var e = even[i];
        s += "## CHATGPT:\n\n";
        for (var child of e.querySelector(".prose").children) {
            if (child.localName === "p") {
                var img = child.querySelector("img");
                if (typeof (img) !== "undefined" && img !== null) {
                    const altText = img.alt || "";
                    const url = img.src || "";
                    const title = img.title || "";
                    s += `![${altText}](${url} "${title}")\n\n`;
                } else {
                    s += child.innerHTML + "\n\n";
                }
            } else if (child.localName === "pre") {
                s +=
                    "\n```" +
                    child.querySelector(".items-center span").innerHTML +
                    "\n" +
                    child.querySelector("code").innerHTML.replace(/<[^>]*>/g, "") +
                    "```\n\n";
            } else if (child.localName === "ol") {
                const liElements = child.querySelectorAll("li");
                for (let i = 0; i < liElements.length; i++) {
                    s += `${i + 1}. ${liElements[i].textContent}\n\n`;
                }
            } else if (child.localName === "table") {
                const headers = [...child.querySelectorAll("th")].map(header => header.textContent.trim());
                const rows = [...child.querySelectorAll("tbody tr")].map(row =>
                    [...row.querySelectorAll("td")].map(cell => cell.textContent.trim())
                );
                const markdownTable = [headers, ...rows]
                    .map((row, index) => {
                        if (index === 0) {
                            return `| ${row.join(" | ")} |\n|${row.map(() => "-----").join("|")}|`;
                        }
                        return `| ${row.join(" | ")} |`;
                    })
                    .join("\n");

                s += markdownTable + "\n\n";
            }
        }
    }

    var filename = title + " " + timestamp + ".md";

    function downloadTextFile(filename, content) {
        var link = document.createElement("a");
        link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
        link.setAttribute("download", filename);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    downloadTextFile(filename, s);
})();
