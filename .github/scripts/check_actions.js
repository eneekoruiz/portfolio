const https = require("https");

const options = {
  headers: { "User-Agent": "node" },
};

const url =
  "https://api.github.com/repos/eneekoruiz/portfolio/actions/runs?branch=main&per_page=1";

https
  .get(url, options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const r = JSON.parse(data);
        const wr = r.workflow_runs && r.workflow_runs[0];
        if (!wr) return console.log("no-runs");
        const out = {
          status: wr.status,
          conclusion: wr.conclusion,
          html_url: wr.html_url,
          name: wr.name,
          run_number: wr.run_number,
          created_at: wr.created_at,
        };
        console.log(JSON.stringify(out, null, 2));
      } catch (e) {
        console.error("parse-error", e.message);
      }
    });
  })
  .on("error", (e) => console.error("request-error", e.message));
