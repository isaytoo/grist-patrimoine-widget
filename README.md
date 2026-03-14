# Grist Patrimoine Immobilier Widget

Widget Grist pour la consultation et l'analyse du patrimoine immobilier avec filtres avancés et exports Excel.

## Fonctionnalités

### 📊 Consultation globale
- **Filtres multi-critères** : Type bâtiment, gestionnaire, type lot, périmètre, zone opérationnelle, statut locatif, type bail, actif, bâti
- **Filtres multi-sélection** avec toggle buttons et "Tout sélectionner"
- **Indicateurs en temps réel** : Sites, Bâtiments, Lots, Parcelles uniques
- **Tableau agrégé par site** avec décomptes
- **Exports Excel** :
  - Synthèse (agrégé par site)
  - Détail (ligne par ligne)

### 📋 Recherche par site
- **Recherche rapide** par numéro de site avec suggestions automatiques
- **Fiche détaillée** du site avec : informations, indicateurs, bâtiments et lots
- **Affichage structuré** des bâtiments et de leurs lots respectifs
- **Export Excel** de la fiche site complète
- **Interface responsive** et moderne

### 🎯 Interface
- **Système d'onglets** pour basculer entre Consultation globale et Recherche par site
- **Design moderne** avec animations et interactions fluides
- **Responsive** sur tous les appareils

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/isaytoo/grist-patrimoine-widget.git
cd grist-patrimoine-widget
```

2. Déployer sur Vercel :
```bash
npm install -g vercel
vercel --prod
```

3. Utiliser dans Grist :
   - Ajouter un widget personnalisé
   - URL : `https://grist-patrimoine-widget.vercel.app`
   - Sélectionner la table contenant les données patrimoniales
   - Mapper les colonnes requises

## Colonnes requises

Le widget attend les colonnes suivantes dans votre table Grist :

- `Site` - Numéro du site
- `Libelle_site` - Libellé du site
- `Adresse_site` - Adresse du site
- `Commune_site` - Commune du site
- `Type_batiment` - Type de bâtiment
- `Gestionnaire` - Gestionnaire
- `Type_lot` - Type de lot
- `Perimetre` - Périmètre
- `Zone_operationnelle` - Zone opérationnelle
- `Statut_locatif` - Statut locatif
- `NOM_TYPE_BAIL` - Type de bail
- `ACTIF` - Actif/inactif
- `BATI` - Bâti/non bâti
- `SiteBatiment` - Identifiant unique bâtiment
- `SiteBatLot` - Identifiant unique lot
- `N_parcelle` - Numéro de parcelle
- `Libelle_batiment` - Libellé bâtiment
- `Libelle_lot` - Libellé lot
- `Bat` - Numéro bâtiment
- `N_Lot` - Numéro lot

## Licence

Apache License 2.0 - voir le fichier LICENSE pour les détails.

## Auteur

Said Hamadou (isaytoo) - https://gristup.fr
