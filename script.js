const menuButton = document.querySelector('.mobile-menu');
const navigation = document.querySelector('.main-nav');
const subscribeForm = document.querySelector('.subscribe');
const courseMenuToggle = document.querySelector('.nav-dropdown__toggle');
const courseMenu = document.querySelector('.nav-dropdown__menu');
const courseDropdown = document.querySelector('.nav-dropdown');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

function closeCourseMenu() {
  if (!courseMenu || !courseMenuToggle) return;
  courseMenu.hidden = true;
  courseMenuToggle.setAttribute('aria-expanded', 'false');
}

function openCourseMenu() {
  if (!courseMenu || !courseMenuToggle) return;
  courseMenu.hidden = false;
  courseMenuToggle.setAttribute('aria-expanded', 'true');
}

courseMenuToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  if (courseMenu.hidden) openCourseMenu();
  else closeCourseMenu();
});

document.addEventListener('click', (event) => {
  if (!courseDropdown?.contains(event.target)) closeCourseMenu();
});

subscribeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.querySelector('button').textContent = 'Бүртгэгдлээ';
});

const catalogTitle = document.querySelector('#catalog-title');
const catalogBreadcrumb = document.querySelector('#catalog-breadcrumb-current');
const catalogBreadcrumbSeparator = document.querySelector('#catalog-breadcrumb-separator');
const catalogCategoryNav = document.querySelector('.catalog-category-nav');
const defaultCatalogTitle = catalogTitle?.innerHTML;

function showCatalogCategory(category, count) {
  if (!catalogTitle || !catalogBreadcrumb || !category || !count) return;

  catalogTitle.innerHTML = `${category} <span>${count}</span>`;
  catalogBreadcrumb.textContent = category;
  catalogBreadcrumb.hidden = false;
  catalogBreadcrumbSeparator.hidden = false;
  catalogCategoryNav?.setAttribute('hidden', '');
  document.querySelector('.breadcrumb-parent')?.removeAttribute('aria-current');
  document.querySelectorAll('.catalog-category-nav a').forEach((link) => {
    link.toggleAttribute('aria-current', link.dataset.category === category);
  });
  refreshCatalogList(category, Number(count));
  resetFilterWizard();
}

function showCatalogOverview() {
  if (!catalogTitle || !defaultCatalogTitle) return;

  catalogTitle.innerHTML = defaultCatalogTitle;
  catalogBreadcrumb.hidden = true;
  catalogBreadcrumbSeparator.hidden = true;
  catalogCategoryNav?.removeAttribute('hidden');
  document.querySelector('.breadcrumb-parent')?.setAttribute('aria-current', 'page');
  document.querySelectorAll('.catalog-category-nav a').forEach((link) => link.removeAttribute('aria-current'));
  refreshCatalogList('Англи хэл', 24);
  resetFilterWizard();
}

document.querySelectorAll('.catalog-category-nav a[data-category]').forEach((categoryLink) => {
  categoryLink.addEventListener('click', (event) => {
    event.preventDefault();
    const { category, count } = categoryLink.dataset;
    if (!category || !count) return;

    const categoryUrl = new URL(window.location.href);
    categoryUrl.searchParams.set('category', category);
    window.history.pushState({ catalogView: 'category', category, count: Number(count) }, '', categoryUrl);
    showCatalogCategory(category, Number(count));
  });
});

const catalogResults = document.querySelector('.catalog-results');
const additionalEnglishCourses = [
  ['SpeakUp Academy', 'Англи хэлний анхан шат', '4.6', 'СБД', '8 долоо хоног · Өглөөний анги', '380,000₮', 'photo-1544717305-2782549b5136'],
  ['Global English', 'IELTS Academic бэлтгэл', '4.8', 'БЗД', '12 долоо хоног · Mock test', '620,000₮', 'photo-1434030216411-0b793f4b4173'],
  ['Language Hub', 'Ярианы англи хэлний клуб', '4.5', 'ХУД', '6 долоо хоног · Оройн анги', '290,000₮', 'photo-1517048676732-d65bc937f952'],
  ['Oxford Centre', 'Business Writing in English', '4.7', 'СБД', '10 долоо хоног · Танхим', '520,000₮', 'photo-1551836022-d5d88e9218df'],
  ['Bridge School', 'TOEFL iBT эрчимжүүлсэн', '4.6', 'БГД', '10 долоо хоног · 24 суудал', '560,000₮', 'photo-1523050854058-8df90110c9f1'],
  ['Lingua Centre', 'Англи хэлний ахисан шат', '4.7', 'СБД', '8 долоо хоног · Өдрийн анги', '450,000₮', 'photo-1509062522246-3755977927d7'],
  ['Future Academy', 'SAT English & Vocabulary', '4.8', 'БЗД', '12 долоо хоног · Бага бүлэг', '680,000₮', 'photo-1523240795612-9a054b0db644'],
  ['EFL School', 'IELTS Speaking & Writing', '4.5', 'БГД', '6 долоо хоног · Онлайн', '360,000₮', 'photo-1457369804613-52c61a468e7d'],
  ['ProTalk Academy', 'Ажлын байрны англи хэл', '4.6', 'ХУД', '8 долоо хоног · Оройн анги', '420,000₮', 'photo-1556761175-b413da4baf72'],
  ['English Plus', 'Хүүхдийн англи хэл · 7–10 нас', '4.9', 'СБД', '3 сар · Амралтын өдөр', '350,000₮', 'photo-1503676260728-1c00da094a0b'],
  ['Cambridge Study', 'Cambridge B2 First бэлтгэл', '4.7', 'БЗД', '12 долоо хоног · Танхим', '590,000₮', 'photo-1503676260728-1c00da094a0b'],
  ['Talk Time', 'Аяллын англи хэл', '4.4', 'СБД', '4 долоо хоног · Оройн анги', '220,000₮', 'photo-1529156069898-49953e39b3ac'],
  ['Lingua Centre', 'Англи хэлний дунд шат', '4.6', 'БГД', '10 долоо хоног · Танхим', '430,000₮', 'photo-1524178232363-1fb2b075b655'],
  ['Global English', 'IELTS Foundation', '4.5', 'ХУД', '8 долоо хоног · Онлайн', '410,000₮', 'photo-1516321318423-f06f85e504b3'],
  ['Bridge School', 'Академик уншлага ба бичих', '4.8', 'СБД', '6 долоо хоног · Бага бүлэг', '460,000₮', 'photo-1456324504439-367cee3b3c32'],
  ['SpeakUp Academy', 'Англи хэлний дүрэм · A2–B1', '4.4', 'БЗД', '6 долоо хоног · Өглөөний анги', '310,000₮', 'photo-1522202176988-66273c2fd55f'],
  ['Future Academy', 'IELTS 7.0+ Masterclass', '4.9', 'СБД', '10 долоо хоног · Mock test', '750,000₮', 'photo-1513258496099-48168024aec0'],
  ['Oxford Centre', 'Англи хэлний сонсголын курс', '4.5', 'ХУД', '5 долоо хоног · Онлайн', '260,000₮', 'photo-1497633762265-9d179a990aa6'],
  ['English Plus', 'Өсвөр насныхны ярианы англи хэл', '4.7', 'БГД', '2 сар · Амралтын өдөр', '390,000₮', 'photo-1516321318423-f06f85e504b3'],
  ['ProTalk Academy', 'Presentation Skills in English', '4.6', 'СБД', '6 долоо хоног · Оройн анги', '470,000₮', 'photo-1556761175-b413da4baf72'],
  ['EFL School', 'TOEFL Speaking Workshop', '4.5', 'БЗД', '4 долоо хоног · Онлайн', '280,000₮', 'photo-1434030216411-0b793f4b4173'],
];

if (catalogResults) {
  additionalEnglishCourses.forEach(([provider, title, rating, district, meta, price, image]) => {
    const card = document.createElement('article');
    card.className = 'catalog-course-card';
    card.innerHTML = `<img src="https://images.unsplash.com/${image}?auto=format&fit=crop&w=500&q=80" alt="${title}" /><div class="catalog-card__body"><p class="provider">${provider}</p><h3>${title}</h3><p class="rating">★★★★★ <span>${rating}</span> · ${district}</p><p class="course-meta">▣ ${meta}</p><div class="course-action"><a href="course-detail.html">Дэлгэрэнгүй</a><strong>${price}</strong></div></div>`;
    catalogResults.insertBefore(card, catalogResults.querySelector('.pagination'));
  });
}

catalogResults?.addEventListener('click', (event) => {
  const card = event.target.closest('.catalog-course-card');
  if (!card) return;
  event.preventDefault();
  const title = card.querySelector('h3')?.textContent.trim() ?? 'Сургалтын дэлгэрэнгүй';
  const provider = card.querySelector('.provider')?.textContent.trim() ?? 'Horizon Academy';
  const price = card.querySelector('.course-action strong')?.textContent.trim() ?? 'Үнэ тохиролцоно';
  const image = card.querySelector('img')?.currentSrc ?? '';
  const category = catalogTitle?.childNodes[0]?.textContent.trim() || 'Англи хэл';
  const params = new URLSearchParams({ title, provider, price, image, category });
  window.location.href = `course-detail.html?${params.toString()}`;
});

const catalogPagination = document.querySelector('.pagination');
let catalogCards = catalogResults ? [...catalogResults.querySelectorAll('.catalog-course-card')] : [];
const catalogFilterOptions = {
  location: ['Сүхбаатар', 'Баянзүрх', 'Хан-Уул', 'Сонгинохайрхан'],
  format: ['Танхим', 'Онлайн', 'Хосолсон'],
  level: ['Анхан шат', 'Дунд шат', 'Ахисан шат', 'IELTS/TOEFL'],
};

function setCatalogCardMetadata(cards) {
  cards.forEach((card, index) => {
    card.dataset.location = catalogFilterOptions.location[index % catalogFilterOptions.location.length];
    card.dataset.format = catalogFilterOptions.format[index % catalogFilterOptions.format.length];
    card.dataset.level = catalogFilterOptions.level[index % catalogFilterOptions.level.length];
  });
}

setCatalogCardMetadata(catalogCards);
const englishCatalogMarkup = catalogCards.map((card) => card.outerHTML);
let filteredCatalogCards = [...catalogCards];
let activeCatalogPage = 1;

const categoryCourseInfo = {
  'Солонгос хэл': ['Korea Bridge', ['Солонгос хэлний анхан шат', 'TOPIK I бэлтгэл', 'Солонгос хэлний яриа', 'TOPIK II эрчимжүүлсэн'], 'photo-1491627415492-5d19b6cce531'],
  'Хятад хэл': ['Mandarin House', ['Хятад хэлний анхан шат', 'HSK 1–3 бэлтгэл', 'Бизнес хятад хэл'], 'photo-1522202222208-25c04f17e9b8'],
  'Япон хэл': ['Sakura Academy', ['Япон хэлний анхан шат', 'JLPT N5–N3 бэлтгэл', 'Ярианы япон хэл'], 'photo-1528164344705-47542687000d'],
  'Европ хэлнүүд': ['Euro Language Centre', ['Герман хэл A1–A2', 'Франц хэлний анхан шат', 'Орос хэлний ярианы курс'], 'photo-1516383607781-913a19294fd1'],
  'IELTS/TOPIK бэлтгэл': ['Exam Prep Centre', ['IELTS Academic 6.5+', 'TOPIK I бэлтгэл', 'IELTS Speaking workshop'], 'photo-1434030216411-0b793f4b4173'],
  'Хүүхдийн боловсрол': ['Kids Language Lab', ['Хүүхдийн англи хэл · 7–10 нас', 'Өсвөр насныхны англи хэл', 'Хүүхдийн ярианы клуб'], 'photo-1503676260728-1c00da094a0b'],
  'Гадаадад суралцах тэтгэлэгт хөтөлбөрүүд': ['Global Pathway', ['Тэтгэлэгт хөтөлбөрийн зөвлөгөө', 'Гадаадад суралцах эссэ', 'Визний ярилцлагын бэлтгэл'], 'photo-1523240795612-9a054b0db644'],
};

function createCatalogCardMarkup(provider, title, index, image) {
  const rating = (4.4 + (index % 6) / 10).toFixed(1);
  const districts = ['СБД', 'БЗД', 'БГД', 'ХУД'];
  const prices = ['320,000₮', '380,000₮', '450,000₮', '520,000₮', '590,000₮'];
  return `<article class="catalog-course-card"><img src="https://images.unsplash.com/${image}?auto=format&fit=crop&w=500&q=80" alt="${title}" /><div class="catalog-card__body"><p class="provider">${provider}</p><h3>${title}</h3><p class="rating">★★★★★ <span>${rating}</span> · ${districts[index % districts.length]}</p><p class="course-meta">▣ ${6 + (index % 7)} долоо хоног · Танхим болон онлайн</p><div class="course-action"><a href="course-detail.html">Дэлгэрэнгүй</a><strong>${prices[index % prices.length]}</strong></div></div></article>`;
}

function refreshCatalogList(category, count) {
  if (!catalogResults || !catalogPagination || !count) return;
  catalogResults.querySelectorAll('.catalog-course-card').forEach((card) => card.remove());

  const markup = category === 'Англи хэл'
    ? englishCatalogMarkup.join('')
    : Array.from({ length: count }, (_, index) => {
      const [provider, titles, image] = categoryCourseInfo[category] ?? ['Horizon Academy', [category], 'photo-1524178232363-1fb2b075b655'];
      return createCatalogCardMarkup(provider, titles[index % titles.length], index, image);
    }).join('');

  catalogPagination.insertAdjacentHTML('beforebegin', markup);
  catalogCards = [...catalogResults.querySelectorAll('.catalog-course-card')];
  catalogCards[0]?.classList.add('is-featured');
  setCatalogCardMetadata(catalogCards);
  filteredCatalogCards = [...catalogCards];
  activeCatalogPage = 1;
  renderCatalogPagination();
  showCatalogPage(1);
}

function renderCatalogPagination() {
  if (!catalogPagination) return;
  const pageCount = Math.ceil(filteredCatalogCards.length / 10);
  if (!pageCount) {
    catalogPagination.hidden = false;
    catalogPagination.innerHTML = '<span class="no-filter-results">Таарах сургалт олдсонгүй.</span>';
    return;
  }
  if (pageCount === 1) {
    catalogPagination.hidden = true;
    catalogPagination.innerHTML = '';
    return;
  }
  catalogPagination.hidden = false;
  const buttons = [
    `<button type="button" data-direction="previous" aria-label="Өмнөх хуудас">‹ Prev</button>`,
    ...Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}">${index + 1}</button>`),
    `<button type="button" data-direction="next" aria-label="Дараагийн хуудас">Next ›</button>`,
  ];
  catalogPagination.innerHTML = buttons.join('');
}

function showCatalogPage(page) {
  if (!catalogPagination) return;
  const pageSize = 10;
  const pageCount = Math.ceil(filteredCatalogCards.length / pageSize);
  if (!pageCount) {
    catalogCards.forEach((card) => { card.hidden = true; });
    return;
  }
  activeCatalogPage = Math.min(Math.max(page, 1), pageCount);

  catalogCards.forEach((card) => {
    const filteredIndex = filteredCatalogCards.indexOf(card);
    card.hidden = filteredIndex < 0 || Math.floor(filteredIndex / pageSize) + 1 !== activeCatalogPage;
  });

  catalogPagination.querySelectorAll('button').forEach((button) => {
    const buttonPage = Number(button.dataset.page);
    button.classList.toggle('is-current', buttonPage === activeCatalogPage);
    if (button.dataset.direction === 'previous') button.disabled = activeCatalogPage === 1;
    if (button.dataset.direction === 'next') button.disabled = activeCatalogPage === pageCount;
  });
}

catalogPagination?.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.direction === 'previous') showCatalogPage(activeCatalogPage - 1);
  else if (button.dataset.direction === 'next') showCatalogPage(activeCatalogPage + 1);
  else showCatalogPage(Number(button.dataset.page));
  document.querySelector('.site-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function applyCatalogFilters() {
  const selected = Object.fromEntries(Object.keys(catalogFilterOptions).map((group) => [
    group,
    [...document.querySelectorAll(`[data-filter-group="${group}"] input:checked`)].map((input) => input.value),
  ]));
  const searchTerm = document.querySelector('#catalog-search')?.value.trim().toLocaleLowerCase() ?? '';
  const maximumPrice = Number(priceSlider?.value ?? Number.POSITIVE_INFINITY);

  filteredCatalogCards = catalogCards.filter((card) => Object.entries(selected).every(([group, values]) => (
    !values.length || values.includes(card.dataset[group])
  )) && (!searchTerm || card.textContent.toLocaleLowerCase().includes(searchTerm)) && (
    Number((card.querySelector('.course-action strong')?.textContent ?? '').replace(/[^0-9]/g, '')) <= maximumPrice
  ));
  filteredCatalogCards.sort((first, second) => Number(second.classList.contains('is-featured')) - Number(first.classList.contains('is-featured')));
  const titleCount = catalogTitle?.querySelector('span');
  if (titleCount) titleCount.textContent = String(filteredCatalogCards.length);
  activeCatalogPage = 1;
  renderCatalogPagination();
  showCatalogPage(1);
}

document.querySelector('.filter-button')?.addEventListener('click', applyCatalogFilters);
document.querySelector('.filter-reset')?.addEventListener('click', () => {
  const searchInput = document.querySelector('#catalog-search');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.course-filters input[type="checkbox"]').forEach((input) => { input.checked = false; });
  document.querySelectorAll('.course-filters input[type="radio"]').forEach((input) => { input.checked = false; });
  if (priceSlider) priceSlider.value = priceSlider.max;
  updatePriceValue();
  applyCatalogFilters();
});

const priceSlider = document.querySelector('#price-slider');
const priceValue = document.querySelector('#price-value');

function updatePriceValue() {
  if (!priceSlider || !priceValue) return;
  priceValue.textContent = `₮${Number(priceSlider.value).toLocaleString('en-US')}`;
}

priceSlider?.addEventListener('input', () => {
  updatePriceValue();
});
updatePriceValue();

const filterWizard = document.querySelector('.course-filters');
const filterWizardSteps = [
  { label: 'Сургалтын төрөл', group: 'category' },
  { label: 'Байршил', group: 'location' },
  { label: 'Хэлбэр', group: 'format' },
  { label: 'Түвшин', group: 'level' },
  { label: 'Төлбөр', input: '#price-slider' },
];
let activeFilterWizardStep = 0;
const filterWizardHistory = [];

function captureFilterWizardState() {
  const wizardGroups = ['category', ...Object.keys(catalogFilterOptions)];
  return {
    search: document.querySelector('#catalog-search')?.value ?? '',
    price: priceSlider?.value ?? '',
    selections: Object.fromEntries(wizardGroups.map((group) => [
      group,
      [...document.querySelectorAll(`[data-filter-group="${group}"] input:checked`)].map((input) => input.value),
    ])),
  };
}

function restoreFilterWizardState(state) {
  if (!state) return;
  const searchInput = document.querySelector('#catalog-search');
  if (searchInput) searchInput.value = state.search;
  if (priceSlider && state.price) priceSlider.value = state.price;
  Object.entries(state.selections).forEach(([group, values]) => {
    document.querySelectorAll(`[data-filter-group="${group}"] input`).forEach((input) => {
      input.checked = values.includes(input.value);
    });
  });
  updatePriceValue();
  applyCatalogFilters();
}

function saveFilterWizardState(step) {
  filterWizardHistory.splice(step);
  filterWizardHistory[step] = captureFilterWizardState();
}

function getFilterWizardSteps() {
  return catalogCategoryNav?.hidden ? filterWizardSteps.slice(1) : filterWizardSteps;
}

function updateFilterWizard() {
  if (!filterWizard) return;
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  filterWizard.classList.toggle('is-wizard-active', isMobile);
  if (!isMobile) return;

  const steps = getFilterWizardSteps();
  activeFilterWizardStep = Math.min(activeFilterWizardStep, steps.length - 1);
  filterWizard.dataset.wizardStep = String(activeFilterWizardStep);
  filterWizard.dataset.wizardFilter = steps[activeFilterWizardStep].group ?? (steps[activeFilterWizardStep].input === '#price-slider' ? 'price' : 'search');
  const progress = filterWizard.querySelector('[data-filter-wizard-progress]');
  const nextButton = filterWizard.querySelector('[data-filter-wizard-next]');
  if (progress) progress.textContent = `${activeFilterWizardStep + 1}/${steps.length} · ${steps[activeFilterWizardStep].label}`;
  if (nextButton) nextButton.textContent = activeFilterWizardStep === steps.length - 1 ? 'Үр дүн' : 'Дараах';
}

function skipFilterWizardStep() {
  const step = getFilterWizardSteps()[activeFilterWizardStep];
  if (step.group) {
    document.querySelectorAll(`[data-filter-group="${step.group}"] input`).forEach((input) => { input.checked = false; });
  } else if (step.input === '#price-slider' && priceSlider) {
    priceSlider.value = priceSlider.max;
    updatePriceValue();
  } else {
    const input = document.querySelector(step.input);
    if (input) input.value = '';
  }
}

filterWizard?.querySelector('[data-filter-wizard-next]')?.addEventListener('click', () => {
  const currentStep = getFilterWizardSteps()[activeFilterWizardStep];
  if (currentStep.group === 'category') {
    const selectedCategory = document.querySelector('[data-filter-group="category"] input:checked');
    if (selectedCategory) {
      const { value: category, dataset: { count } } = selectedCategory;
      const categoryUrl = new URL(window.location.href);
      categoryUrl.searchParams.set('category', category);
      window.history.pushState({ catalogView: 'category', category, count: Number(count) }, '', categoryUrl);
      showCatalogCategory(category, Number(count));
      applyCatalogFilters();
      return;
    }
  }
  applyCatalogFilters();
  if (activeFilterWizardStep === getFilterWizardSteps().length - 1) {
    filterWizard?.classList.add('is-wizard-complete');
    document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  activeFilterWizardStep += 1;
  saveFilterWizardState(activeFilterWizardStep);
  updateFilterWizard();
});

filterWizard?.querySelector('[data-filter-wizard-skip]')?.addEventListener('click', () => {
  skipFilterWizardStep();
  applyCatalogFilters();
  if (activeFilterWizardStep === getFilterWizardSteps().length - 1) {
    filterWizard?.classList.add('is-wizard-complete');
    document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  activeFilterWizardStep += 1;
  saveFilterWizardState(activeFilterWizardStep);
  updateFilterWizard();
});

filterWizard?.querySelector('[data-filter-wizard-back]')?.addEventListener('click', () => {
  activeFilterWizardStep = Math.max(0, activeFilterWizardStep - 1);
  restoreFilterWizardState(filterWizardHistory[activeFilterWizardStep]);
  updateFilterWizard();
});

function resetFilterWizard() {
  filterWizard?.classList.remove('is-wizard-complete');
  activeFilterWizardStep = 0;
  saveFilterWizardState(0);
  updateFilterWizard();
}

saveFilterWizardState(0);
window.addEventListener('resize', updateFilterWizard);
updateFilterWizard();

renderCatalogPagination();
showCatalogPage(1);

if (catalogCategoryNav) {
  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  const requestedCategoryLink = [...document.querySelectorAll('.catalog-category-nav a[data-category]')]
    .find((link) => link.dataset.category === requestedCategory);

  if (requestedCategoryLink) {
    const { category, count } = requestedCategoryLink.dataset;
    window.history.replaceState({ catalogView: 'category', category, count: Number(count) }, '');
    showCatalogCategory(category, Number(count));
  } else if (!window.history.state?.catalogView) {
    window.history.replaceState({ catalogView: 'overview' }, '');
  } else if (window.history.state.catalogView === 'category') {
    showCatalogCategory(window.history.state.category, window.history.state.count);
  }

  window.addEventListener('popstate', (event) => {
    if (event.state?.catalogView === 'category') {
      showCatalogCategory(event.state.category, event.state.count);
    } else {
      showCatalogOverview();
    }
  });
}

const detailParameters = new URLSearchParams(window.location.search);
const detailTitle = detailParameters.get('title');
const detailProvider = detailParameters.get('provider');
const detailPrice = detailParameters.get('price');
const detailImage = detailParameters.get('image');
const detailCategory = detailParameters.get('category');

if (detailTitle) {
  document.querySelectorAll('[data-detail-title]').forEach((element) => { element.textContent = detailTitle; });
  document.querySelectorAll('[data-detail-type]').forEach((element) => { element.textContent = detailTitle; });
}
if (detailProvider) document.querySelectorAll('[data-detail-provider]').forEach((element) => { element.textContent = detailProvider; });
if (detailPrice) document.querySelectorAll('[data-detail-price]').forEach((element) => { element.textContent = detailPrice; });
if (detailCategory) {
  document.querySelectorAll('[data-detail-category]').forEach((element) => {
    element.textContent = detailCategory;
    element.href = `foreign-languages.html?category=${encodeURIComponent(detailCategory)}`;
  });
}
if (detailImage) {
  document.querySelectorAll('[data-detail-image]').forEach((element) => {
    element.src = detailImage;
    element.alt = detailTitle || 'Сургалтын зураг';
  });
}

const galleryMainImage = document.querySelector('.course-gallery__main');
const galleryThumbnails = [...document.querySelectorAll('.gallery-thumb')];
let activeGalleryImage = Math.max(0, galleryThumbnails.findIndex((thumbnail) => thumbnail.classList.contains('is-active')));

function showGalleryImage(index) {
  if (!galleryMainImage || !galleryThumbnails.length) return;
  activeGalleryImage = (index + galleryThumbnails.length) % galleryThumbnails.length;
  const thumbnail = galleryThumbnails[activeGalleryImage];
  galleryMainImage.src = thumbnail.dataset.galleryImage;
  galleryMainImage.alt = thumbnail.dataset.galleryAlt;
  galleryThumbnails.forEach((item, itemIndex) => {
    const isActive = itemIndex === activeGalleryImage;
    item.classList.toggle('is-active', isActive);
    item.toggleAttribute('aria-current', isActive);
  });
}

galleryThumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', () => showGalleryImage(index));
});

document.querySelectorAll('[data-gallery-direction]').forEach((button) => {
  button.addEventListener('click', () => {
    showGalleryImage(activeGalleryImage + (button.dataset.galleryDirection === 'next' ? 1 : -1));
  });
});

document.addEventListener('keydown', (event) => {
  if (!galleryMainImage || event.target.matches('input, textarea') || registrationDialog?.open) return;
  if (event.key === 'ArrowLeft') showGalleryImage(activeGalleryImage - 1);
  if (event.key === 'ArrowRight') showGalleryImage(activeGalleryImage + 1);
});

const registrationDialog = document.querySelector('.registration-dialog');
const registrationForm = document.querySelector('[data-registration-form]');

document.querySelector('[data-register-open]')?.addEventListener('click', () => {
  registrationDialog?.showModal();
});

document.querySelector('[data-register-close]')?.addEventListener('click', () => {
  registrationDialog?.close();
});

registrationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(registrationForm);
  const courseName = document.querySelector('[data-detail-title]')?.textContent.trim() ?? 'Сургалт';
  const message = [
    `Сургалт: ${courseName}`,
    `Нэр: ${formData.get('name')}`,
    `Утас: ${formData.get('phone')}`,
    `Имэйл: ${formData.get('email')}`,
    `Тайлбар: ${formData.get('note') || '-'}`,
  ].join('\n');
  const subject = `${courseName} — бүртгэлийн хүсэлт`;
  const recipient = document.querySelector('[data-provider-email]')?.dataset.providerEmail;
  if (!recipient) return;
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  registrationDialog?.close();
});

document.querySelector('.detail-call')?.addEventListener('click', (event) => {
  const callLink = event.currentTarget;
  if (callLink.dataset.revealed) return;

  event.preventDefault();
  callLink.textContent = callLink.dataset.phone;
  callLink.dataset.revealed = 'true';
  callLink.setAttribute('aria-label', `${callLink.dataset.phone} руу залгах`);
});

const courseTrack = document.querySelector('.course-grid');
const courseCards = [...document.querySelectorAll('.course-card')];
const courseDots = [...document.querySelectorAll('.course-dots button')];
let activeCoursePage = 0;
let courseResetTimer;

if (courseTrack) {
  courseCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    courseTrack.append(clone);
  });
}

function showCoursePage(page) {
  const cardWidth = courseCards[0]?.getBoundingClientRect().width ?? 0;
  const gap = 20;
  const totalPages = courseCards.length;
  const distance = cardWidth + gap;

  window.clearTimeout(courseResetTimer);

  if (page < 0) {
    courseTrack.style.transition = 'none';
    courseTrack.style.transform = `translateX(-${totalPages * distance}px)`;
    activeCoursePage = totalPages;
    window.requestAnimationFrame(() => {
      courseTrack.style.transition = '';
      activeCoursePage = totalPages - 1;
      courseTrack.style.transform = `translateX(-${activeCoursePage * distance}px)`;
    });
  } else {
    activeCoursePage = page;
    courseTrack.style.transform = `translateX(-${activeCoursePage * distance}px)`;

    if (activeCoursePage === totalPages) {
      courseResetTimer = window.setTimeout(() => {
        courseTrack.style.transition = 'none';
        activeCoursePage = 0;
        courseTrack.style.transform = 'translateX(0)';
        window.requestAnimationFrame(() => { courseTrack.style.transition = ''; });
      }, 450);
    }
  }

  const activeDot = activeCoursePage % courseDots.length;
  courseDots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeDot));
}

document.querySelectorAll('.course-arrow').forEach((button) => {
  button.addEventListener('click', () => showCoursePage(activeCoursePage + (button.dataset.direction === 'next' ? 1 : -1)));
});

courseDots.forEach((dot, index) => dot.addEventListener('click', () => showCoursePage(index)));

const partnerTrack = document.querySelector('.partner-track');
const partnerCards = [...document.querySelectorAll('.partner-card')];
let activePartnerPage = 0;
let partnerResetTimer;

if (partnerTrack) {
  partnerCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    partnerTrack.append(clone);
  });
}

function showPartnerPage(page) {
  const cardWidth = partnerCards[0]?.getBoundingClientRect().width ?? 0;
  const gap = 30;
  const totalPages = partnerCards.length;
  const distance = cardWidth + gap;

  window.clearTimeout(partnerResetTimer);

  if (page < 0) {
    partnerTrack.style.transition = 'none';
    partnerTrack.style.transform = `translateX(-${totalPages * distance}px)`;
    activePartnerPage = totalPages;
    window.requestAnimationFrame(() => {
      partnerTrack.style.transition = '';
      activePartnerPage = totalPages - 1;
      partnerTrack.style.transform = `translateX(-${activePartnerPage * distance}px)`;
    });
  } else {
    activePartnerPage = page;
    partnerTrack.style.transform = `translateX(-${activePartnerPage * distance}px)`;

    if (activePartnerPage === totalPages) {
      partnerResetTimer = window.setTimeout(() => {
        partnerTrack.style.transition = 'none';
        activePartnerPage = 0;
        partnerTrack.style.transform = 'translateX(0)';
        window.requestAnimationFrame(() => { partnerTrack.style.transition = ''; });
      }, 400);
    }
  }
}

document.querySelectorAll('.partner-arrow').forEach((button) => {
  button.addEventListener('click', () => showPartnerPage(activePartnerPage + (button.dataset.direction === 'next' ? 1 : -1)));
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  if (courseTrack && courseCards.length) window.setInterval(() => showCoursePage(activeCoursePage + 1), 3500);
  if (partnerTrack && partnerCards.length) window.setInterval(() => showPartnerPage(activePartnerPage + 1), 4200);
}
