import type { MqttClient } from 'mqtt';
import mqtt from 'mqtt';

// Singleton client zodat we niet bij elke call een nieuwe verbinden openen.
let client: MqttClient | null = null;
let isConnecting = false;

// Haalt verplichte env-variabele op anders fout-melding.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

// Geeft ee bestaande MQTT-client terug of maakt er één aan.
export function getMqttClient() {
  // Als er al een client is (of er wordt al gekoppeld), gebruik die.
  if (client || isConnecting) return client;

  isConnecting = true;

  // Config uit .env
  const broker = requireEnv('MQTT_BROKER_URL');
  const username = requireEnv('MQTT_USER');
  const password = requireEnv('MQTT_PASS');

  // Maak verbinding met broker (blijft open voor realtime updates).
  client = mqtt.connect(broker, {
    username,
    password,
    clientId: `server_${Math.random().toString(16).slice(3)}`,
    reconnectPeriod: 5000, // elke 5s opnieuw proberen te verbinden bij disconnect.
  });

  // Log fouten, zodat we weten wanneer de broker faalt
  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });

  return client;
}
