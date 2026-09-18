import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class NidsServer {

    private final PacketCapture capture;
    private final ThreatDetector detector;

    public NidsServer(
            PacketCapture capture,
            ThreatDetector detector) {

        this.capture = capture;
        this.detector = detector;
    }

    public void start() throws IOException {

        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(8080),
                        0
                );

        server.createContext("/api/status", this::status);

        server.setExecutor(null);
        server.start();

        System.out.println(
                "NIDS API running on port 8080"
        );
    }

    private void status(HttpExchange exchange)
            throws IOException {

        String json =
                "{"
                + "\"packets\":" + capture.getPackets() + ","
                + "\"threats\":" + detector.getThreats() + ","
                + "\"network\":\""
                + (capture.isRunning() ? "ONLINE" : "OFFLINE")
                + "\""
                + "}";

        exchange.getResponseHeaders()
                .set("Content-Type", "application/json");

        exchange.getResponseHeaders()
                .set("Access-Control-Allow-Origin", "*");

        exchange.sendResponseHeaders(
                200,
                json.length()
        );

        OutputStream output =
                exchange.getResponseBody();

        output.write(json.getBytes());
        output.close();
    }
}
