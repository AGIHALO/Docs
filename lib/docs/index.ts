import { authenticationPages } from "./authentication";
import { billingSdkReferencePages } from "./billing-sdk-reference";
import { memoryPages } from "./memory";
import { modelGatewayPages } from "./model-gateway";
import { overviewPages } from "./overview";
import { servicePages } from "./services";
import type { DocPageMap } from "./types";

export type { DocPage, TocItem } from "./types";

export const DOC_PAGES: DocPageMap = {
  ...overviewPages,
  ...modelGatewayPages,
  ...memoryPages,
  ...authenticationPages,
  ...servicePages,
  ...billingSdkReferencePages,
};

export const findDocPage = (slug: string) => DOC_PAGES[slug];
