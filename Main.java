public class Main {

    public static void main(String[] args) {

        System.out.println("================================");
        System.out.println("NIDS - Network Intrusion Detection System");
        System.out.println("================================");

        ThreatDetector detector = new ThreatDetector();
        PacketCapture capture = new PacketCapture(detector);
        NidsServer server = new NidsServer(capture, detector);

        try {
            server.start();
            capture.start();
        } catch (Exception e) {
            System.out.println("NIDS Error: " + e.getMessage());
        }
    }
}
