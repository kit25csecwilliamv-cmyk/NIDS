let packetCount = 0;
let threatCount = 0;
let connectionCount = 0;

let monitoring = true;

const packets = [];
const alertHistory = [];

const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS"];


// ---------------- DASHBOARD ----------------

function updateDashboard() {

    document.getElementById("packetCount").innerText = packetCount;

    document.getElementById("threatCount").innerText = threatCount;

    document.getElementById("connectionCount").innerText =
        connectionCount;

}


// ---------------- PACKET GENERATION ----------------

function generatePacket() {

    if (!monitoring)
        return;

    packetCount++;
    connectionCount++;

    const sourceIP =
        "192.168.1." + Math.floor(Math.random() * 20 + 2);

    const destinationIP =
        "192.168.1." + Math.floor(Math.random() * 20 + 30);

    const protocol =
        protocols[Math.floor(Math.random() * protocols.length)];

    const port =
        Math.floor(Math.random() * 9000 + 1000);

    const size =
        Math.floor(Math.random() * 1400 + 100);

    const time =
        new Date().toLocaleTimeString();

    packets.unshift({
        time,
        sourceIP,
        destinationIP,
        protocol,
        port,
        size
    });

    if (packets.length > 30)
        packets.pop();

    displayPackets();

    updateDashboard();
}


// ---------------- PHONE CONNECTION DEMO ----------------

function simulateDevice() {

    const deviceIP = "192.168.1.15";

    document.getElementById("deviceMessage").innerHTML =
        "📱 <b>New Device Connected</b><br>" +
        "Device: Mobile Phone<br>" +
        "IP Address: " + deviceIP +
        "<br>Status: Normal";

    addPacket(
        deviceIP,
        "192.168.1.1",
        "Wi-Fi",
        "Connected",
        "Normal"
    );
}


// ---------------- CHROME DEMO ----------------

function simulateChrome() {

    const phoneIP = "192.168.1.15";

    document.getElementById("deviceMessage").innerHTML =
        "🌐 <b>Web Traffic Detected</b><br>" +
        "Source: " + phoneIP +
        "<br>Application: Chrome<br>" +
        "Protocol: HTTPS<br>" +
        "Status: Normal";

    addPacket(
        phoneIP,
        "142.250.195.14",
        "HTTPS",
        "443",
        "Normal"
    );
}


// ---------------- ADD PACKET ----------------

function addPacket(source, destination, protocol, port, status) {

    packetCount++;
    connectionCount++;

    packets.unshift({
        time: new Date().toLocaleTimeString(),
        sourceIP: source,
        destinationIP: destination,
        protocol: protocol,
        port: port,
        size: Math.floor(Math.random() * 1000 + 200)
    });

    displayPackets();
    updateDashboard();
}


// ---------------- TEST ALERT ----------------

function generateTestAlert() {

    threatCount++;

    const sourceIP = "192.168.1.15";

    const alert = {
        type: "Possible Port Scan",
        source: sourceIP,
        severity: "HIGH",
        time: new Date().toLocaleTimeString()
    };

    alertHistory.unshift(alert);

    showAlert(alert);

    updateDashboard();
}


// ---------------- SHOW ALERT ----------------

function showAlert(alert) {

    const alerts = document.getElementById("alerts");

    const div = document.createElement("div");

    div.className = "alert high";

    div.innerHTML =
        "🚨 <b>SECURITY ALERT</b><br><br>" +
        "Type: " + alert.type + "<br>" +
        "Source IP: " + alert.source + "<br>" +
        "Severity: <b>" + alert.severity + "</b><br>" +
        "Time: " + alert.time;

    alerts.prepend(div);

    displayAlertHistory();
}


// ---------------- ALERT HISTORY ----------------

function displayAlertHistory() {

    const history =
        document.getElementById("alertHistory");

    history.innerHTML = "";

    alertHistory.forEach(alert => {

        history.innerHTML += `
            <div class="alert high">
                🚨 <b>${alert.type}</b><br>
                Source IP: ${alert.source}<br>
                Severity: ${alert.severity}<br>
                Time: ${alert.time}
            </div>
        `;
    });
}


// ---------------- PACKET TABLE ----------------

function displayPackets() {

    const table =
        document.getElementById("packetTable");

    table.innerHTML = "";

    packets.forEach(packet => {

        table.innerHTML += `
            <tr>
                <td>${packet.time}</td>
                <td>${packet.sourceIP}</td>
                <td>${packet.destinationIP}</td>
                <td>${packet.protocol}</td>
                <td>${packet.port}</td>
                <td>${packet.size} bytes</td>
            </tr>
        `;
    });
}


// ---------------- SEARCH ----------------

function filterPackets() {

    const search =
        document.getElementById("search")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#packetTable tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase()
            .includes(search)
            ? ""
            : "none";
    });
}


// ---------------- MONITORING ----------------

function toggleMonitoring() {

    monitoring = !monitoring;

    const button =
        document.getElementById("monitorBtn");

    const status =
        document.getElementById("statusText");

    const dot =
        document.getElementById("statusDot");

    if (monitoring) {

        button.innerText = "Stop Monitoring";

        status.innerText = "Monitoring";

        dot.style.color = "#00ff88";

        document.getElementById("networkStatus")
            .innerText = "ONLINE";

    } else {

        button.innerText = "Start Monitoring";

        status.innerText = "Stopped";

        dot.style.color = "red";

        document.getElementById("networkStatus")
            .innerText = "OFFLINE";
    }
}


// ---------------- PAGE NAVIGATION ----------------

function showPage(page) {

    document.getElementById("dashboard")
        .style.display = "none";

    document.getElementById("packets")
        .style.display = "none";

    document.getElementById("alertsPage")
        .style.display = "none";

    document.getElementById("network")
        .style.display = "none";

    if (page === "dashboard")
        document.getElementById("dashboard")
            .style.display = "block";

    if (page === "packets")
        document.getElementById("packets")
            .style.display = "block";

    if (page === "alerts")
        document.getElementById("alertsPage")
            .style.display = "block";

    if (page === "network")
        document.getElementById("network")
            .style.display = "block";
}


// ---------------- CHART ----------------

const ctx =
    document.getElementById("trafficChart");

const trafficChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{
            label: "Packets / Second",
            data: [],
            tension: 0.3
        }]
    },

    options: {
        responsive: true
    }
});


function updateChart() {

    trafficChart.data.labels.push(
        new Date().toLocaleTimeString()
    );

    trafficChart.data.datasets[0].data.push(
        Math.floor(Math.random() * 100)
    );

    if (trafficChart.data.labels.length > 15) {

        trafficChart.data.labels.shift();

        trafficChart.data.datasets[0].data.shift();
    }

    trafficChart.update();
}


// Run every second

setInterval(function () {

    generatePacket();

    updateChart();

}, 1000);
