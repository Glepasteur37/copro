'use client';

import { useMemo, useState, ReactNode } from 'react';
import {
  buildAgChecklist,
  buildAppelDeFonds,
  colocationCharges,
  computeTantiemes,
  etatDesLieuxSynthese,
  estimationChargesAnnuelles,
  generateContract,
  generateQuittance,
  obligationsGenerales,
  quizScore,
  reglementInterieur,
  sciCalendarObligations,
  sciCompteCourant,
  sciFlowDistribution,
  tauxOccupation,
  generateBudgetPrevisionnel
} from '@/lib/outils';
import { downloadCsv, generateSimplePdf } from '@/lib/pdf/generator';
import { ToolConfig } from '../toolsConfig';
import { OutilCTA } from '../CTA';

export default function ToolClient({ tool }: { tool: ToolConfig }) {
  switch (tool.slug) {
    case 'calculateur-tantiemes-copro':
      return <CalculTantiemes />;
    case 'convocation-ag-copro':
      return <ConvocationAG />;
    case 'pv-ag-copro':
      return <PvAG />;
    case 'checklist-conformite-ag':
      return <ChecklistAG />;
    case 'budget-previsionnel-copro':
      return <BudgetPrevisionnel />;
    case 'appels-de-fonds':
      return <AppelDeFonds />;
    case 'feuille-presence-ag':
      return <FeuillePresence />;
    case 'repartition-flux-sci':
      return <FluxSci />;
    case 'decision-sci':
      return <DecisionSci />;
    case 'compte-courant-associe':
      return <CompteCourant />;
    case 'calendrier-obligations-sci':
      return <CalendrierSci />;
    case 'quittance-colocation':
      return <QuittanceColoc />;
    case 'repartition-charges-colocation':
      return <ChargesColoc />;
    case 'etat-des-lieux-colocation':
      return <EtatDesLieux />;
    case 'reglement-interieur-colocation':
      return <ReglementInterieur />;
    case 'taux-occupation-colocation':
      return <TauxOccupation />;
    case 'estimation-charges-colocation':
      return <EstimationCharges />;
    case 'calendrier-obligations-annuel':
      return <CalendrierGeneral />;
    case 'generateur-contrats-documents':
      return <GenerateurContrat />;
    case 'quiz-syndic-benevole':
      return <QuizSyndic />;
    default:
      return null;
  }
}

function Container({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-700">{description}</p>
      </div>
      {children}
    </div>
  );
}

function CalculTantiemes() {
  const [surfacesInput, setSurfacesInput] = useState('70\n55\n42\n38');
  const surfaces = useMemo(
    () =>
      surfacesInput
        .split(/\n|;/)
        .map((v) => Number(v.trim()))
        .filter((v) => !Number.isNaN(v)),
    [surfacesInput]
  );
  const result = computeTantiemes(surfaces);
  const download = () => {
    const lines = result.map((r) => `${r.lot}: ${r.tantieme} tantièmes (${r.pourcentage}%)`);
    generateSimplePdf('Calculateur de tantièmes', [{ heading: 'Répartition', lines }], 'tantiemes-copro.pdf');
  };
  return (
    <Container
      title="Calculateur de tantièmes copropriété"
      description="Collez les surfaces (m²) des lots, une valeur par ligne : le calcul vous donne la base 1000 pour répartir les charges."
    >
      <div className="card space-y-4">
        <label className="text-sm font-medium">Surfaces des lots (m²)</label>
        <textarea value={surfacesInput} onChange={(e) => setSurfacesInput(e.target.value)} rows={6} />
        <p className="text-sm text-gray-500">Un lot par ligne. Les valeurs invalides sont ignorées.</p>
      </div>
      {result.length > 0 && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Répartition calculée</h2>
            <button onClick={download} className="btn-primary text-sm">
              Exporter en PDF
            </button>
          </div>
          <ul className="space-y-2 text-sm">
            {result.map((r) => (
              <li key={r.lot} className="flex justify-between">
                <span>{r.lot}</span>
                <span>
                  {r.tantieme} tantièmes ({r.pourcentage}%)
                </span>
              </li>
            ))}
          </ul>
          <OutilCTA />
        </div>
      )}
    </Container>
  );
}

function ConvocationAG() {
  const [immeuble, setImmeuble] = useState('Résidence Demo');
  const [date, setDate] = useState('2024-07-01');
  const [heure, setHeure] = useState('19:00');
  const [points, setPoints] = useState('Approbation comptes\nBudget prévisionnel\nRenouvellement syndic');
  const download = () => {
    const lines = points.split(/\n|;/).filter((p) => p.trim().length > 0);
    generateSimplePdf(
      'Convocation Assemblée Générale',
      [
        { heading: `Immeuble: ${immeuble}`, lines: [`Date: ${date} - ${heure}`] },
        { heading: 'Ordre du jour', lines }
      ],
      'convocation-ag.pdf'
    );
  };
  return (
    <Container title="Convocation AG copro" description="Générez une convocation claire avec ordre du jour prêt à envoyer.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Immeuble</label>
        <input value={immeuble} onChange={(e) => setImmeuble(e.target.value)} />
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Heure</label>
            <input value={heure} onChange={(e) => setHeure(e.target.value)} />
          </div>
        </div>
        <label className="text-sm font-medium">Ordre du jour (une ligne par point)</label>
        <textarea value={points} onChange={(e) => setPoints(e.target.value)} rows={5} />
        <div className="flex items-center gap-3">
          <button onClick={download} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
      </div>
    </Container>
  );
}

function PvAG() {
  const [decisions, setDecisions] = useState('Résolution 1: Adoptée\nRésolution 2: Rejetée');
  const [date, setDate] = useState('2024-07-01');
  const download = () => {
    const lines = decisions.split(/\n|;/).filter((p) => p.trim().length > 0);
    generateSimplePdf('Procès-verbal AG', [{ heading: `Séance du ${date}`, lines }], 'pv-ag.pdf');
  };
  return (
    <Container title="PV d’AG copro" description="Rédigez un PV synthétique avec les décisions votées.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Date de l’AG</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label className="text-sm font-medium">Décisions (une par ligne)</label>
        <textarea value={decisions} onChange={(e) => setDecisions(e.target.value)} rows={6} />
        <div className="flex items-center gap-3">
          <button onClick={download} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
      </div>
    </Container>
  );
}

function ChecklistAG() {
  const [convocationEnvoyee, setConvocationEnvoyee] = useState(true);
  const [quorum, setQuorum] = useState(true);
  const [feuille, setFeuille] = useState(true);
  const [pv, setPv] = useState(false);
  const checklist = buildAgChecklist({ convocationEnvoyee, quorumAtteint: quorum, feuillePresenceSignee: feuille, pvRedige: pv });
  return (
    <Container title="Checklist conformité AG" description="Validez rapidement les points critiques de votre AG.">
      <div className="card space-y-3">
        <Toggle label="Convocation envoyée dans les délais" value={convocationEnvoyee} onChange={setConvocationEnvoyee} />
        <Toggle label="Quorum atteint" value={quorum} onChange={setQuorum} />
        <Toggle label="Feuille de présence signée" value={feuille} onChange={setFeuille} />
        <Toggle label="PV rédigé et partagé" value={pv} onChange={setPv} />
        <div className="bg-gray-50 rounded p-3 text-sm">
          <p className="font-semibold">Score conformité : {(checklist.score * 100).toFixed(0)}%</p>
          <ul className="mt-2 space-y-1">
            {checklist.items.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span className={item.ok ? 'text-green-600' : 'text-red-600'}>{item.ok ? 'OK' : 'À faire'}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() =>
            generateSimplePdf(
              'Checklist AG',
              [
                {
                  heading: 'Points contrôlés',
                  lines: checklist.items.map((i) => `${i.label}: ${i.ok ? 'OK' : 'À compléter'}`)
                }
              ],
              'checklist-ag.pdf'
            )
          }
          className="btn-primary text-sm"
        >
          Exporter PDF
        </button>
        <OutilCTA />
      </div>
    </Container>
  );
}

function BudgetPrevisionnel() {
  const [categories, setCategories] = useState('Assurance:1200\nEnergie:2400\nNettoyage:900');
  const parsed = categories
    .split(/\n/)
    .map((line) => line.split(':'))
    .filter((parts) => parts.length === 2 && !Number.isNaN(Number(parts[1].trim())))
    .map(([nom, montant]) => ({ nom: nom.trim(), montant: Number(montant.trim()) }));
  const budget = generateBudgetPrevisionnel(parsed);
  const exportCsv = () => {
    downloadCsv(
      'budget-previsionnel.csv',
      ['Catégorie', 'Montant'],
      parsed.map((p) => [p.nom, p.montant])
    );
  };
  const exportPdf = () => {
    const lines = parsed.map((p) => `${p.nom}: ${p.montant} €`);
    generateSimplePdf('Budget prévisionnel', [{ heading: 'Détails', lines }, { heading: 'Total', lines: [`${budget.total} €`] }], 'budget.pdf');
  };
  return (
    <Container title="Budget prévisionnel" description="Projetez vos charges annuelles et exportez le tableau.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Catégories et montants (Catégorie:Montant)</label>
        <textarea value={categories} onChange={(e) => setCategories(e.target.value)} rows={6} />
        <div className="flex items-center gap-3">
          <button onClick={exportPdf} className="btn-primary text-sm">Export PDF</button>
          <button onClick={exportCsv} className="btn-primary text-sm">Export CSV</button>
        </div>
        <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
          {parsed.map((p) => (
            <div key={p.nom} className="flex justify-between">
              <span>{p.nom}</span>
              <span>{p.montant} €</span>
            </div>
          ))}
          <p className="font-semibold">Total : {budget.total} €</p>
        </div>
        <OutilCTA />
      </div>
    </Container>
  );
}

function AppelDeFonds() {
  const [lots, setLots] = useState('Lot A:400\nLot B:300\nLot C:300');
  const [montant, setMontant] = useState(3000);
  const parsed = lots
    .split(/\n/)
    .map((line) => line.split(':'))
    .filter((parts) => parts.length === 2 && !Number.isNaN(Number(parts[1].trim())))
    .map(([nom, tantieme]) => ({ nom: nom.trim(), tantieme: Number(tantieme.trim()) }));
  const repartition = buildAppelDeFonds(parsed, montant);
  const pdf = () => {
    generateSimplePdf(
      'Avis d’appels de fonds',
      [{ heading: 'Répartition', lines: repartition.map((r) => `${r.lot}: ${r.montant} €`) }],
      'appels-fonds.pdf'
    );
  };
  return (
    <Container title="Avis d’appels de fonds" description="Ventilez un appel de charges par lot en quelques secondes.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Lots et tantièmes (Lot:Tantièmes)</label>
        <textarea value={lots} onChange={(e) => setLots(e.target.value)} rows={5} />
        <label className="text-sm font-medium">Montant total (€)</label>
        <input type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
          {repartition.map((r) => (
            <div key={r.lot} className="flex justify-between">
              <span>{r.lot}</span>
              <span>{r.montant} €</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function FeuillePresence() {
  const [participants, setParticipants] = useState('Dupont Marie\nDurand Paul\nMartin Léa');
  const lines = participants.split(/\n/).filter((p) => p.trim().length > 0);
  const pdf = () =>
    generateSimplePdf('Feuille de présence AG', [{ heading: 'Participants', lines }], 'presence-ag.pdf');
  return (
    <Container title="Feuille de présence AG" description="Préparez la feuille à faire signer avant le démarrage.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Participants (un par ligne)</label>
        <textarea value={participants} onChange={(e) => setParticipants(e.target.value)} rows={6} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
      </div>
    </Container>
  );
}

function FluxSci() {
  const [revenus, setRevenus] = useState(12000);
  const [charges, setCharges] = useState(3000);
  const [associes, setAssocies] = useState('Alice:60\nBruno:40');
  const parsed = associes
    .split(/\n/)
    .map((line) => line.split(':'))
    .filter((parts) => parts.length === 2 && !Number.isNaN(Number(parts[1].trim())))
    .map(([name, parts]) => ({ name: name.trim(), parts: Number(parts.trim()) }));
  const repartition = sciFlowDistribution(parsed, revenus, charges);
  const pdf = () =>
    generateSimplePdf(
      'Répartition flux SCI',
      [{ heading: 'Flux par associé', lines: repartition.map((r) => `${r.name}: +${r.revenus}€ / -${r.charges}€ = ${r.net}€`) }],
      'flux-sci.pdf'
    );
  return (
    <Container title="Répartition des flux SCI" description="Ventilez loyers et charges selon les parts de chaque associé.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Revenus annuels (€)</label>
        <input type="number" value={revenus} onChange={(e) => setRevenus(Number(e.target.value))} />
        <label className="text-sm font-medium">Charges annuelles (€)</label>
        <input type="number" value={charges} onChange={(e) => setCharges(Number(e.target.value))} />
        <label className="text-sm font-medium">Associés (Nom:Parts)</label>
        <textarea value={associes} onChange={(e) => setAssocies(e.target.value)} rows={5} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
          {repartition.map((r) => (
            <div key={r.name} className="flex justify-between">
              <span>{r.name}</span>
              <span>Net {r.net} €</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function DecisionSci() {
  const [titre, setTitre] = useState('Décision AGO');
  const [objet, setObjet] = useState('Affectation du résultat');
  const [texte, setTexte] = useState('Décision prise à la majorité des parts présentes.');
  const pdf = () =>
    generateSimplePdf(
      'Décision SCI',
      [
        { heading: titre, lines: [objet] },
        { heading: 'Texte', lines: [texte] }
      ],
      'decision-sci.pdf'
    );
  return (
    <Container title="Décision SCI" description="Générez un modèle AGO/AGE prêt à signer.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Titre</label>
        <input value={titre} onChange={(e) => setTitre(e.target.value)} />
        <label className="text-sm font-medium">Objet</label>
        <input value={objet} onChange={(e) => setObjet(e.target.value)} />
        <label className="text-sm font-medium">Texte de la décision</label>
        <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={6} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
      </div>
    </Container>
  );
}

function CompteCourant() {
  const [initial, setInitial] = useState(5000);
  const [mouvementsInput, setMouvementsInput] = useState('APPORT:1500\nRETRAIT:800');
  const mouvements = mouvementsInput
    .split(/\n/)
    .map((line) => line.split(':'))
    .filter((p) => p.length === 2 && !Number.isNaN(Number(p[1].trim())))
    .map(([type, montant]) => ({ type: type.trim() === 'RETRAIT' ? 'RETRAIT' : 'APPORT', montant: Number(montant.trim()) }));
  const solde = sciCompteCourant(initial, mouvements);
  const pdf = () =>
    generateSimplePdf(
      'Compte courant associé',
      [
        { heading: 'Mouvements', lines: mouvements.map((m) => `${m.type}: ${m.montant} €`) },
        { heading: 'Solde', lines: [`${solde.solde} €`] }
      ],
      'compte-courant.pdf'
    );
  return (
    <Container title="Compte courant d’associé" description="Suivez apports et retraits par associé.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Solde initial (€)</label>
        <input type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} />
        <label className="text-sm font-medium">Mouvements (APPORT/RETRAIT:Montant)</label>
        <textarea value={mouvementsInput} onChange={(e) => setMouvementsInput(e.target.value)} rows={5} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <p className="text-sm font-semibold">Solde actuel : {solde.solde} €</p>
      </div>
    </Container>
  );
}

function CalendrierSci() {
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const obligations = sciCalendarObligations(annee);
  const pdf = () =>
    generateSimplePdf('Calendrier obligations SCI', [{ heading: `${annee}`, lines: obligations.map((o) => `${o.date} - ${o.titre}`) }], 'obligations-sci.pdf');
  return (
    <Container title="Calendrier obligations SCI" description="Rappelez-vous des jalons annuels de votre SCI.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Année</label>
        <input type="number" value={annee} onChange={(e) => setAnnee(Number(e.target.value))} />
        <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
        <ul className="text-sm space-y-1">
          {obligations.map((o) => (
            <li key={o.titre} className="flex justify-between">
              <span>{o.titre}</span>
              <span>{o.date}</span>
            </li>
          ))}
        </ul>
        <OutilCTA />
      </div>
    </Container>
  );
}

function QuittanceColoc() {
  const [locataire, setLocataire] = useState('Camille');
  const [mois, setMois] = useState('2024-06');
  const [loyer, setLoyer] = useState(520);
  const [charges, setCharges] = useState(80);
  const quittance = generateQuittance(loyer, charges, locataire, mois);
  const pdf = () =>
    generateSimplePdf(
      'Quittance colocation',
      [
        { heading: `${quittance.locataire} - ${quittance.mois}`, lines: [`Loyer: ${quittance.loyer} €`, `Charges: ${quittance.charges} €`, `Total: ${quittance.total} €`] }
      ],
      'quittance-coloc.pdf'
    );
  return (
    <Container title="Quittance colocation" description="Générez une quittance individuelle en quelques clics.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Locataire</label>
        <input value={locataire} onChange={(e) => setLocataire(e.target.value)} />
        <label className="text-sm font-medium">Mois (AAAA-MM)</label>
        <input value={mois} onChange={(e) => setMois(e.target.value)} />
        <label className="text-sm font-medium">Loyer (€)</label>
        <input type="number" value={loyer} onChange={(e) => setLoyer(Number(e.target.value))} />
        <label className="text-sm font-medium">Charges (€)</label>
        <input type="number" value={charges} onChange={(e) => setCharges(Number(e.target.value))} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <p className="text-sm">Total : {quittance.total} €</p>
      </div>
    </Container>
  );
}

function ChargesColoc() {
  const [charges, setCharges] = useState(240);
  const [mode, setMode] = useState<'EGALITAIRE' | 'PONDERATION_CHAMBRE'>('EGALITAIRE');
  const [chambres, setChambres] = useState('Ch1:1\nCh2:1\nCh3:1');
  const parsed = chambres
    .split(/\n/)
    .map((line) => line.split(':'))
    .filter((parts) => parts.length === 2 && !Number.isNaN(Number(parts[1].trim())))
    .map(([nom, ponderation]) => ({ nom: nom.trim(), ponderation: Number(ponderation.trim()) }));
  const repartition = colocationCharges(charges, mode, parsed);
  const pdf = () =>
    generateSimplePdf(
      'Répartition charges colocation',
      [{ heading: 'Détail', lines: repartition.map((r) => `${r.chambre}: ${r.montant} €`) }],
      'charges-coloc.pdf'
    );
  return (
    <Container title="Répartition des charges colocation" description="Ventilez les charges par chambre ou égalitairement.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Charges mensuelles (€)</label>
        <input type="number" value={charges} onChange={(e) => setCharges(Number(e.target.value))} />
        <label className="text-sm font-medium">Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as 'EGALITAIRE' | 'PONDERATION_CHAMBRE')}>
          <option value="EGALITAIRE">Égalitaire</option>
          <option value="PONDERATION_CHAMBRE">Pondération par chambre</option>
        </select>
        <label className="text-sm font-medium">Chambres (Nom:Pondération)</label>
        <textarea value={chambres} onChange={(e) => setChambres(e.target.value)} rows={5} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
          {repartition.map((r) => (
            <div key={r.chambre} className="flex justify-between">
              <span>{r.chambre}</span>
              <span>{r.montant} €</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function EtatDesLieux() {
  const [pieces, setPieces] = useState('Chambre:Bon état\nSalle de bain:Dégradé léger');
  const synthese = etatDesLieuxSynthese(
    pieces
      .split(/\n/)
      .map((line) => line.split(':'))
      .filter((p) => p.length === 2)
      .map(([nom, etat]) => ({ nom: nom.trim(), etat: etat.trim() }))
  );
  const pdf = () =>
    generateSimplePdf(
      "État des lieux",
      [{ heading: 'Synthèse', lines: synthese.synthese }],
      'etat-des-lieux.pdf'
    );
  return (
    <Container title="État des lieux colocation" description="Tracez l’état des pièces et partagez le PDF.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Pièces (Nom:État)</label>
        <textarea value={pieces} onChange={(e) => setPieces(e.target.value)} rows={6} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        {synthese.alertes.length > 0 && <p className="text-sm text-red-600">Alertes : {synthese.alertes.length}</p>}
      </div>
    </Container>
  );
}

function ReglementInterieur() {
  const [rules, setRules] = useState('Silence après 22h\nNettoyage hebdomadaire\nPas de sous-location');
  const data = reglementInterieur(rules.split(/\n/));
  const pdf = () =>
    generateSimplePdf('Règlement intérieur colocation', [{ heading: 'Règles', lines: data.sections }], 'reglement-coloc.pdf');
  return (
    <Container title="Règlement intérieur colocation" description="Assemblez vos règles clés et exportez-les.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Règles (une par ligne)</label>
        <textarea value={rules} onChange={(e) => setRules(e.target.value)} rows={6} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <p className="text-sm">Nombre de règles : {data.total}</p>
      </div>
    </Container>
  );
}

function TauxOccupation() {
  const [chambres, setChambres] = useState('Ch1:OCCUPEE\nCh2:LIBRE\nCh3:OCCUPEE');
  const parsed = chambres
    .split(/\n/)
    .map((line) => line.split(':'))
    .filter((p) => p.length === 2)
    .map(([nom, statut]) => ({ nom: nom.trim(), statut: (statut.trim().toUpperCase() as 'LIBRE' | 'OCCUPEE' | 'RESERVEE') || 'LIBRE' }));
  const stats = tauxOccupation(parsed.map((p) => ({ statut: p.statut })));
  const pdf = () =>
    generateSimplePdf(
      'Taux d’occupation',
      [
        { heading: 'Chambres', lines: parsed.map((p) => `${p.nom}: ${p.statut}`) },
        { heading: 'Résultat', lines: [`Taux: ${stats.taux}%`, `Libres: ${stats.libres}`] }
      ],
      'taux-occupation.pdf'
    );
  return (
    <Container title="Taux d’occupation colocation" description="Mesurez le remplissage et anticipez les vacances.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Chambres (Nom:Statut)</label>
        <textarea value={chambres} onChange={(e) => setChambres(e.target.value)} rows={5} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <p className="text-sm font-semibold">Taux : {stats.taux}% – Libres : {stats.libres}</p>
      </div>
    </Container>
  );
}

function EstimationCharges() {
  const [chargesInput, setChargesInput] = useState('Énergie:120\nInternet:40\nEau:35');
  const [colocs, setColocs] = useState(3);
  const charges = chargesInput
    .split(/\n/)
    .map((line) => line.split(':'))
    .filter((p) => p.length === 2 && !Number.isNaN(Number(p[1].trim())))
    .map(([label, montant]) => ({ label: label.trim(), montant: Number(montant.trim()) }));
  const estimation = estimationChargesAnnuelles(charges.map((c) => c.montant), colocs);
  const pdf = () =>
    generateSimplePdf(
      'Estimation charges colocation',
      [
        { heading: 'Mensuel', lines: charges.map((c) => `${c.label}: ${c.montant} €`) },
        { heading: 'Annuel', lines: [`Total annuel: ${estimation.annuel} €`, `Par colocataire: ${estimation.parColoc} €`] }
      ],
      'charges-colocation.pdf'
    );
  return (
    <Container title="Estimation charges annuelles colocation" description="Projetez vos charges et le coût par colocataire.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Charges mensuelles (Nom:Montant)</label>
        <textarea value={chargesInput} onChange={(e) => setChargesInput(e.target.value)} rows={5} />
        <label className="text-sm font-medium">Nombre de colocataires</label>
        <input type="number" value={colocs} onChange={(e) => setColocs(Number(e.target.value))} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <p className="text-sm font-semibold">Total annuel : {estimation.annuel} € | Par colocataire : {estimation.parColoc} €</p>
      </div>
    </Container>
  );
}

function CalendrierGeneral() {
  const [type, setType] = useState<'COPRO' | 'SCI' | 'COLOC'>('COPRO');
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const obligations = obligationsGenerales(type, annee);
  const pdf = () =>
    generateSimplePdf(
      'Calendrier obligations',
      [{ heading: `${type} ${annee}`, lines: obligations.map((o) => `${o.date} - ${o.titre}`) }],
      'obligations.pdf'
    );
  return (
    <Container title="Calendrier annuel obligations légales" description="Planifiez vos jalons légaux copro/SCI/coloc.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as 'COPRO' | 'SCI' | 'COLOC')}>
          <option value="COPRO">Copropriété</option>
          <option value="SCI">SCI</option>
          <option value="COLOC">Colocation</option>
        </select>
        <label className="text-sm font-medium">Année</label>
        <input type="number" value={annee} onChange={(e) => setAnnee(Number(e.target.value))} />
        <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
        <ul className="text-sm space-y-1">
          {obligations.map((o) => (
            <li key={o.titre} className="flex justify-between">
              <span>{o.titre}</span>
              <span>{o.date}</span>
            </li>
          ))}
        </ul>
        <OutilCTA />
      </div>
    </Container>
  );
}

function GenerateurContrat() {
  const [titre, setTitre] = useState('Contrat de prestation');
  const [parties, setParties] = useState('Syndic bénévole / Prestataire');
  const [objet, setObjet] = useState('Nettoyage parties communes');
  const [duree, setDuree] = useState('12 mois');
  const result = generateContract({ titre, parties, objet, duree });
  const pdf = () =>
    generateSimplePdf('Contrat simple', [{ heading: titre, lines: [result] }], 'contrat.pdf');
  return (
    <Container title="Générateur de contrats" description="Assemblez un modèle de contrat simple.">
      <div className="card space-y-3">
        <label className="text-sm font-medium">Titre</label>
        <input value={titre} onChange={(e) => setTitre(e.target.value)} />
        <label className="text-sm font-medium">Parties</label>
        <input value={parties} onChange={(e) => setParties(e.target.value)} />
        <label className="text-sm font-medium">Objet</label>
        <input value={objet} onChange={(e) => setObjet(e.target.value)} />
        <label className="text-sm font-medium">Durée</label>
        <input value={duree} onChange={(e) => setDuree(e.target.value)} />
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
        <p className="text-sm">Résumé : {result}</p>
      </div>
    </Container>
  );
}

function QuizSyndic() {
  const questions = [
    'Savez-vous organiser une AG ?',
    'Pouvez-vous suivre un budget simple ?',
    'Avez-vous un accès aux relevés bancaires ?',
    'Pouvez-vous communiquer régulièrement avec les copropriétaires ?',
    'Êtes-vous prêt à gérer les rappels ?'
  ];
  const [answers, setAnswers] = useState<Record<number, 'OUI' | 'NON'>>({});
  const result = quizScore(questions.map((_, idx) => answers[idx] || 'NON'));
  const pdf = () =>
    generateSimplePdf(
      'Quiz syndic bénévole',
      [
        { heading: 'Réponses', lines: questions.map((q, idx) => `${q}: ${answers[idx] || 'NON'}`) },
        { heading: 'Score', lines: [`${result.score}/${questions.length} - ${result.niveau}`] }
      ],
      'quiz-syndic.pdf'
    );
  return (
    <Container title="Quiz syndic bénévole" description="Évaluez votre préparation en 2 minutes.">
      <div className="card space-y-3">
        {questions.map((q, idx) => (
          <div key={q} className="flex items-center justify-between">
            <span className="text-sm">{q}</span>
            <select
              value={answers[idx] || 'NON'}
              onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value as 'OUI' | 'NON' })}
              className="w-32"
            >
              <option value="NON">Non</option>
              <option value="OUI">Oui</option>
            </select>
          </div>
        ))}
        <p className="text-sm font-semibold">Score : {result.score}/{questions.length} – Niveau : {result.niveau}</p>
        <div className="flex items-center gap-3">
          <button onClick={pdf} className="btn-primary text-sm">Exporter PDF</button>
          <OutilCTA />
        </div>
      </div>
    </Container>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (val: boolean) => void }) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
