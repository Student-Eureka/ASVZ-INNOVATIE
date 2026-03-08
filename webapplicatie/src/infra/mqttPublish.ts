import mqtt from 'mqtt';

interface MqttPublishOptions {
  host: string;
  port: number;
  protocol: 'mqtts' | 'mqtt';
  username?: string;
  password?: string;
  rejectUnauthorized?: boolean;
  connectTimeoutMs?: number;
}

// Publiceert één bericht op een topic en sluit de verbinding direct daarna.
// Dit is bedoeld voor korte "fire-and-forget" commando's zoals servo-acties,
// zodat er geen langdurige MQTT-sessie blijft openstaan.
export async function publishOnce(
  topic: string,
  payload: string,
  options: MqttPublishOptions
): Promise<void> {
  // een Promise is om het publish-resultaat af te wachten.
  await new Promise<void>((resolve, reject) => {
    // Maak een nieuwe MQTT client aan met de gegeven opties.
    const client = mqtt.connect({
      host: options.host,
      port: options.port,
      protocol: options.protocol,
      username: options.username,
      password: options.password,
      // Bij self-signed certs kun je dit op false zetten. is op dat moment niet meer nodig.
      rejectUnauthorized: options.rejectUnauthorized ?? true,
      // Timeout in ms als broker niet reageert.
      connectTimeout: options.connectTimeoutMs ?? 5000,
    });

    // Bij een succesvolle connectie publiceren we het bericht.
    client.on('connect', () => {
      client.publish(topic, payload, (err) => {
        // Altijd de verbinding sluiten om resources te besparen (open netwerkverbindingen, sockets en geheugen)
        // Dit wordt gedaan omdat de server anders onnodig veel resources onthoud zoals sockets die niet meer worden gebruikt
        client.end();

        if (err) {
          // Publish mislukt -> Promise faalt.
          reject(err);
        } else {
          // Publish gelukt -> Promise Klaar.
          resolve();
        }
      });
    });

    // Als er een connect-fout optreedt, sluiten we direct af.
    client.on('error', (err) => {
      client.end();
      reject(err);
    });
  });
}
