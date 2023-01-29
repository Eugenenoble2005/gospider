<h1>Gospider</h1>
<p>Gospider is a desktop client for scalping gogoanime and swiftly obtaining download and stream links. It uses the <a href = "consumet.org">Consumet API</a> to obtain anime data and stream links and uses a custom scalper to attempt to get direct downlaod links for all requested episodes. If for any reason the direct downlaod link could not be obtained, the software will fallback to a secondary download server where the episode can be downloaded swiftly. Either way your anime is gotten much quicker and more securely, allowing you to spend less time looking and more time watching.

<h1>How to build</h1>
Build instructions are generally the same for all desktop operating systems but i have personally only tested on windows.

<ul>
<li>
First clone the repo, install angular dependencies and serve.
<code>
git pull repo<br>
cd gospider<br>
npm install <br>
npx ng serve
</code><br>
For windows platform, ensure you have windows build tools for node installed. You can install this by running:
<br><code>npm i windows-build-tools</code>
<li>
Open a new terminal tab and start the electron process:<br>
<code>
npm start
</code>
</li>
</ul>