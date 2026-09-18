let monitoring = true;

let packetCount = 0;
let threatCount = 0;
let connectionCount = 0;
let speed = 0;

let packetData = [];

const protocols = [
    "TCP",
    "UDP",
    "HTTP",
    "HTTPS",
    "DNS"
];

const sourceIPs = [
    "192.168.1.10",
    "192.168.1.15",
    "192.168.1.20",
    "192.168.1.25",
    "10.0.0.12",
    "10.0.0.25",
    "172.16.0.15"
];

const destinationIPs = [
    "192.168.1.1",
    "8.8.8.8",
    "1.1.1.1",
    "10.0.0.1",
    "172.16.0.1"
];


function randomItem(array) {

    return array[
        Math.floor(Math.random() * array.length)
    ];

}


function randomPort() {

    return Math.floor(
        Math.random() * 60000
    ) + 1000;

}


function randomSize() {

    return Math.floor(
        Math.random() * 1500
    ) + 60;

}


function getTime() {

    return new Date()
        .toLocaleTimeString();

}


/* GENERATE PACKET */

function generatePacket() {

    if (!monitoring) {
        return;
    }


    const protocol =
        randomItem(protocols);

    const source =
        randomItem(sourceIPs);

    const destination =
        randomItem(destinationIPs);

    const sourcePort =
        randomPort();

    const destinationPort =
        randomPort();

    const size =
        randomSize();


    let severity = "Normal";

    let status = "Allowed";


    /*
       ADVANCED DETECTION RULES
    */


    // Large packet detection

    if (size > 1400) {

        severity = "Medium";

        status = "Large Packet";

    }


    // Suspicious port detection

    if (
        destinationPort === 23 ||
        destinationPort === 21 ||
        destinationPort === 445
    ) {

        severity = "High";

        status = "Suspicious Port";

    }


    // Random simulated intrusion

    if (Math.random() < 0.06) {

        severity = "Critical";

        status = "Intrusion Detected";

        threatCount++;

        createAlert(
            source,
            severity,
            status
        );

    }


    packetCount++;

    connectionCount +=
        Math.floor(
            Math.random() * 2
        );


    speed =
        Math.floor(
            Math.random() * 900
        ) + 100;


    const packet = {

        time: getTime(),

        source: source,

        destination: destination,

        protocol: protocol,

        sourcePort: sourcePort,

        destinationPort: destinationPort,

        size: size,

        severity: severity,

        status: status

    };


    packetData.unshift(packet);


    if (packetData.length > 100) {

        packetData.pop();

    }


    updateDashboard();

    displayPackets();

    updateProtocolStats();

}


/* DASHBOARD */

function updateDashboard() {

    document
        .getElementById("packetCount")
        .textContent =
        packetCount.toLocaleString();


    document
        .getElementById("threatCount")
        .textContent =
        threatCount;


    document
        .getElementById("connectionCount")
        .textContent =
        connectionCount;


    document
        .getElementById("speedCount")
        .textContent =
        speed + " KB/s";


    document
        .getElementById("alertBadge")
        .textContent =
        threatCount;

}


/* DISPLAY PACKETS */

function displayPackets() {

    const table =
        document.getElementById(
            "packetTable"
        );


    table.innerHTML = "";


    packetData.forEach(packet => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${packet.time}</td>

            <td>${packet.source}</td>

            <td>${packet.destination}</td>

            <td>${packet.protocol}</td>

            <td>${packet.sourcePort}</td>

            <td>${packet.destinationPort}</td>

            <td>${packet.size} bytes</td>

            <td>
                <span class="severity ${packet.severity.toLowerCase()}">
                    ${packet.severity}
                </span>
            </td>

            <td class="${packet.severity.toLowerCase()}">
                ${packet.status}
            </td>

        `;


        table.appendChild(row);

    });

}


/* ALERT SYSTEM */

function createAlert(
    ip,
    severity,
    message
) {

    const container =
        document.getElementById(
            "alertContainer"
        );


    const alert =
        document.createElement("div");


    alert.className =
        "alert " +
        severity.toLowerCase();


    alert.innerHTML = `

        <strong>
            🚨 ${message}
        </strong>

        <small>
            Source: ${ip}
        </small>

        <small>
            ${getTime()}
        </small>

    `;


    container.prepend(alert);


    if (container.children.length > 7) {

        container.removeChild(
            container.lastChild
        );

    }

}


/* FILTER */

function filterPackets() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();


    const protocol =
        document
            .getElementById(
                "protocolFilter"
            )
            .value;


    const severity =
        document
            .getElementById(
                "severityFilter"
            )
            .value;


    const rows =
        document.querySelectorAll(
            "#packetTable tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();


        const protocolMatch =
            protocol === "all" ||
            text.includes(
                protocol.toLowerCase()
            );


        const severityMatch =
            severity === "all" ||
            text.includes(
                severity.toLowerCase()
            );


        const searchMatch =
            text.includes(search);


        if (
            protocolMatch &&
            severityMatch &&
            searchMatch
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}


/* CLEAR PACKETS */

function clearPackets() {

    packetData = [];

    document
        .getElementById(
            "packetTable"
        )
        .innerHTML = "";

}


/* MONITORING */

function toggleMonitoring() {

    monitoring =
        !monitoring;


    const button =
        document.getElementById(
            "monitorButton"
        );


    if (monitoring) {

        button.textContent =
            "⏸ Monitoring";

        button.style.background =
            "#22c55e";

    } else {

        button.textContent =
            "▶ Start Monitoring";

        button.style.background =
            "#f59e0b";

    }

}


/* TIME */

function updateTime() {

    document
        .getElementById(
            "liveTime"
        )
        .textContent =
        new Date().toLocaleTimeString();

}

setInterval(
    updateTime,
    1000
);


/* PROTOCOL ANALYTICS */

function updateProtocolStats() {

    const total =
        packetData.length || 1;


    const counts = {

        TCP: 0,
        UDP: 0,
        HTTP: 0,
        HTTPS: 0,
        DNS: 0

    };


    packetData.forEach(packet => {

        if (counts[packet.protocol] !== undefined) {

            counts[packet.protocol]++;

        }

    });


    Object.keys(counts).forEach(protocol => {

        const percent =
            Math.round(
                (counts[protocol] / total) * 100
            );


        const bar =
            document.getElementById(
                protocol.toLowerCase() +
                "Bar"
            );


        const value =
            document.getElementById(
                protocol.toLowerCase() +
                "Value"
            );


        if (bar) {

            bar.style.width =
                percent + "%";

        }


        if (value) {

            value.textContent =
                percent + "%";

        }

    });

}


/* CSV EXPORT */

function exportCSV() {

    if (packetData.length === 0) {

        alert(
            "No packet data available."
        );

        return;

    }


    let csv =
        "Time,Source IP,Destination IP,Protocol,Source Port,Destination Port,Size,Severity,Status\n";


    packetData.forEach(packet => {

        csv +=
            `${packet.time},` +
            `${packet.source},` +
            `${packet.destination},` +
            `${packet.protocol},` +
            `${packet.sourcePort},` +
            `${packet.destinationPort},` +
            `${packet.size},` +
            `${packet.severity},` +
            `${packet.status}\n`;

    });


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "NIDS_Packet_Report.csv";


    link.click();


    URL.revokeObjectURL(
        url
    );

}


/* CHART */

const ctx =
    document
        .getElementById(
            "trafficChart"
        )
        .getContext("2d");


const trafficData = {

    labels: [],

    datasets: [

        {

            label:
                "Packets / Second",

            data: [],

            borderWidth: 2,

            tension: 0.4,

            fill: true

        }

    ]

};


const trafficChart =
    new Chart(
        ctx,
        {

            type: "line",

            data: trafficData,

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    x: {
                        display: false
                    },

                    y: {

                        beginAtZero: true,

                        grid: {
                            color:
                                "#1e293b"
                        },

                        ticks: {
                            color:
                                "#64748b"
                        }

                    }

                }

            }

        }
    );


function updateChart() {

    const now =
        new Date()
            .toLocaleTimeString();


    trafficData.labels.push(
        now
    );


    trafficData.datasets[0]
        .data.push(
            Math.floor(
                Math.random() * 1000
            )
        );


    if (
        trafficData.labels.length >
        20
    ) {

        trafficData.labels.shift();

        trafficData.datasets[0]
            .data.shift();

    }


    trafficChart.update();

}


/* START SIMULATION */

setInterval(
    generatePacket,
    1000
);


setInterval(
    updateChart,
    1000
);


/* INITIAL DATA */

for (
    let i = 0;
    i < 10;
    i++
) {

    generatePacket();

}

updateChart();
