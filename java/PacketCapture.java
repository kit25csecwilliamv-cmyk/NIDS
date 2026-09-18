import org.pcap4j.core.*;
import org.pcap4j.packet.Packet;

public class PacketCapture {

    private final ThreatDetector detector;

    private long packets = 0;
    private boolean running = false;

    public PacketCapture(ThreatDetector detector) {
        this.detector = detector;
    }

    public void start() throws Exception {

        PcapNetworkInterface device =
                Pcaps.findAllDevs()
                     .stream()
                     .filter(d -> d.getDescription() != null &&
                             d.getDescription().toLowerCase().contains("wi-fi"))
                     .findFirst()
                     .orElse(null);

        if (device == null) {
            throw new Exception("Wi-Fi adapter not found");
        }

        System.out.println("Monitoring: " + device.getName());
        System.out.println("Description: " + device.getDescription());

        PcapHandle handle = device.openLive(
                65536,
                PcapNetworkInterface.PromiscuousMode.PROMISCUOUS,
                10
        );

        running = true;

        System.out.println("NIDS Started");

        while (running) {

            Packet packet = handle.getNextPacket();

            if (packet != null) {

                packets++;

                detector.analyze(packet);

                System.out.println(
                        "Packets Captured: " + packets
                );
            }
        }

        handle.close();
    }

    public long getPackets() {
        return packets;
    }

    public boolean isRunning() {
        return running;
    }

    public void stop() {
        running = false;
    }
}
