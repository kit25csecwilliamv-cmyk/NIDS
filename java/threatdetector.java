import org.pcap4j.packet.Packet;

public class ThreatDetector {

    private int threats = 0;

    public synchronized void analyze(Packet packet) {

        String packetInfo = packet.toString();

        if (packetInfo.contains("TcpPacket")) {

            if (packetInfo.contains("SYN")) {
                threats++;
                System.out.println("Possible TCP connection attempt detected");
            }
        }
    }

    public synchronized int getThreats() {
        return threats;
    }
}
