export type ToolConfig = {
  slug: string;
  title: string;
  description: string;
  ogDescription: string;
};

export const toolsConfig: ToolConfig[] = [
  {
    slug: 'calculateur-tantiemes-copro',
    title: 'Calculateur de tantièmes copropriété',
    description: 'Répartissez les tantièmes automatiquement pour vos lots.',
    ogDescription: 'Répartition automatique des tantièmes pour copropriétés 4–20 lots.'
  },
  {
    slug: 'convocation-ag-copro',
    title: 'Générateur de convocation AG copro',
    description: 'Créez une convocation claire avec ordre du jour en PDF.',
    ogDescription: 'Convocation AG prête à l’emploi pour petites copropriétés.'
  },
  {
    slug: 'pv-ag-copro',
    title: 'Générateur de procès-verbal AG',
    description: 'Générez un PV structuré avec décisions et votes.',
    ogDescription: 'PV d’AG prêt à signer pour les copropriétés bénévoles.'
  },
  {
    slug: 'checklist-conformite-ag',
    title: 'Vérificateur de conformité AG',
    description: 'Checklist interactive pour sécuriser vos AG.',
    ogDescription: 'Contrôlez vos obligations AG en quelques clics.'
  },
  {
    slug: 'budget-previsionnel-copro',
    title: 'Générateur de budget prévisionnel',
    description: 'Projetez vos charges annuelles et exports CSV/PDF.',
    ogDescription: 'Budget prévisionnel copro en un tableau clair.'
  },
  {
    slug: 'appels-de-fonds',
    title: 'Générateur d’avis d’appels de fonds',
    description: 'Ventilez un appel de charges par lot et exportez le PDF.',
    ogDescription: 'Avis d’appels de fonds multi-lots instantanés.'
  },
  {
    slug: 'feuille-presence-ag',
    title: 'Feuille de présence AG',
    description: 'Listez les copropriétaires et exportez la feuille signable.',
    ogDescription: 'Feuille de présence AG prête à imprimer.'
  },
  {
    slug: 'repartition-flux-sci',
    title: 'Calculatrice de répartition des flux SCI',
    description: 'Répartissez loyers et charges selon les parts.',
    ogDescription: 'Flux SCI répartis par pourcentage de détention.'
  },
  {
    slug: 'decision-sci',
    title: 'Générateur de décision SCI',
    description: 'Créez un modèle de décision AGO/AGE en PDF.',
    ogDescription: 'Modèles de décisions SCI clairs et conformes.'
  },
  {
    slug: 'compte-courant-associe',
    title: "Calculateur de compte courant d'associé",
    description: 'Suivez apports et retraits par associé.',
    ogDescription: 'Solde de compte courant SCI en temps réel.'
  },
  {
    slug: 'calendrier-obligations-sci',
    title: 'Calendrier obligations légales SCI',
    description: 'Synthèse des obligations annuelles de votre SCI.',
    ogDescription: 'Calendrier légal SCI exportable en PDF.'
  },
  {
    slug: 'quittance-colocation',
    title: 'Générateur de quittances colocation',
    description: 'Quittance individuelle avec loyer et charges.',
    ogDescription: 'Quittance colocation format A4.'
  },
  {
    slug: 'repartition-charges-colocation',
    title: 'Calculatrice de répartition charges colocation',
    description: 'Répartissez les charges équitablement ou par pondération.',
    ogDescription: 'Charges colocation ventilées en quelques secondes.'
  },
  {
    slug: 'etat-des-lieux-colocation',
    title: "Générateur d'état des lieux colocation",
    description: 'Tracez l’état des pièces et exportez le PDF.',
    ogDescription: 'État des lieux clair pour chaque chambre.'
  },
  {
    slug: 'reglement-interieur-colocation',
    title: 'Générateur de règlement intérieur colocation',
    description: 'Assemblez vos règles clés et exportez le document.',
    ogDescription: 'Règlement intérieur prêt à partager aux colocataires.'
  },
  {
    slug: 'taux-occupation-colocation',
    title: 'Calculateur taux d’occupation colocation',
    description: 'Mesurez l’occupation et anticipez les vacances.',
    ogDescription: 'Suivi simple du remplissage des chambres.'
  },
  {
    slug: 'estimation-charges-colocation',
    title: 'Estimation charges annuelles colocation',
    description: 'Projetez les charges et le coût par colocataire.',
    ogDescription: 'Estimation charges annuelles en quelques clics.'
  },
  {
    slug: 'calendrier-obligations-annuel',
    title: 'Calendrier annuel obligations légales',
    description: 'Planifiez vos jalons légaux copro/SCI/coloc.',
    ogDescription: 'Calendrier légal multi-produit exportable.'
  },
  {
    slug: 'generateur-contrats-documents',
    title: 'Générateur de contrats et documents',
    description: 'Assemblez un modèle de contrat simple.',
    ogDescription: 'Contrats prêts en quelques champs.'
  },
  {
    slug: 'quiz-syndic-benevole',
    title: 'Test interactif “Êtes-vous prêt à devenir syndic bénévole ?”',
    description: 'Quiz rapide pour évaluer votre préparation.',
    ogDescription: 'Auto-diagnostic syndic bénévole.'
  }
];
