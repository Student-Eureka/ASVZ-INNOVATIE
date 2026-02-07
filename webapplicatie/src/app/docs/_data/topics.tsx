import type { ContentBlock, Topic, TopicId } from '../_types/docs';

export const TOPICS: Topic[] = [
  { id: 'login', titel: 'Inloggen', subtitel: 'Scherm 1' },
  { id: 'dashboard', titel: 'Dashboard', subtitel: 'Scherm 2' },
  { id: 'select-pomp', titel: 'Selecteer pomp', subtitel: 'Scherm 3' },
  { id: 'pomp', titel: 'Pompscherm', subtitel: 'Scherm 4' },
  { id: 'logboek', titel: 'Status & logboek', subtitel: 'Scherm 5' },
  { id: 'waarom', titel: 'Waarom deze uitleg?', subtitel: '' },
  { id: 'hoe', titel: 'Hoe deze uitleg?', subtitel: '' },
];

export function getContent(id: TopicId): ContentBlock | null {
  switch (id) {
    case 'login':
      return {
        title: 'Inloggen (Scherm 1)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Op het <span className="font-semibold">inlogscherm</span> vult u
              uw gebruikersnaam en wachtwoord in. Na een geldige login gaat u
              automatisch naar het dashboard.
            </p>
            <p className="text-sm text-slate-600">
              Dit scherm zorgt ervoor dat alleen bevoegde medewerkers toegang
              hebben tot het sondepomp-dashboard.
            </p>
          </>
        ),
      };
    case 'dashboard':
      return {
        title: 'Dashboard (Scherm 2)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Het <span className="font-semibold">dashboard</span> is het
              startpunt na het inloggen. Hier staan de belangrijkste knoppen en
              tegels bij elkaar.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>
                <span className="font-semibold">Actieve pompen</span> – overzicht van beschikbare pompen.
              </li>
              <li>
                <span className="font-semibold">Start/stop pomp</span> – bediening van de gekozen pomp.
              </li>
              <li>
                <span className="font-semibold">Status / logboek</span> – laatste meldingen en gebeurtenissen.
              </li>
              <li>
                <span className="font-semibold">Documentatie</span> – opent deze uitleg.
              </li>
            </ul>
          </>
        ),
      };
    case 'select-pomp':
      return {
        title: 'Selecteer pomp (Scherm 3)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              In <span className="font-semibold">“Selecteer pomp”</span> kiest
              u welke pomp u wilt bekijken of bedienen.
            </p>
            <p className="text-sm text-slate-600">
              Elke tegel toont de naam van de pomp en een korte status, zoals
              “Start klaar” of “Niet in gebruik”. Na het kiezen gaat u naar het
              pompscherm van die pomp.
            </p>
          </>
        ),
      };
    case 'pomp':
      return {
        title: 'Pompscherm (Scherm 4)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Het <span className="font-semibold">pompscherm</span> toont
              details van de geselecteerde pomp, zoals de actuele status
              (bijvoorbeeld “Draait” of “Gestopt”).
            </p>
            <p className="text-sm text-slate-600">
              Vanuit dit scherm kan de pomp gestart of gestopt worden, afhankelijk
              van de bevoegdheden en de situatie op de afdeling.
            </p>
          </>
        ),
      };
    case 'logboek':
      return {
        title: 'Status & logboek (Scherm 5)',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Het <span className="font-semibold">statuslogboek</span> laat een
              chronologisch overzicht zien van belangrijke gebeurtenissen.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-2">
              <li>Starten of stoppen van een pomp.</li>
              <li>Wijzigingen in ingestelde toevoer / debiet.</li>
              <li>Storingen of meldingen van een pomp.</li>
            </ul>
            <p className="text-sm text-slate-600">
              Per regel ziet u de tijd, de betreffende pomp en een korte
              omschrijving. Dit helpt bij terugzoeken en overdracht tussen diensten.
            </p>
          </>
        ),
      };
    case 'waarom':
      return {
        title: 'Waarom deze uitleg?',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Deze ingebouwde uitleg is bedoeld voor gebruikers die minder
              ervaring hebben met de sondepomp of met digitale dashboards.
            </p>
            <p className="text-sm text-slate-600">
              Doordat de uitleg in de applicatie zelf zit, hoeft u geen papieren
              handleiding op te zoeken. Dit maakt het werken veiliger en
              overzichtelijker, ook in drukke situaties.
            </p>
          </>
        ),
      };
    case 'hoe':
      return {
        title: 'HOE deze uitleg?',
        body: (
          <>
            <p className="text-sm text-slate-600 mb-2">
              Deze ingebouwde uitleg is bedoeld voor gebruikers die minder
              ervaring hebben met de sondepomp of met digitale dashboards.
            </p>
            <p className="text-sm text-slate-600">
              Doordat de uitleg in de applicatie zelf zit, hoeft u geen papieren
              handleiding op te zoeken. Dit maakt het werken veiliger en
              overzichtelijker, ook in drukke situaties.
            </p>
          </>
        ),
      };
    default:
      return null;
  }
}
