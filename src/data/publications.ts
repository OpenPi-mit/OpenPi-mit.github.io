export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  link?: string;
  pdfLink?: string;
};

export const publications: Publication[] = [
  {
    title: "Agent Systems for Academic Research Automation: An Evolving Survey",
    authors:
      "Beneventano, P.*, Neumarker, R.*, Abdelmoneum, M., Bacvanski, M., Gan, Y., Hajoub, M., Liao, Q., Rimoldi, E., Tiwary, K., Ziyin, L., Galanti, T., Evgeniou, T., Poggio, T.",
    venue: "Living Survey, Massachusetts Institute of Technology, April 2026",
    year: "2026",
    link: "/papers/survey-of-ai-for-research-v0/",
    pdfLink: "/papers/Survey_of_AI_for_Research__TRUE_VERSION_-2.pdf",
  },
  {
    title: "pAI/MSc: ML Theory Research with Humans on the Loop",
    authors: "Abdelmoneum, M.*, Beneventano, P.*, Poggio, T.",
    venue: "Technical Report, Massachusetts Institute of Technology, March 2026",
    year: "2026",
    link: "/papers/poggioai-msc-v0/",
    pdfLink: "/papers/pAI_technical_report.pdf",
  },
];
