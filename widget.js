/**
 * Grist Patrimoine Immobilier Widget
 * Copyright 2026 Said Hamadou (isaytoo)
 * Licensed under the Apache License, Version 2.0
 * https://github.com/isaytoo/grist-patrimoine-widget
 */

// Variables globales
let allData = [];
let filteredData = [];
let selectedTypeLot = new Set();
let selectedPerimetre = new Set();
let selectedStatutLocatif = new Set();
let selectedTypeBail = new Set();
let selectedActif = new Set();
let selectedBati = new Set();

// Éléments DOM
let filterTypeBatiment, filterGestionnaire, filterCommune, filterTypeLotContainer, filterPerimetreContainer;
let filterZone, filterStatutLocatifContainer, filterTypeBailContainer, filterActifContainer, filterBatiContainer;
let toggleAllTypeLot, toggleAllPerimetre, toggleAllStatutLocatif, toggleAllTypeBail, toggleAllActif, toggleAllBati;
let btnFilter, btnReset, btnExport, btnExportDetail, tableContainer, resultsCount;
let countSites, countBatiments, countLots, countParcelles;
let siteSearch, btnSearch, btnClear, siteMainContent, suggestionsContainer, suggestionsList;

// Initialiser le widget quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
  // Récupérer les éléments DOM
  filterTypeBatiment = document.getElementById('filter-type-batiment');
  filterGestionnaire = document.getElementById('filter-gestionnaire');
  filterCommune = document.getElementById('filter-commune');
  filterTypeLotContainer = document.getElementById('filter-type-lot');
  filterPerimetreContainer = document.getElementById('filter-perimetre');
  filterZone = document.getElementById('filter-zone');
  filterStatutLocatifContainer = document.getElementById('filter-statut-locatif');
  filterTypeBailContainer = document.getElementById('filter-type-bail');
  filterActifContainer = document.getElementById('filter-actif');
  filterBatiContainer = document.getElementById('filter-bati');
  toggleAllTypeLot = document.getElementById('toggle-all-type-lot');
  toggleAllPerimetre = document.getElementById('toggle-all-perimetre');
  toggleAllStatutLocatif = document.getElementById('toggle-all-statut-locatif');
  toggleAllTypeBail = document.getElementById('toggle-all-type-bail');
  toggleAllActif = document.getElementById('toggle-all-actif');
  toggleAllBati = document.getElementById('toggle-all-bati');
  btnFilter = document.getElementById('btn-filter');
  btnReset = document.getElementById('btn-reset');
  btnExport = document.getElementById('btn-export');
  btnExportDetail = document.getElementById('btn-export-detail');
  tableContainer = document.getElementById('table-container');
  resultsCount = document.getElementById('results-count');
  countSites = document.getElementById('count-sites');
  countBatiments = document.getElementById('count-batiments');
  countLots = document.getElementById('count-lots');
  countParcelles = document.getElementById('count-parcelles');
  siteSearch = document.getElementById('site-search');
  btnSearch = document.getElementById('btn-search');
  btnClear = document.getElementById('btn-clear');
  siteMainContent = document.getElementById('site-main-content');
  suggestionsContainer = document.getElementById('suggestions-container');
  suggestionsList = document.getElementById('suggestions-list');
  
  setupEventListeners();
  setupTabListeners();
  setupSearchListeners();
});

function setupEventListeners() {
// Initialisation Grist
grist.ready({
  requiredAccess: 'read table',
  columns: [
    { name: 'Site', type: 'Text' },
    { name: 'Libelle_site', type: 'Text' },
    { name: 'Adresse_site', type: 'Text' },
    { name: 'Commune_site', type: 'Text' },
    { name: 'Type_batiment', type: 'Text' },
    { name: 'Gestionnaire', type: 'Text' },
    { name: 'Type_lot', type: 'Text' },
    { name: 'Perimetre', type: 'Text' },
    { name: 'Zone_operationnelle', type: 'Text' },
    { name: 'Statut_locatif', type: 'Text' },
    { name: 'NOM_TYPE_BAIL', type: 'Text' },
    { name: 'ACTIF', type: 'Text' },
    { name: 'BATI', type: 'Text' },
    { name: 'SiteBatiment', type: 'Text' },
    { name: 'SiteBatLot', type: 'Text' },
    { name: 'N_parcelle', type: 'Text' },
    { name: 'Libelle_batiment', type: 'Text' },
    { name: 'Libelle_lot', type: 'Text' },
    { name: 'Bat', type: 'Text' },
    { name: 'N_Lot', type: 'Text' }
  ]
});

// Charger les données quand les enregistrements changent
grist.onRecords(function(records) {
  console.log('Données reçues:', records.length, 'enregistrements');
  allData = records;
  populateFilters();
  applyFilters();
});

// Event listeners pour les filtres
btnFilter.addEventListener('click', applyFilters);
btnReset.addEventListener('click', resetFilters);
btnExport.addEventListener('click', exportToExcel);
btnExportDetail.addEventListener('click', exportToExcelDetail);

// Filtrage automatique au changement
filterTypeBatiment.addEventListener('change', applyFilters);
filterGestionnaire.addEventListener('change', applyFilters);
filterCommune.addEventListener('change', applyFilters);
filterZone.addEventListener('change', applyFilters);

// Toggle all buttons
toggleAllTypeLot.addEventListener('click', () => toggleSelectAll(filterTypeLotContainer, selectedTypeLot));
toggleAllPerimetre.addEventListener('click', () => toggleSelectAll(filterPerimetreContainer, selectedPerimetre));
toggleAllStatutLocatif.addEventListener('click', () => toggleSelectAll(filterStatutLocatifContainer, selectedStatutLocatif));
toggleAllTypeBail.addEventListener('click', () => toggleSelectAll(filterTypeBailContainer, selectedTypeBail));
toggleAllActif.addEventListener('click', () => toggleSelectAll(filterActifContainer, selectedActif));
toggleAllBati.addEventListener('click', () => toggleSelectAll(filterBatiContainer, selectedBati));

} // Fin de setupEventListeners

// =============================================================================
// FONCTIONS UTILITAIRES ET FILTRES
// =============================================================================

// Peupler les filtres avec les valeurs uniques
function populateFilters() {
  const uniqueValues = {
    Type_batiment: new Set(),
    Gestionnaire: new Set(),
    Commune_site: new Set(),
    Type_lot: new Set(),
    Perimetre: new Set(),
    Zone_operationnelle: new Set(),
    Statut_locatif: new Set(),
    NOM_TYPE_BAIL: new Set(),
    ACTIF: new Set(),
    BATI: new Set()
  };
  
  allData.forEach(row => {
    if (row.Type_batiment) uniqueValues.Type_batiment.add(row.Type_batiment);
    if (row.Gestionnaire) uniqueValues.Gestionnaire.add(row.Gestionnaire);
    if (row.Commune_site) uniqueValues.Commune_site.add(row.Commune_site);
    if (row.Type_lot) uniqueValues.Type_lot.add(row.Type_lot);
    if (row.Perimetre) uniqueValues.Perimetre.add(row.Perimetre);
    if (row.Zone_operationnelle) uniqueValues.Zone_operationnelle.add(row.Zone_operationnelle);
    if (row.Statut_locatif) uniqueValues.Statut_locatif.add(row.Statut_locatif);
    if (row.NOM_TYPE_BAIL) uniqueValues.NOM_TYPE_BAIL.add(row.NOM_TYPE_BAIL);
    if (row.ACTIF) uniqueValues.ACTIF.add(row.ACTIF);
    if (row.BATI) uniqueValues.BATI.add(row.BATI);
  });
  
  populateSelect(filterTypeBatiment, uniqueValues.Type_batiment);
  populateSelect(filterGestionnaire, uniqueValues.Gestionnaire);
  populateSelect(filterCommune, uniqueValues.Commune_site);
  populateToggleGroup(filterTypeLotContainer, uniqueValues.Type_lot, selectedTypeLot);
  populateToggleGroup(filterPerimetreContainer, uniqueValues.Perimetre, selectedPerimetre);
  populateSelect(filterZone, uniqueValues.Zone_operationnelle);
  populateToggleGroup(filterStatutLocatifContainer, uniqueValues.Statut_locatif, selectedStatutLocatif);
  populateToggleGroup(filterTypeBailContainer, uniqueValues.NOM_TYPE_BAIL, selectedTypeBail);
  populateToggleGroup(filterActifContainer, uniqueValues.ACTIF, selectedActif);
  populateToggleGroup(filterBatiContainer, uniqueValues.BATI, selectedBati);
}

// Peupler un groupe de toggle buttons
function populateToggleGroup(container, values, selectedSet) {
  container.innerHTML = '';
  
  const sortedValues = Array.from(values).sort((a, b) => 
    String(a).localeCompare(String(b), 'fr')
  );
  
  sortedValues.forEach(value => {
    if (value && String(value).trim()) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toggle-btn' + (selectedSet.has(value) ? ' active' : '');
      btn.textContent = value;
      btn.dataset.value = value;
      btn.addEventListener('click', () => {
        if (selectedSet.has(value)) {
          selectedSet.delete(value);
          btn.classList.remove('active');
        } else {
          selectedSet.add(value);
          btn.classList.add('active');
        }
        applyFilters();
      });
      container.appendChild(btn);
    }
  });
}

function populateSelect(select, values) {
  const currentValue = select.value;
  select.innerHTML = '<option value="">Tous</option>';
  
  const sortedValues = Array.from(values).sort((a, b) => 
    String(a).localeCompare(String(b), 'fr')
  );
  
  sortedValues.forEach(value => {
    if (value && String(value).trim()) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
  });
  
  // Restaurer la valeur si elle existe encore
  if (currentValue && Array.from(select.options).some(o => o.value === currentValue)) {
    select.value = currentValue;
  }
}

// Appliquer les filtres
function applyFilters() {
  const filters = {
    Type_batiment: filterTypeBatiment.value,
    Gestionnaire: filterGestionnaire.value,
    Commune_site: filterCommune.value,
    Zone_operationnelle: filterZone.value
  };
  
  filteredData = allData.filter(row => {
    if (filters.Type_batiment && row.Type_batiment !== filters.Type_batiment) return false;
    if (filters.Gestionnaire && row.Gestionnaire !== filters.Gestionnaire) return false;
    if (filters.Commune_site && row.Commune_site !== filters.Commune_site) return false;
    // Filtres multi-sélection : si aucun sélectionné, tout passe
    if (selectedTypeLot.size > 0 && !selectedTypeLot.has(row.Type_lot)) return false;
    if (selectedPerimetre.size > 0 && !selectedPerimetre.has(row.Perimetre)) return false;
    if (filters.Zone_operationnelle && row.Zone_operationnelle !== filters.Zone_operationnelle) return false;
    if (selectedStatutLocatif.size > 0 && !selectedStatutLocatif.has(row.Statut_locatif)) return false;
    if (selectedTypeBail.size > 0 && !selectedTypeBail.has(row.NOM_TYPE_BAIL)) return false;
    if (selectedActif.size > 0 && !selectedActif.has(row.ACTIF)) return false;
    if (selectedBati.size > 0 && !selectedBati.has(row.BATI)) return false;
    return true;
  });
  
  updateIndicators();
  renderTable();
}

// Mettre à jour les indicateurs
function updateIndicators() {
  // Compter les valeurs uniques
  const uniqueSites = new Set();
  const uniqueBatiments = new Set();
  const uniqueLots = new Set();
  const uniqueParcelles = new Set();
  
  filteredData.forEach(row => {
    if (row.Site) uniqueSites.add(row.Site);
    if (row.SiteBatiment) uniqueBatiments.add(row.SiteBatiment);
    if (row.SiteBatLot) uniqueLots.add(row.SiteBatLot);
    if (row.N_parcelle) uniqueParcelles.add(row.N_parcelle);
  });
  
  countSites.textContent = uniqueSites.size.toLocaleString('fr-FR');
  countBatiments.textContent = uniqueBatiments.size.toLocaleString('fr-FR');
  countLots.textContent = uniqueLots.size.toLocaleString('fr-FR');
  countParcelles.textContent = uniqueParcelles.size.toLocaleString('fr-FR');
}

// Afficher le tableau des résultats
function renderTable() {
  if (filteredData.length === 0) {
    tableContainer.innerHTML = '<div class="no-data">Aucun résultat trouvé</div>';
    resultsCount.textContent = '0 ligne';
    return;
  }
  
  // Agréger par site pour éviter les doublons
  const siteMap = new Map();
  
  filteredData.forEach(row => {
    const siteKey = row.Site || 'N/A';
    
    if (!siteMap.has(siteKey)) {
      siteMap.set(siteKey, {
        Site: row.Site || '',
        Commune: row.Commune_site || '',
        Libelle: row.Libelle_site || '',
        Adresse: row.Adresse_site || '',
        Gestionnaires: new Set(),
        TypesBatiment: new Set(),
        TypesLot: new Set(),
        NbBatiments: new Set(),
        NbLots: new Set(),
        NbParcelles: new Set()
      });
    }
    
    const site = siteMap.get(siteKey);
    if (row.Gestionnaire) site.Gestionnaires.add(row.Gestionnaire);
    if (row.Type_batiment) site.TypesBatiment.add(row.Type_batiment);
    if (row.Type_lot) site.TypesLot.add(row.Type_lot);
    if (row.SiteBatiment) site.NbBatiments.add(row.SiteBatiment);
    if (row.SiteBatLot) site.NbLots.add(row.SiteBatLot);
    if (row.N_parcelle) site.NbParcelles.add(row.N_parcelle);
  });
  
  const sites = Array.from(siteMap.values());
  
  resultsCount.textContent = `${sites.length.toLocaleString('fr-FR')} site${sites.length > 1 ? 's' : ''} (${filteredData.length.toLocaleString('fr-FR')} lignes)`;
  
  let html = `
    <table>
      <thead>
        <tr>
          <th>N° Site</th>
          <th>Commune</th>
          <th>Libellé</th>
          <th>Adresse</th>
          <th>Gestionnaire(s)</th>
          <th>Type(s) bâtiment</th>
          <th>Bât.</th>
          <th>Lots</th>
          <th>Parc.</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  sites.forEach(site => {
    html += `
      <tr>
        <td><strong>${escapeHtml(site.Site)}</strong></td>
        <td>${escapeHtml(site.Commune)}</td>
        <td>${escapeHtml(site.Libelle)}</td>
        <td>${escapeHtml(site.Adresse)}</td>
        <td>${escapeHtml(Array.from(site.Gestionnaires).join(', '))}</td>
        <td>${escapeHtml(Array.from(site.TypesBatiment).join(', '))}</td>
        <td>${site.NbBatiments.size}</td>
        <td>${site.NbLots.size}</td>
        <td>${site.NbParcelles.size}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  tableContainer.innerHTML = html;
}

// Échapper le HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

// Réinitialiser les filtres
function resetFilters() {
  filterTypeBatiment.value = '';
  filterGestionnaire.value = '';
  filterCommune.value = '';
  filterZone.value = '';
  
  // Réinitialiser les toggles
  selectedTypeLot.clear();
  selectedPerimetre.clear();
  selectedStatutLocatif.clear();
  selectedTypeBail.clear();
  selectedActif.clear();
  selectedBati.clear();
  filterTypeLotContainer.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  filterPerimetreContainer.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  filterStatutLocatifContainer.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  filterTypeBailContainer.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  filterActifContainer.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  filterBatiContainer.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  
  applyFilters();
}

// Tout sélectionner / désélectionner
function toggleSelectAll(container, selectedSet) {
  const buttons = container.querySelectorAll('.toggle-btn');
  const allSelected = selectedSet.size === buttons.length;
  
  if (allSelected) {
    // Désélectionner tout
    selectedSet.clear();
    buttons.forEach(btn => btn.classList.remove('active'));
  } else {
    // Sélectionner tout
    buttons.forEach(btn => {
      selectedSet.add(btn.dataset.value);
      btn.classList.add('active');
    });
  }
  applyFilters();
}

// Exporter la synthèse (agrégé par site)
function exportToExcel() {
  if (filteredData.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }
  
  // Agréger par site (même logique que renderTable)
  const siteMap = new Map();
  
  filteredData.forEach(row => {
    const siteKey = row.Site || 'N/A';
    
    if (!siteMap.has(siteKey)) {
      siteMap.set(siteKey, {
        'N° Site': row.Site || '',
        'Commune': row.Commune_site || '',
        'Libellé': row.Libelle_site || '',
        'Adresse': row.Adresse_site || '',
        'Gestionnaires': new Set(),
        'Types bâtiment': new Set(),
        'Statuts locatifs': new Set(),
        'Types bail': new Set(),
        'Nb Bâtiments': new Set(),
        'Nb Lots': new Set(),
        'Nb Parcelles': new Set()
      });
    }
    
    const site = siteMap.get(siteKey);
    if (row.Gestionnaire) site['Gestionnaires'].add(row.Gestionnaire);
    if (row.Type_batiment) site['Types bâtiment'].add(row.Type_batiment);
    if (row.Statut_locatif) site['Statuts locatifs'].add(row.Statut_locatif);
    if (row.NOM_TYPE_BAIL) site['Types bail'].add(row.NOM_TYPE_BAIL);
    if (row.SiteBatiment) site['Nb Bâtiments'].add(row.SiteBatiment);
    if (row.SiteBatLot) site['Nb Lots'].add(row.SiteBatLot);
    if (row.N_parcelle) site['Nb Parcelles'].add(row.N_parcelle);
  });
  
  // Convertir en tableau pour Excel
  const exportData = Array.from(siteMap.values()).map(site => ({
    'N° Site': site['N° Site'],
    'Commune': site['Commune'],
    'Libellé': site['Libellé'],
    'Adresse': site['Adresse'],
    'Gestionnaire(s)': Array.from(site['Gestionnaires']).join(', '),
    'Type(s) bâtiment': Array.from(site['Types bâtiment']).join(', '),
    'Statut(s) locatif': Array.from(site['Statuts locatifs']).join(', '),
    'Type(s) bail': Array.from(site['Types bail']).join(', '),
    'Nb Bâtiments': site['Nb Bâtiments'].size,
    'Nb Lots': site['Nb Lots'].size,
    'Nb Parcelles': site['Nb Parcelles'].size
  }));
  
  // Créer le workbook Excel
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Synthèse');
  
  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 12 }, // N° Site
    { wch: 20 }, // Commune
    { wch: 25 }, // Libellé
    { wch: 40 }, // Adresse
    { wch: 30 }, // Gestionnaire(s)
    { wch: 25 }, // Type(s) bâtiment
    { wch: 20 }, // Statut(s) locatif
    { wch: 20 }, // Type(s) bail
    { wch: 12 }, // Nb Bâtiments
    { wch: 10 }, // Nb Lots
    { wch: 12 }  // Nb Parcelles
  ];
  ws['!cols'] = colWidths;
  
  // Télécharger le fichier
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Export_Patrimoine_Synthese_${date}.xlsx`);
}

// Exporter le détail (ligne par ligne - détail des lots)
function exportToExcelDetail() {
  if (filteredData.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }
  
  // Convertir directement les données filtrées
  const exportData = filteredData.map(row => ({
    'N° Site': row.Site || '',
    'Libellé site': row.Libelle_site || '',
    'Commune': row.Commune_site || '',
    'Adresse site': row.Adresse_site || '',
    'N° Bâtiment': row.Bat || '',
    'Libellé bâtiment': row.Libelle_batiment || '',
    'Type bâtiment': row.Type_batiment || '',
    'N° Lot': row.N_Lot || '',
    'Libellé lot': row.Libelle_lot || '',
    'Type lot': row.Type_lot || '',
    'Statut locatif': row.Statut_locatif || '',
    'Type bail': row.NOM_TYPE_BAIL || '',
    'Actif': row.ACTIF || '',
    'Bâti': row.BATI || '',
    'Gestionnaire': row.Gestionnaire || '',
    'Périmètre': row.Perimetre || '',
    'Zone opérationnelle': row.Zone_operationnelle || '',
    'N° Parcelle': row.N_parcelle || ''
  }));
  
  // Créer le workbook Excel
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Détail');
  
  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 12 }, // N° Site
    { wch: 30 }, // Libellé site
    { wch: 20 }, // Commune
    { wch: 40 }, // Adresse site
    { wch: 12 }, // N° Bâtiment
    { wch: 30 }, // Libellé bâtiment
    { wch: 20 }, // Type bâtiment
    { wch: 12 }, // N° Lot
    { wch: 30 }, // Libellé lot
    { wch: 20 }, // Type lot
    { wch: 18 }, // Statut locatif
    { wch: 18 }, // Type bail
    { wch: 12 }, // Actif
    { wch: 12 }, // Bâti
    { wch: 25 }, // Gestionnaire
    { wch: 20 }, // Périmètre
    { wch: 25 }, // Zone opérationnelle
    { wch: 15 }  // N° Parcelle
  ];
  ws['!cols'] = colWidths;
  
  // Télécharger le fichier
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Export_Patrimoine_Detail_${date}.xlsx`);
}

// =============================================================================
// SYSTÈME D'ONGLETS
// =============================================================================

// Gestion des onglets
function switchTab(tabId) {
  // Masquer tous les contenus
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Désactiver tous les boutons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Afficher le contenu sélectionné
  document.getElementById(`tab-${tabId}`).classList.add('active');
  
  // Activer le bouton sélectionné
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// =============================================================================
// RECHERCHE PAR SITE
// =============================================================================

// Afficher des suggestions
function showSuggestions(searchTerm) {
  console.log('showSuggestions appelé, searchTerm:', searchTerm, 'allData.length:', allData.length);
  
  if (!searchTerm || searchTerm.length < 1) {
    suggestionsContainer.style.display = 'none';
    return;
  }
  
  if (allData.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }
  
  const uniqueSites = new Map();
  allData.forEach(row => {
    if (row.Site && !uniqueSites.has(row.Site)) {
      uniqueSites.set(row.Site, {
        site: row.Site,
        libelle: row.Libelle_site || ''
      });
    }
  });
  
  const matches = Array.from(uniqueSites.values())
    .filter(site => 
      String(site.site).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(site.libelle).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);
  
  if (matches.length > 0) {
    suggestionsList.innerHTML = '';
    matches.forEach(site => {
      const chip = document.createElement('div');
      chip.className = 'suggestion-chip';
      chip.textContent = `${site.site} - ${site.libelle}`;
      chip.onclick = () => {
        siteSearch.value = site.site;
        suggestionsContainer.style.display = 'none';
        displaySiteFiche();
      };
      suggestionsList.appendChild(chip);
    });
    suggestionsContainer.style.display = 'block';
  } else {
    suggestionsContainer.style.display = 'none';
  }
}

// Afficher la fiche du site
function displaySiteFiche() {
  const searchValue = siteSearch.value.trim();
  
  console.log('displaySiteFiche appelé, searchValue:', searchValue);
  console.log('allData disponible:', allData.length, 'enregistrements');
  
  if (!searchValue) {
    siteMainContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏢</div>
        <div class="empty-state-title">Recherchez un site</div>
        <div class="empty-state-text">Saisissez un numéro de site dans la barre de recherche ci-dessus</div>
      </div>
    `;
    return;
  }
  
  if (allData.length === 0) {
    siteMainContent.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-content">
          <div class="error-title">Données non chargées</div>
          <div class="error-text">Les données ne sont pas encore chargées. Veuillez patienter quelques instants.</div>
        </div>
      </div>
    `;
    return;
  }
  
  siteMainContent.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      Recherche en cours...
    </div>
  `;
  
  const siteData = allData.filter(row => 
    String(row.Site).toLowerCase() === searchValue.toLowerCase()
  );
  
  if (siteData.length === 0) {
    siteMainContent.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-content">
          <div class="error-title">Site non trouvé</div>
          <div class="error-text">Aucun site ne correspond au numéro "${escapeHtml(searchValue)}". Vérifiez votre saisie.</div>
        </div>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">Essayez une autre recherche</div>
        <div class="empty-state-text">Vérifiez l'orthographe ou essayez un autre numéro de site</div>
      </div>
    `;
    return;
  }
  
  const siteInfo = siteData[0];
  
  const uniqueBatiments = new Set();
  const uniqueLots = new Set();
  const uniqueParcelles = new Set();
  const uniqueGestionnaires = new Set();
  
  siteData.forEach(row => {
    if (row.SiteBatiment) uniqueBatiments.add(row.SiteBatiment);
    if (row.SiteBatLot) uniqueLots.add(row.SiteBatLot);
    if (row.N_parcelle) uniqueParcelles.add(row.N_parcelle);
    if (row.Gestionnaire) uniqueGestionnaires.add(row.Gestionnaire);
  });
  
  const batimentsMap = new Map();
  
  siteData.forEach(row => {
    const batKey = row.SiteBatiment || 'N/A';
    
    if (!batimentsMap.has(batKey)) {
      batimentsMap.set(batKey, {
        numero: row.Bat || '',
        libelle: row.Libelle_batiment || 'Bâtiment sans nom',
        type: row.Type_batiment || '',
        lots: []
      });
    }
    
    if (row.N_Lot) {
      batimentsMap.get(batKey).lots.push({
        numero: row.N_Lot,
        libelle: row.Libelle_lot || '',
        type: row.Type_lot || '',
        statut: row.Statut_locatif || '',
        bail: row.NOM_TYPE_BAIL || '',
        gestionnaire: row.Gestionnaire || '',
        perimetre: row.Perimetre || '',
        zone: row.Zone_operationnelle || '',
        parcelle: row.N_parcelle || ''
      });
    }
  });
  
  let html = `
    <div class="site-card">
      <div class="site-header">
        <div class="site-title-section">
          <div class="site-number">Site n° ${escapeHtml(siteInfo.Site)}</div>
          <h2 class="site-title">${escapeHtml(siteInfo.Libelle_site || 'Site sans nom')}</h2>
          <div class="site-address">
            📍 ${escapeHtml(siteInfo.Adresse_site || 'Adresse non renseignée')}${siteInfo.Commune_site ? '<br>🏙️ ' + escapeHtml(siteInfo.Commune_site) : ''}
          </div>
        </div>
        <div class="site-actions">
          <button class="btn btn-export" onclick="exportSiteFiche()">📥 Exporter Excel</button>
        </div>
      </div>
      
      <div class="site-stats">
        <div class="stat-card batiments">
          <div class="stat-value">${uniqueBatiments.size}</div>
          <div class="stat-label">Bâtiment${uniqueBatiments.size > 1 ? 's' : ''}</div>
        </div>
        <div class="stat-card lots">
          <div class="stat-value">${uniqueLots.size}</div>
          <div class="stat-label">Lot${uniqueLots.size > 1 ? 's' : ''}</div>
        </div>
        <div class="stat-card parcelles">
          <div class="stat-value">${uniqueParcelles.size}</div>
          <div class="stat-label">Parcelle${uniqueParcelles.size > 1 ? 's' : ''}</div>
        </div>
        <div class="stat-card gestionnaires">
          <div class="stat-value">${uniqueGestionnaires.size}</div>
          <div class="stat-label">Gestionnaire${uniqueGestionnaires.size > 1 ? 's' : ''}</div>
        </div>
      </div>
      
      <div class="buildings-section">
        <h3 class="section-title">🏗️ Bâtiments et lots</h3>
  `;
  
  batimentsMap.forEach((batiment, key) => {
    html += `
      <div class="building-card">
        <div class="building-header">
          <div class="building-info">
            ${batiment.numero ? `<div class="building-number">Bâtiment ${escapeHtml(batiment.numero)}</div>` : ''}
            <div class="building-name">${escapeHtml(batiment.libelle)}</div>
            ${batiment.type ? `<div class="building-type">Type: ${escapeHtml(batiment.type)}</div>` : ''}
          </div>
          <div class="building-count">
            <strong>${batiment.lots.length}</strong> lot${batiment.lots.length > 1 ? 's' : ''}
          </div>
        </div>
    `;
    
    if (batiment.lots.length > 0) {
      html += '<div class="lots-grid">';
      
      batiment.lots.forEach(lot => {
        const showParcelle = lot.parcelle && lot.parcelle !== lot.numero;
        
        html += `
          <div class="lot-card">
            <div class="lot-header">
              <div class="lot-number">Lot ${escapeHtml(lot.numero)}</div>
            </div>
            <div class="lot-title">${escapeHtml(lot.libelle || 'Lot sans nom')}</div>
            <div class="lot-details">
              ${lot.type ? `
                <div class="lot-detail-row">
                  <span class="lot-detail-label">Type</span>
                  <span class="lot-detail-value"><span class="lot-badge badge-type">${escapeHtml(lot.type)}</span></span>
                </div>
              ` : ''}
              ${lot.statut ? `
                <div class="lot-detail-row">
                  <span class="lot-detail-label">Statut</span>
                  <span class="lot-detail-value"><span class="lot-badge badge-statut">${escapeHtml(lot.statut)}</span></span>
                </div>
              ` : ''}
              ${lot.bail ? `
                <div class="lot-detail-row">
                  <span class="lot-detail-label">Bail</span>
                  <span class="lot-detail-value"><span class="lot-badge badge-bail">${escapeHtml(lot.bail)}</span></span>
                </div>
              ` : ''}
              ${showParcelle ? `
                <div class="lot-detail-row">
                  <span class="lot-detail-label">Parcelle</span>
                  <span class="lot-detail-value"><span class="lot-badge badge-parcelle">${escapeHtml(lot.parcelle)}</span></span>
                </div>
              ` : ''}
              ${lot.gestionnaire ? `
                <div class="lot-detail-row">
                  <span class="lot-detail-label">Gestionnaire</span>
                  <span class="lot-detail-value">${escapeHtml(lot.gestionnaire)}</span>
                </div>
              ` : ''}
              ${lot.perimetre ? `
                <div class="lot-detail-row">
                  <span class="lot-detail-label">Périmètre</span>
                  <span class="lot-detail-value">${escapeHtml(lot.perimetre)}</span>
                </div>
              ` : ''}
              ${lot.zone ? `
                <div class="lot-detail-row">
                  <span class="lot-detail-label">Zone</span>
                  <span class="lot-detail-value">${escapeHtml(lot.zone)}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    } else {
      html += '<div class="no-lots">Aucun lot enregistré pour ce bâtiment</div>';
    }
    
    html += '</div>';
  });
  
  html += `
      </div>
    </div>
  `;
  
  siteMainContent.innerHTML = html;
  suggestionsContainer.style.display = 'none';
}

// Effacer la recherche
function clearSearch() {
  siteSearch.value = '';
  suggestionsContainer.style.display = 'none';
  siteMainContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">🏢</div>
      <div class="empty-state-title">Recherchez un site</div>
      <div class="empty-state-text">Saisissez un numéro de site dans la barre de recherche ci-dessus</div>
    </div>
  `;
  siteSearch.focus();
}

// Exporter la fiche en Excel
function exportSiteFiche() {
  const searchValue = siteSearch.value.trim();
  
  if (!searchValue) {
    alert('Veuillez d\'abord rechercher un site');
    return;
  }
  
  const siteData = allData.filter(row => 
    String(row.Site).toLowerCase() === searchValue.toLowerCase()
  );
  
  if (siteData.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }
  
  const exportData = siteData.map(row => ({
    'N° Site': row.Site || '',
    'Libellé site': row.Libelle_site || '',
    'Commune': row.Commune_site || '',
    'Adresse site': row.Adresse_site || '',
    'N° Bâtiment': row.Bat || '',
    'Libellé bâtiment': row.Libelle_batiment || '',
    'Type bâtiment': row.Type_batiment || '',
    'N° Lot': row.N_Lot || '',
    'Libellé lot': row.Libelle_lot || '',
    'Type lot': row.Type_lot || '',
    'Statut locatif': row.Statut_locatif || '',
    'Type bail': row.NOM_TYPE_BAIL || '',
    'Gestionnaire': row.Gestionnaire || '',
    'Périmètre': row.Perimetre || '',
    'Zone opérationnelle': row.Zone_operationnelle || '',
    'N° Parcelle': row.N_parcelle || ''
  }));
  
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Site ${searchValue}`);
  
  const colWidths = [
    { wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 40 },
    { wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 12 },
    { wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 18 },
    { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 15 }
  ];
  ws['!cols'] = colWidths;
  
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Fiche_Site_${searchValue}_${date}.xlsx`);
}

// =============================================================================
// EVENT LISTENERS POUR LES ONGLETS
// =============================================================================

function setupTabListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });
}

// =============================================================================
// EVENT LISTENERS POUR LA RECHERCHE PAR SITE
// =============================================================================

function setupSearchListeners() {
  btnSearch.addEventListener('click', displaySiteFiche);
  btnClear.addEventListener('click', clearSearch);

  siteSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      displaySiteFiche();
    }
  });

  siteSearch.addEventListener('input', function() {
    showSuggestions(this.value);
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-bar')) {
      suggestionsContainer.style.display = 'none';
    }
  });
}
