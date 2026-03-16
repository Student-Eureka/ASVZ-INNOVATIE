# Hardware - Raspberry Pi Pico W

Deze map bevat de MicroPython code voor de Raspberry Pi Pico W en de hardware-uitleg.
Doel: een fysieke knop mechanisch indrukken na een MQTT-commando en status publiceren.

## Overzicht
- `main.py` (in `MqttConnectie.txt`) publiceert status naar MQTT en luistert naar input via serial.
- `PiepTest.py` (in `PiepTest.txt`) is een losse test voor microfoon + servo.

## Benodigdheden (hardware)
Minimaal:
- Raspberry Pi Pico W
- Servo (5V hobbyservo, 50Hz PWM)
- Microfoon module met analoge uitgang
- Externe 5V voeding voor servo (aanbevolen)
- Jumper wires / breadboard

Optioneel:
- Behuizing + mechanische koppeling naar de fysieke stopknop
- Schroefjes / montageplaat

## Pinout / aansluitingen
Gebruikte pins in de code:
- `ADC26` -> microfoon (analoge output)
- `GPIO15` -> servo PWM

Let op:
- Gebruik GND gemeenschappelijk tussen Pico en servo-voeding.
- Servo niet direct voeden vanuit de Pico 3.3V; gebruik 5V externe voeding.

## MicroPython installeren (Pico W)
1. Download MicroPython firmware voor Pico W vanaf de officiële site.
2. Zet de Pico in bootloader mode (houd `BOOTSEL` ingedrukt terwijl je USB aansluit).
3. Sleep het `.uf2` bestand naar de Pico drive.

## Code uploaden
Aanpak met Thonny (aanbevolen):
1. Open Thonny.
2. Selecteer `Interpreter` -> `MicroPython (Raspberry Pi Pico)`.
3. Open het script (bijv. `main.py`) en klik op `Save as...` -> `Raspberry Pi Pico`.

Bestanden:
- `main.py` (MQTT status, input via serial)
- `PiepTest.py` (losse microfoon/servo test)

## `main.py` configureren
Pas in `main.py` de volgende waarden aan:
- `WIFI_SSID`
- `WIFI_PASSWORD`
- `MQTT_BROKER`
- `MQTT_USER`
- `MQTT_PASSWORD`
- `CLIENT_ID` (uniek per device)
- `WONING` en `POMP` (topic namespace)

Topic voorbeeld:
```
asvz/woning_a/pomp_3/status
```

## Gebruik `main.py`
1. Upload `main.py` naar de Pico (als `main.py`).
2. Open de serial console in Thonny.
3. Typ `actief` of `rust` om status te wisselen.
4. Status wordt elke 5s opnieuw gepubliceerd (heartbeat).

Automatisch gedrag:
- Na 2 minuten zonder input gaat status terug naar `rust`.
- Status wordt gepubliceerd met `retain=True`.

## `PiepTest.py` gebruiken
Doel: lokaal testen of microfoon + servo werken.

1. Upload `PiepTest.py` (kan tijdelijk als `main.py`).
2. In de console zie je de ruwe microfoonwaarden.
3. Bij waarde boven `THRESHOLD` beweegt de servo:
   - naar 120 graden
   - terug naar 20 graden

## Servo calibratie
Elke servo is anders. Pas in `PiepTest.py` of `main.py` aan:
- Hoekwaarden in `set_angle()`
- Drempelwaarde `THRESHOLD`

## Troubleshooting
Veelvoorkomende issues:
- Geen WiFi:
  - Check SSID/wachtwoord.
  - Controleer of de Pico 2.4GHz netwerk gebruikt.
- Geen MQTT:
  - Check broker IP en credentials.
  - Test broker via `mosquitto_sub` op de server.
- Servo beweegt niet:
  - Gebruik externe 5V voeding.
  - Check GND common.
  - Controleer of `GPIO15` juist is aangesloten.
- Microfoon detecteert niets:
  - Verifieer dat de microfoon analoge output heeft.
  - Pas `THRESHOLD` aan.
