// for easy pre-loading
export const routeTable = {
  '/about': () => import(/* webpackChunkName: "AboutPage" */ './pages/AboutPage'),
  '/beta': () => import(/* webpackChunkName: "BetaPage" */ './pages/BetaPage'),
  '/privacy': () => import(/* webpackChunkName: "PrivacyPage" */ './pages/PrivacyPage'),
  '/terms': () => import(/* webpackChunkName: "TermsPage" */ './pages/TermsPage'),
  '/faq': () => import(/* webpackChunkName: "FAQPage" */ './pages/FAQPage'),
}
