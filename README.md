<h1>Gospider</h1>
<p>Gospider is a desktop client for scalping gogoanime and swiftly obtaining download and stream links. It uses the <a href = "consumet.org">Consumet API</a> to obtain anime data and stream links and uses a custom scalper to attempt to get direct downlaod links for all requested episodes. If for any reason the direct downlaod link could not be obtained, the software will fallback to a secondary download server where the episode can be downloaded swiftly. Either way your anime is gotten much quicker and more securely, allowing you to spend less time looking and more time watching.

<h1>How to build</h1>
Build instructions are generally the same for all desktop operating systems but i have personally only tested on windows.

<ul>
<li>
First clone the repo, install angular dependencies and serve.
<code><br>
git clone https://github.com/Eugenenoble2005/gospider.git<br>
cd gospider<br>
yarn --force <br>
npx patch-package ngx-electron<br>
npx ng build --base-href ./
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

<h1>
Usage Instructions
</h1>
<p>Usage is very straight forward. Input your desired anime into the search bar, chose your quality and episode range and search. Gospider would quickly fetch a stream button and a secondary downlooad button for all episodes. After all streaming episodes have been optained, Gospider would start looking for the download links(this might take an avearge of 20-30 seconds per episode). But not to worry, if you tick the autodownload switch, episodes would start downloading on your default browser as soon as they are obtained. 
</p><br>
<h2>Download Exceptions</h2>
<p>Several exceptions may arise during the crawl process for download links:
<ul>
<li><span style="text-decoration:underline">Captcha Block:</span><br>
If a captcha block is encountered while gospider is looking for download links, gospider will abort the crawl and return the secondary link instead so you can manually complete the download quickly. Captcha blocks can be caused if you have crawled alot in a small amount of time. You can remedy this by refreshing your network(Rebooting your router and waiting for some minutes), disconnecting all VPNs, or changing your driver to another browser.(i.e chrome to edge or vice versa). It also helps to ensure your google account is signed in on your selected browser. This helps convince recaptcha that the download link search is performed by a human and not a bot.
</li>
<li><span style="text-decoration:underline">General Network Failure:</span><br>
This can be caused by a number of network connectivity issues like very slow or non function internet. It can also be triggered if your selected browser was not installed
<br><br><br>
<span style = "font-size:8px">Like this project? You can donate at <a href = "https://www.buymeacoffee.com/nobleeugenY">Buy Me A Cofee</a></span>
