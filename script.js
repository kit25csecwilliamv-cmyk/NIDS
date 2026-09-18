
let packets = 0;
let alerts = 2;
let connections = 0;
let traffic = 0;

const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS"];
const ips = [
    "192.168.1.15",
    "192.168.1.20",
    "10.0.0.25",
    "172.16.0.12",
    "192.168.1.45"
];

function randomIP() {
    return ips[Math.floor(Math.random() * ips.length)];
}

function randomProtocol() {
    return protocols[Math.floor(Math.random() * protocols.length)];
}

function randomPort() {
    return Math.floor(Math.random() * 60000) + 1000;
}

function randomSize() {
    return Math.floor(Math.random() * 1400) + 100;
}

function currentTime() {
    return new Date().toLocaleTimeString();
}

function addPacket() {

    packets++;
    connections++;
    traffic += Math.floor(Math.random() * 20) + 5;

    const source = randomIP();
    const destination = randomIP();
    const protocol = randomProtocol();
    const sourcePort = randomPort();
    const destinationPort = randomPort();
    const size = randomSize();

    let status = "Normal";
    let statusClass = "safe";

    if (destinationPort < 100) {
        status = "Warning";
        statusClass = "warning";
    }

    if (sourcePort % 17 === 0) {
        status = "Threat";
        statusClass = "threat";
        alerts++;
        addAlert(source);
    }

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${currentTime()}</td>
        <td>${source}</td>
        <td>${destination}</td>
        <td>${protocol}</td>
        <td>${sourcePort}</td>
        <td>${destinationPort}</td>
        <td>${size} bytes</td>
        <td class="${statusClass}">${status}</td>
    `;

    const table = document.getElementById("packetTable");

    table.prepend(row);

    if (table.children.length > 12) {
        table.removeChild(table.lastChild);
    }

    updateDashboard();
}

function addAlert(ip) {

    const alertList = document.getElementById("alertList");

    const alert = document.createElement("div");

    alert.className = "alert-item";

    alert.innerHTML = `
        <span>🚨</span>
        <div>
            <strong>Suspicious Activity</strong>
            <small>${ip}</small>
        </div>
    `;

    alertList.prepend(alert);

    if (alertList.children.length > 5) {
        alertList.removeChild(alertList.lastChild);
    }
}

function updateDashboard() {

    document.getElementById("packetCount").textContent = packets;

    document.getElementById("alertCount").textContent = alerts;

    document.getElementById("connectionCount").textContent =
        connections;

    document.getElementById("trafficCount").textContent =
        traffic + " KB/s";

    updateChart();
}

function updateChart() {

    const bars = document.querySelectorAll(".bar");

    bars.forEach(bar => {

        const height =
            Math.floor(Math.random() * 80) + 20;

        bar.style.height = height + "%";

    });
}

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const search = this.value.toLowerCase();

        const rows =
            document.querySelectorAll("#packetTable tr");

        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();

            row.style.display =
                text.includes(search) ? "" : "none";

        });

    });

setInterval(addPacket, 1500);

setInterval(() => {

    if (traffic > 100) {
        traffic -= 20;
    }

    updateDashboard();

}, 3000);

for (let i = 0; i < 5; i++) {
    addPacket();
}
