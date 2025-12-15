# ASVZ Innovatie – Alarm Stop Systeem

## Dit project in één zin

Met dit project kunnen begeleiders via een webapp op afstand een **fysieke stopknop** indrukken, zodat een alarmsignaal snel uitgezet kan worden zonder dat iemand direct naar het apparaat hoeft te lopen. Dit bespaart tijd, vermindert onrust en houdt de controle bij de begeleider.

---

## Probleem

Op verschillende ASVZ-locaties worden apparaten gebruikt, zoals een sondepomp, die een piepend alarm geven. Dat alarm moet handmatig worden uitgezet met een knop op het apparaat zelf.

In de praktijk levert dat problemen op:

* Begeleiders zijn niet altijd direct in de buurt van het apparaat
* Het aanhoudende piepen veroorzaakt stress en onrust bij cliënten
* Begeleiders moeten hun werk onderbreken om alleen het alarm uit te zetten

Het systeem werkt technisch gezien wel, maar sluit niet goed aan op de dagelijkse praktijk binnen de zorg.

---

## Doel van het project

Het doel van dit project is om een **simpele en betrouwbare oplossing** te maken waarmee begeleiders een alarm **bewust en handmatig op afstand** kunnen stoppen.

Dit is belangrijk omdat:

* Begeleiders zo sneller kunnen handelen
* Cliënten minder last hebben van onrust
* De controle altijd bij een mens blijft en niet bij een automatisch systeem

Daarom zijn er duidelijke afspraken gemaakt:

* Er gebeurt niets automatisch
* Er is geen automatische sluimer
* Elke actie wordt bewust door een begeleider uitgevoerd

---

## De oplossing

De oplossing bestaat uit twee onderdelen die samen één probleem oplossen.

### Webapplicatie

De webapplicatie is bedoeld voor begeleiders. Zij werken dagelijks met dit soort situaties en hebben behoefte aan een snelle en duidelijke manier om te handelen.

De webapp:

* Laat begeleiders inloggen per locatie, zodat ze alleen zien wat voor hen relevant is
* Houdt de bediening simpel met één duidelijke knop
* Werkt via een browser, zodat er geen aparte apps nodig zijn

De webapp is bewust simpel gehouden om fouten en verwarring te voorkomen.

### Hardware

De hardware zorgt ervoor dat de actie in de webapp ook echt iets fysieks doet. Dit is nodig omdat veel apparaten geen digitale aansturing hebben.

De hardware:

* Ontvangt een signaal vanuit de webapp
* Drukt mechanisch de echte stopknop in
* Werkt onafhankelijk van het apparaat zelf

Dit maakt de oplossing toepasbaar op bestaande apparatuur zonder deze te hoeven aanpassen.

---

## Hoe het werkt

De werking is zo eenvoudig mogelijk gehouden, zodat het in stressvolle situaties ook logisch blijft.

1. Een apparaat begint te piepen.
2. Een begeleider logt in op de webapp.
3. De begeleider drukt op de digitale stopknop.
4. De webapp stuurt een signaal door.
5. De hardware drukt de echte stopknop in.
6. Het alarm stopt of gaat op sluimeren.

Er zijn geen extra stappen, omdat snelheid en duidelijkheid hier belangrijk zijn.

---

## Voor wie is dit bedoeld

Dit project is bedoeld voor meerdere groepen, elk met een eigen reden.

**Begeleiders op ASVZ-locaties**
Zij krijgen minder werkdruk en kunnen sneller reageren op alarmsituaties zonder hun andere taken te hoeven laten vallen.

**Technisch beheer en innovatie**
Voor deze groep is het belangrijk dat de oplossing reproduceerbaar en onderhoudbaar is, zodat deze ook op andere locaties ingezet kan worden.

**Ontwikkelaars**
Zij moeten het systeem kunnen begrijpen, aanpassen en uitbreiden zonder het hele project opnieuw te hoeven uitvinden.

Het project is **niet** bedoeld als consumentenproduct, omdat het specifieke zorgcontext en uitleg vereist.

---

## Beveiliging en toegang

Elke locatie werkt met eigen inloggegevens. Dit is gedaan om te voorkomen dat begeleiders per ongeluk toegang krijgen tot apparaten van andere locaties.

Verder:

* Gebruikers zien alleen hun eigen apparaten
* Cliënten hebben geen toegang, om misbruik te voorkomen
* Het accountsysteem is simpel gehouden om beheer makkelijk te houden

---

## Randvoorwaarden en aannames

Bij het ontwerp is uitgegaan van een aantal vaste uitgangspunten. Elke locatie gebruikt een eigen account en de hardware is gekoppeld aan één specifieke fysieke knop. Betrouwbaarheid is belangrijker dan snelheid, omdat het systeem altijd moet werken op het moment dat het nodig is. Er worden geen automatische acties uitgevoerd, zodat de verantwoordelijkheid altijd bij een begeleider ligt.

Als één van deze aannames niet klopt, moet het ontwerp worden aangepast om fouten of onveilige situaties te voorkomen.

---

## Wat dit project niet is

Dit project is bewust beperkt gehouden:

* Het is geen groot IoT-platform, omdat dat onnodig complex zou zijn
* Het gebruikt geen AI, omdat voorspelbaarheid belangrijker is dan “slimheid”
* Het vervangt geen bestaande alarmsystemen, maar werkt ernaast

Door deze focus blijft het systeem betrouwbaar en overzichtelijk.

---

## Projectstructuur

Het project is opgezet met een vaste mappenstructuur zodat anderen het makkelijk kunnen overnemen. De hoofdmap bevat deze README met uitleg. De map `webapplicatie` bevat alle code en technische documentatie van de webomgeving. De map `hardware` bevat de informatie over de fysieke opstelling en aansturing.

Een vaste structuur voorkomt verwarring en maakt onderhoud en overdracht eenvoudiger.

---

## Documentatie en reproduceerbaarheid

Documentatie is nodig om te zorgen dat dit project niet stopt zodra de oorspronkelijke ontwikkelaars weg zijn. Daarom bevat deze repository:

* Installatie-instructies
* Configuratie-uitleg
* Hardware-informatie en onderdelen
* Uitleg voor begeleiders
* Informatie om het systeem op andere locaties opnieuw te bouwen

Het doel is dat iemand anders dit project kan oppakken en voortzetten zonder extra uitleg.

---

## Status van het project

Het concept en de architectuur zijn afgerond. De webapplicatie is nog in ontwikkeling en de hardware bevindt zich in de prototypefase. Het systeem is op dit moment niet productie-klaar en daar moet geen verkeerde verwachting over ontstaan.

---

## Laatste opmerking

Als iemand na het lezen van deze README nog steeds niet begrijpt wat dit project doet of waarom het bestaat, dan is de uitleg of het systeem niet duidelijk genoeg.

Documentatie is geen extraatje.
Het **is** onderdeel van het product.
