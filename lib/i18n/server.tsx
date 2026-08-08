import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { DocPage } from "@/lib/docs/types";
import type { DocEntry, NavGroup } from "@/lib/navigation";
import { GENERATED_CONTEXTUAL_TRANSLATIONS } from "./generated-contextual-translations";
import { GENERATED_TRANSLATIONS } from "./generated-translations";
import { getLocalizedDocHref, type DocsLocale } from "./locales";

const NON_TRANSLATABLE_ELEMENTS = new Set([
  "code",
  "pre",
  "kbd",
  "samp",
  "script",
  "style",
]);

const NON_TRANSLATABLE_PROPS = new Set([
  "className",
  "code",
  "data-kind",
  "data-method",
  "href",
  "id",
  "kind",
  "language",
  "method",
  "path",
  "rel",
  "slug",
  "status",
  "style",
  "target",
  "type",
  "value",
]);

const REVIEWED_OVERRIDES: Record<
  Exclude<DocsLocale, "en">,
  Record<string, string>
> = {
  ko: {
    ". Keep the required": " 헤더로 전송하고, 필수 ",
    "A 402 is actionable": "402 응답은 해결할 수 있습니다",
    "Anthropic": "Anthropic",
    "Base pricing": "기본 가격",
    "Billing notes": "과금 참고사항",
    "Cache write": "캐시 쓰기",
    "Cached input": "캐시 입력",
    "Cached image input": "캐시 이미지 입력",
    "Cached text input": "캐시 텍스트 입력",
    "Current base rates for supported model families.":
      "지원되는 모델 계열의 현재 기본 가격입니다.",
    "Google Gemini": "Google Gemini",
    "How to read prices": "가격표 읽는 법",
    "Input": "입력",
    "Image input": "이미지 입력",
    "Image output": "이미지 출력",
    "Imagen · per generated image": "Imagen · 생성 이미지당",
    "Media generation": "미디어 생성",
    "OpenAI GPT Image": "OpenAI GPT Image",
    "Output": "출력",
    "Price": "가격",
    "Text input": "텍스트 입력",
    "Text output": "텍스트 출력",
    "Uncached input": "비캐시 입력",
    "USD per 1M tokens": "100만 토큰당 USD",
    "Veo · USD per generated second": "Veo · 생성 초당 USD",
    "These base rates mirror the HALO production pricing catalog checked on August 1, 2026. Text prices are in USD per 1 million tokens.":
      "이 기본 가격은 2026년 8월 1일에 확인한 HALO 프로덕션 가격 카탈로그와 동일합니다. 텍스트 가격 단위는 100만 토큰당 USD입니다.",
    "Token rates are metered separately by the usage categories shown in each table. Paired values show standard and long-context rates in that order.":
      "토큰 가격은 각 표에 표시된 사용량 항목별로 별도 측정됩니다. 두 가격이 표시된 경우 표준 컨텍스트와 장문 컨텍스트 가격 순서입니다.",
    "Paired Gemini rates apply at up to 200,000 input tokens and above 200,000 input tokens.":
      "Gemini의 두 가격은 입력 토큰 20만 이하와 20만 초과 구간에 각각 적용됩니다.",
    "OpenAI Chat Completions reports cached input separately. All remaining prompt input is billed at the uncached-input rate. Paired rates apply at up to 272,000 input tokens and above 272,000 input tokens.":
      "OpenAI Chat Completions는 캐시 입력을 별도로 보고합니다. 나머지 모든 프롬프트 입력에는 비캐시 입력 단가가 적용됩니다. 두 가격은 입력 토큰 27만 2천 이하와 초과 구간에 각각 적용됩니다.",
    "GPT Image rates are in USD per 1 million tokens and are metered separately by text and image modality.":
      "GPT Image 가격 단위는 100만 토큰당 USD이며 텍스트와 이미지 모달리티별로 각각 측정됩니다.",
    "A dash means that resolution is unavailable and is rejected before provider dispatch.":
      "대시는 해당 해상도를 사용할 수 없으며 공급자 전송 전에 요청이 거부된다는 뜻입니다.",
    "Open-source rates are HALO catalog rates for the listed runtime pool. Project visibility and healthy provider capacity still apply.":
      "오픈소스 가격은 표시된 런타임 풀의 HALO 카탈로그 가격입니다. 프로젝트 공개 범위와 정상 공급자 용량 조건은 그대로 적용됩니다.",
    "Batch, Flex, Priority, and regional processing tiers are not listed.":
      "Batch, Flex, Priority 및 지역별 처리 가격은 이 표에 포함되지 않습니다.",
    "Search, cache storage, and modality-specific audio, image, or video token rates can add separate usage.":
      "검색, 캐시 저장소, 오디오·이미지·비디오 모달리티별 토큰 가격은 별도 사용량으로 추가될 수 있습니다.",
    "The completed upstream usage and the billing snapshot attached to the request determine the final debit.":
      "최종 차감액은 완료된 업스트림 사용량과 요청에 연결된 과금 스냅샷을 기준으로 결정됩니다.",
    "Use the dashboard Models page for the current project-visible catalog.":
      "현재 프로젝트에서 사용할 수 있는 카탈로그는 대시보드의 모델 페이지에서 확인하세요.",
    "Email & Resend": "이메일 & Resend",
    "HALO gives one project-scoped key access to provider-native model APIs, long-term Memory, Authentication, service identity, and usage controls. This quickstart sends a first OpenAI-compatible model request.":
      "HALO에서는 프로젝트 범위 키 하나로 공급자 네이티브 모델 API, 장기 메모리, 인증, 서비스 ID, 사용량 제어 기능을 이용할 수 있습니다. 이 빠른 시작 가이드에서는 첫 번째 OpenAI 호환 모델 요청을 전송합니다.",
    "HALO keeps each vendor's familiar wire protocol. Point an existing OpenAI client at the HALO base URL and keep the rest of your request structure.":
      "HALO는 각 공급자의 기존 통신 프로토콜을 그대로 유지합니다. 기존 OpenAI 클라이언트의 기본 URL을 HALO 기본 URL로 지정하면 나머지 요청 구조는 그대로 사용할 수 있습니다.",
    "If the balance is empty, HALO can return an x402 payment requirement. Add balance in the dashboard or use an SDK payment helper to settle and retry.":
      "잔액이 부족하면 HALO가 x402 결제 요구 사항을 반환할 수 있습니다. 대시보드에서 잔액을 추가하거나 SDK 결제 도우미로 결제한 뒤 다시 시도하세요.",
    "Keep client API keys on your server":
      "클라이언트 API 키는 서버에 보관하세요",
    "Send the HALO key in": "HALO 키는 ",
    "HALO documentation": "HALO 문서",
    "On this page": "이 페이지에서",
    "Project Authentication": "프로젝트 인증",
    "Project Authentication user": "프로젝트 인증 사용자",
    "Service Registry": "서비스 레지스트리",
    "The selected project becomes the dashboard context for keys, models, Memory, history, and Authentication.":
      "선택한 프로젝트가 키, 모델, 메모리, 기록 및 인증을 관리하는 대시보드 컨텍스트가 됩니다.",
    "Use separate projects for production, staging, and unrelated OEM products. Memory and Authentication are isolated by project.":
      "프로덕션, 스테이징 및 서로 관련 없는 OEM 제품에는 별도의 프로젝트를 사용하세요. 메모리와 인증 데이터는 프로젝트별로 격리됩니다.",
    "You need a HALO account and an active project. Model calls consume the account balance assigned to the project owner.":
      "HALO 계정과 활성 프로젝트가 필요합니다. 모델 호출 비용은 프로젝트 소유자의 계정 잔액에서 차감됩니다.",
    "header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.":
      " 헤더는 Anthropic 클라이언트 버전에 맞춰 유지하세요. 공급자 자격 증명은 HALO 내부에서 선택되며 반환되지 않습니다.",
  },
  zh: {
    ". Keep the required": " 标头中发送 HALO 密钥，并保留必需的 ",
    "A 402 is actionable": "可以处理 402 响应",
    "Base pricing": "基础价格",
    "Billing notes": "计费说明",
    "Cache write": "缓存写入",
    "Cached input": "缓存输入",
    "Cached image input": "缓存图片输入",
    "Cached text input": "缓存文本输入",
    "Current base rates for supported model families.":
      "受支持模型系列的当前基础价格。",
    "Google Gemini": "Google Gemini",
    "How to read prices": "价格说明",
    "Input": "输入",
    "Image input": "图片输入",
    "Image output": "图片输出",
    "Imagen · per generated image": "Imagen · 每张生成图片",
    "Media generation": "媒体生成",
    "OpenAI GPT Image": "OpenAI GPT Image",
    "Output": "输出",
    "Price": "价格",
    "Text input": "文本输入",
    "Text output": "文本输出",
    "Uncached input": "非缓存输入",
    "USD per 1M tokens": "每 100 万 token 的美元价格",
    "Veo · USD per generated second": "Veo · 每生成秒的美元价格",
    "These base rates mirror the HALO production pricing catalog checked on August 1, 2026. Text prices are in USD per 1 million tokens.":
      "这些基础价格与 2026 年 8 月 1 日核对的 HALO 生产价格目录一致。文本价格单位为每 100 万 token 的美元价格。",
    "Token rates are metered separately by the usage categories shown in each table. Paired values show standard and long-context rates in that order.":
      "Token 价格按各表所列的用量类别分别计量。成对价格依次表示标准上下文和长上下文价格。",
    "Paired Gemini rates apply at up to 200,000 input tokens and above 200,000 input tokens.":
      "Gemini 的成对价格分别适用于不超过 20 万和超过 20 万输入 token。",
    "OpenAI Chat Completions reports cached input separately. All remaining prompt input is billed at the uncached-input rate. Paired rates apply at up to 272,000 input tokens and above 272,000 input tokens.":
      "OpenAI Chat Completions 会单独报告缓存输入，其余所有提示输入均按非缓存输入价格计费。成对价格分别适用于不超过 27.2 万和超过 27.2 万输入 token。",
    "GPT Image rates are in USD per 1 million tokens and are metered separately by text and image modality.":
      "GPT Image 价格单位为每 100 万 token 的美元价格，并按文本和图片模态分别计量。",
    "A dash means that resolution is unavailable and is rejected before provider dispatch.":
      "破折号表示该分辨率不可用，请求会在发送给提供商之前被拒绝。",
    "Open-source rates are HALO catalog rates for the listed runtime pool. Project visibility and healthy provider capacity still apply.":
      "开源价格是所列运行时池的 HALO 目录价格，并仍受项目可见性和健康提供商容量限制。",
    "Batch, Flex, Priority, and regional processing tiers are not listed.":
      "本表未列出 Batch、Flex、Priority 和区域处理价格。",
    "Search, cache storage, and modality-specific audio, image, or video token rates can add separate usage.":
      "搜索、缓存存储以及音频、图片或视频模态专用 token 价格可能产生额外用量。",
    "The completed upstream usage and the billing snapshot attached to the request determine the final debit.":
      "最终扣款由已完成的上游用量和请求所附的计费快照决定。",
    "Use the dashboard Models page for the current project-visible catalog.":
      "请在控制台的模型页面查看当前项目可见的目录。",
    "Email & Resend": "电子邮件与 Resend",
    "HALO gives one project-scoped key access to provider-native model APIs, long-term Memory, Authentication, service identity, and usage controls. This quickstart sends a first OpenAI-compatible model request.":
      "通过一个项目级密钥，HALO 即可访问提供商原生模型 API、长期记忆、身份验证、服务身份和用量控制。本快速入门将发送第一个与 OpenAI 兼容的模型请求。",
    "HALO keeps each vendor's familiar wire protocol. Point an existing OpenAI client at the HALO base URL and keep the rest of your request structure.":
      "HALO 保留每个提供商原有的通信协议。将现有 OpenAI 客户端的基础 URL 指向 HALO，即可继续使用其余请求结构。",
    "If the balance is empty, HALO can return an x402 payment requirement. Add balance in the dashboard or use an SDK payment helper to settle and retry.":
      "如果余额不足，HALO 可能会返回 x402 支付要求。请在控制台中充值，或使用 SDK 支付助手完成付款后重试。",
    "Keep client API keys on your server": "请将客户端 API 密钥保存在服务器端",
    "Send the HALO key in": "请在 ",
    "HALO documentation": "HALO 文档",
    "On this page": "本页内容",
    "Project Authentication": "项目身份验证",
    "Project Authentication user": "项目身份验证用户",
    "Service Registry": "服务注册表",
    "The selected project becomes the dashboard context for keys, models, Memory, history, and Authentication.":
      "所选项目将成为管理密钥、模型、记忆、历史记录和身份验证的控制台上下文。",
    "Use separate projects for production, staging, and unrelated OEM products. Memory and Authentication are isolated by project.":
      "请为生产环境、预发布环境以及彼此无关的 OEM 产品使用不同的项目。记忆和身份验证数据按项目隔离。",
    "You need a HALO account and an active project. Model calls consume the account balance assigned to the project owner.":
      "您需要一个 HALO 账户和一个有效项目。模型调用会消耗项目所有者的账户余额。",
    "header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.":
      " 标头以匹配 Anthropic 客户端版本。提供商凭据由 HALO 内部选择且绝不会返回。",
  },
  ja: {
    ". Keep the required": " ヘッダーで送信し、必須の ",
    "A 402 is actionable": "402 応答には対処できます",
    "Base pricing": "基本価格",
    "Billing notes": "課金に関する注意",
    "Cache write": "キャッシュ書き込み",
    "Cached input": "キャッシュ入力",
    "Cached image input": "キャッシュ済み画像入力",
    "Cached text input": "キャッシュ済みテキスト入力",
    "Current base rates for supported model families.":
      "対応モデルファミリーの現在の基本価格です。",
    "Google Gemini": "Google Gemini",
    "How to read prices": "価格表の見方",
    "Input": "入力",
    "Image input": "画像入力",
    "Image output": "画像出力",
    "Imagen · per generated image": "Imagen · 生成画像 1 枚あたり",
    "Media generation": "メディア生成",
    "OpenAI GPT Image": "OpenAI GPT Image",
    "Output": "出力",
    "Price": "価格",
    "Text input": "テキスト入力",
    "Text output": "テキスト出力",
    "Uncached input": "非キャッシュ入力",
    "USD per 1M tokens": "100 万トークンあたりの USD",
    "Veo · USD per generated second": "Veo · 生成 1 秒あたりの USD",
    "These base rates mirror the HALO production pricing catalog checked on August 1, 2026. Text prices are in USD per 1 million tokens.":
      "この基本価格は、2026 年 8 月 1 日に確認した HALO 本番価格カタログと一致しています。テキスト価格の単位は 100 万トークンあたりの USD です。",
    "Token rates are metered separately by the usage categories shown in each table. Paired values show standard and long-context rates in that order.":
      "トークン価格は各表に示す使用量区分ごとに個別計測されます。2 つの価格は標準コンテキスト、長文コンテキストの順です。",
    "Paired Gemini rates apply at up to 200,000 input tokens and above 200,000 input tokens.":
      "Gemini の 2 つの価格は、入力トークン 20 万以下と 20 万超にそれぞれ適用されます。",
    "OpenAI Chat Completions reports cached input separately. All remaining prompt input is billed at the uncached-input rate. Paired rates apply at up to 272,000 input tokens and above 272,000 input tokens.":
      "OpenAI Chat Completions はキャッシュ入力を個別に報告します。残りのすべてのプロンプト入力には非キャッシュ入力価格が適用されます。2 つの価格は入力トークン 27 万 2 千以下と超過時にそれぞれ適用されます。",
    "GPT Image rates are in USD per 1 million tokens and are metered separately by text and image modality.":
      "GPT Image の価格単位は 100 万トークンあたりの USD で、テキストと画像のモダリティごとに個別計測されます。",
    "A dash means that resolution is unavailable and is rejected before provider dispatch.":
      "ダッシュはその解像度を利用できず、プロバイダーへの送信前にリクエストが拒否されることを示します。",
    "Open-source rates are HALO catalog rates for the listed runtime pool. Project visibility and healthy provider capacity still apply.":
      "オープンソース価格は、掲載ランタイムプールの HALO カタログ価格です。プロジェクトの表示範囲と正常なプロバイダー容量の条件は引き続き適用されます。",
    "Batch, Flex, Priority, and regional processing tiers are not listed.":
      "Batch、Flex、Priority、地域別処理の価格は掲載していません。",
    "Search, cache storage, and modality-specific audio, image, or video token rates can add separate usage.":
      "検索、キャッシュストレージ、音声・画像・動画モダリティ別のトークン価格は、別途使用量として加算される場合があります。",
    "The completed upstream usage and the billing snapshot attached to the request determine the final debit.":
      "最終的な差し引き額は、完了した上流使用量とリクエストに添付された課金スナップショットによって決まります。",
    "Use the dashboard Models page for the current project-visible catalog.":
      "現在のプロジェクトで表示されるカタログは、ダッシュボードのモデルページで確認してください。",
    "Email & Resend": "メール & Resend",
    "HALO gives one project-scoped key access to provider-native model APIs, long-term Memory, Authentication, service identity, and usage controls. This quickstart sends a first OpenAI-compatible model request.":
      "HALO では、1 つのプロジェクトスコープキーで、プロバイダー固有のモデル API、長期メモリ、認証、サービス ID、使用量制御を利用できます。このクイックスタートでは、OpenAI 互換モデルへの最初のリクエストを送信します。",
    "HALO keeps each vendor's familiar wire protocol. Point an existing OpenAI client at the HALO base URL and keep the rest of your request structure.":
      "HALO は各プロバイダー固有の通信プロトコルを維持します。既存の OpenAI クライアントのベース URL を HALO のベース URL に変更すれば、その他のリクエスト構造はそのまま使用できます。",
    "If the balance is empty, HALO can return an x402 payment requirement. Add balance in the dashboard or use an SDK payment helper to settle and retry.":
      "残高がない場合、HALO は x402 の支払い要件を返すことがあります。ダッシュボードで残高を追加するか、SDK の支払いヘルパーで決済してから再試行してください。",
    "Keep client API keys on your server":
      "クライアント API キーはサーバー側で保管してください",
    "Send the HALO key in": "HALO キーは ",
    "HALO documentation": "HALO ドキュメント",
    "On this page": "このページの内容",
    "Project Authentication": "プロジェクト認証",
    "Project Authentication user": "プロジェクト認証ユーザー",
    "Service Registry": "サービスレジストリ",
    "The selected project becomes the dashboard context for keys, models, Memory, history, and Authentication.":
      "選択したプロジェクトが、キー、モデル、メモリ、履歴、認証を管理するダッシュボードのコンテキストになります。",
    "Use separate projects for production, staging, and unrelated OEM products. Memory and Authentication are isolated by project.":
      "本番環境、ステージング環境、関連のない OEM 製品には、別々のプロジェクトを使用してください。メモリと認証データはプロジェクトごとに分離されます。",
    "You need a HALO account and an active project. Model calls consume the account balance assigned to the project owner.":
      "HALO アカウントと有効なプロジェクトが必要です。モデル呼び出しでは、プロジェクト所有者のアカウント残高が使用されます。",
    "header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.":
      " ヘッダーを Anthropic クライアントのバージョンに合わせて維持してください。プロバイダーの認証情報は HALO 内部で選択され、返されることはありません。",
  },
};

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

const preserveProductTerms = (
  locale: Exclude<DocsLocale, "en">,
  source: string,
  value: string
): string => {
  let translated = value;

  if (source.includes("Resend")) {
    translated =
      locale === "ko"
        ? translated.replaceAll("재전송", "Resend")
        : locale === "zh"
          ? translated.replaceAll("重新发送", "Resend")
          : translated.replaceAll("再送信", "Resend");
  }
  if (source.includes("Keeper")) {
    translated =
      locale === "ko"
        ? translated.replaceAll("키퍼", "Keeper")
        : locale === "zh"
          ? translated
              .replaceAll("守护者", "Keeper")
              .replaceAll("保管人", "Keeper")
          : translated.replaceAll("キーパー", "Keeper");
  }
  if (source.includes("Anthropic")) {
    translated =
      locale === "ko"
        ? translated.replaceAll("인류", "Anthropic")
        : locale === "zh"
          ? translated.replaceAll("人类", "Anthropic")
          : translated.replaceAll("人類", "Anthropic");
  }
  if (locale === "zh" && /memory/i.test(source)) {
    translated = translated.replaceAll("内存", "记忆");
  }

  return translated;
};

export const translateDocsText = (
  locale: DocsLocale,
  value: string
): string => {
  if (locale === "en") return value;
  const normalized = normalize(value);
  if (!normalized) return value;
  const dictionary = GENERATED_TRANSLATIONS[locale] as Record<string, string>;
  let translated =
    REVIEWED_OVERRIDES[locale][normalized] || dictionary[normalized];
  if (!translated || translated === normalized) return value;

  translated = preserveProductTerms(locale, normalized, translated);

  const leadingWhitespace = value.match(/^\s*/)?.[0] || "";
  const trailingWhitespace = value.match(/\s*$/)?.[0] || "";
  return `${leadingWhitespace}${translated}${trailingWhitespace}`;
};

const isPlainObject = (value: object): boolean => {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const localizeDocsHref = (locale: DocsLocale, href: string): string => {
  if (
    locale === "en" ||
    !href.startsWith("/") ||
    href.startsWith("//")
  ) {
    return href;
  }

  const match = href.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] || href;
  const suffix = match?.[2] || "";
  return `${getLocalizedDocHref(locale, pathname.replace(/^\/+/, ""))}${suffix}`;
};

const getNodeText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (
    node === null ||
    node === undefined ||
    typeof node === "boolean"
  ) {
    return "";
  }
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (!isValidElement(node)) return "";
  const element = node as ReactElement<{ children?: ReactNode }>;
  return getNodeText(element.props.children);
};

interface ContextualSegment {
  source: string;
  translated: string;
}

const REVIEWED_CONTEXTUAL_OVERRIDES: Record<
  Exclude<DocsLocale, "en">,
  Record<string, readonly ContextualSegment[]>
> = {
  ko: {
    "A key beginning with sk- can spend balance and access project data. Do not embed it in a browser, mobile binary, firmware, public repository, or model tool arguments.":
      [
        { source: "A key beginning with", translated: "" },
        {
          source:
            "can spend balance and access project data. Do not embed it in a browser, mobile binary, firmware, public repository, or model tool arguments.",
          translated:
            "로 시작하는 키는 잔액을 사용하고 프로젝트 데이터에 접근할 수 있습니다. 브라우저, 모바일 바이너리, 펌웨어, 공개 저장소 또는 모델 도구 인자에 이 키를 포함하지 마세요.",
        },
      ],
    "Anthropic-compatible requests use the HALO/claude/v1/messages endpoint and the familiarx-api-key header.":
      [
        {
          source: "Anthropic-compatible requests use the HALO",
          translated: "Anthropic 호환 요청은 HALO의 ",
        },
        {
          source: "endpoint and the familiar",
          translated: " 엔드포인트와 일반적인 ",
        },
        { source: "header.", translated: " 헤더를 사용합니다." },
      ],
    "Open the HALO dashboard, choose Projects, and create a project for the application or environment you are integrating.":
      [
        {
          source: "Open the HALO dashboard, choose",
          translated: "HALO 대시보드에서 ",
        },
        { source: "Projects", translated: "프로젝트" },
        {
          source:
            ", and create a project for the application or environment you are integrating.",
          translated:
            "를 선택한 다음, 연동할 애플리케이션 또는 환경용 프로젝트를 생성하세요.",
        },
      ],
    "Memory is isolated by projectKey + endUserKey. A sessionKey may be carried as legacy metadata, but it does not replace the end-user scope.":
      [
        { source: "Memory is isolated by", translated: "메모리는 " },
        { source: ". A", translated: " 조합으로 격리됩니다. " },
        {
          source:
            "may be carried as legacy metadata, but it does not replace the end-user scope.",
          translated:
            "는 레거시 메타데이터로 전달할 수 있지만 최종 사용자 범위를 대신하지는 않습니다.",
        },
      ],
    "Select API Keys, create a client key, and copy it once. Store it in your server secret manager as HALO_API_KEY.":
      [
        { source: "Select", translated: "" },
        { source: "API Keys", translated: "API 키" },
        {
          source:
            ", create a client key, and copy it once. Store it in your server secret manager as",
          translated:
            "를 선택하고 클라이언트 키를 생성한 뒤 한 번만 복사하세요. 서버의 비밀 관리 도구에 ",
        },
        { source: ".", translated: "라는 이름으로 저장하세요." },
      ],
    "Send the HALO key in x-api-key. Keep the requiredanthropic-version header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.":
      [
        { source: "Send the HALO key in", translated: "HALO 키를 " },
        {
          source: ". Keep the required",
          translated: " 헤더로 전송합니다. 필수 ",
        },
        {
          source:
            "header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.",
          translated:
            " 헤더는 Anthropic 클라이언트 버전에 맞춰 유지하세요. 공급자 자격 증명은 HALO 내부에서 선택되며 반환되지 않습니다.",
        },
      ],
  },
  zh: {
    "A key beginning with sk- can spend balance and access project data. Do not embed it in a browser, mobile binary, firmware, public repository, or model tool arguments.":
      [
        { source: "A key beginning with", translated: "以 " },
        {
          source:
            "can spend balance and access project data. Do not embed it in a browser, mobile binary, firmware, public repository, or model tool arguments.",
          translated:
            " 开头的密钥可以使用余额并访问项目数据。请勿将其嵌入浏览器、移动应用二进制文件、固件、公共仓库或模型工具参数中。",
        },
      ],
    "Anthropic-compatible requests use the HALO/claude/v1/messages endpoint and the familiarx-api-key header.":
      [
        {
          source: "Anthropic-compatible requests use the HALO",
          translated: "Anthropic 兼容请求使用 HALO 的 ",
        },
        {
          source: "endpoint and the familiar",
          translated: " 端点和常用的 ",
        },
        { source: "header.", translated: " 标头。" },
      ],
    "Open the HALO dashboard, choose Projects, and create a project for the application or environment you are integrating.":
      [
        {
          source: "Open the HALO dashboard, choose",
          translated: "打开 HALO 控制台，选择",
        },
        { source: "Projects", translated: "项目" },
        {
          source:
            ", and create a project for the application or environment you are integrating.",
          translated: "，然后为要集成的应用程序或环境创建一个项目。",
        },
      ],
    "Memory is isolated by projectKey + endUserKey. A sessionKey may be carried as legacy metadata, but it does not replace the end-user scope.":
      [
        { source: "Memory is isolated by", translated: "记忆按 " },
        { source: ". A", translated: " 隔离。" },
        {
          source:
            "may be carried as legacy metadata, but it does not replace the end-user scope.",
          translated: " 可以作为旧版元数据传递，但不能取代最终用户范围。",
        },
      ],
    "Select API Keys, create a client key, and copy it once. Store it in your server secret manager as HALO_API_KEY.":
      [
        { source: "Select", translated: "选择" },
        { source: "API Keys", translated: "API 密钥" },
        {
          source:
            ", create a client key, and copy it once. Store it in your server secret manager as",
          translated: "，创建客户端密钥并仅复制一次。将其作为 ",
        },
        { source: ".", translated: " 存储在服务器密钥管理器中。" },
      ],
    "Send the HALO key in x-api-key. Keep the requiredanthropic-version header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.":
      [
        { source: "Send the HALO key in", translated: "请在 " },
        {
          source: ". Keep the required",
          translated: " 标头中发送 HALO 密钥，并保留必需的 ",
        },
        {
          source:
            "header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.",
          translated:
            " 标头以匹配 Anthropic 客户端版本。提供商凭据由 HALO 内部选择且绝不会返回。",
        },
      ],
  },
  ja: {
    "A key beginning with sk- can spend balance and access project data. Do not embed it in a browser, mobile binary, firmware, public repository, or model tool arguments.":
      [
        { source: "A key beginning with", translated: "" },
        {
          source:
            "can spend balance and access project data. Do not embed it in a browser, mobile binary, firmware, public repository, or model tool arguments.",
          translated:
            "で始まるキーは、残高を使用してプロジェクトデータにアクセスできます。ブラウザ、モバイルバイナリ、ファームウェア、公開リポジトリ、モデルツールの引数には埋め込まないでください。",
        },
      ],
    "Anthropic-compatible requests use the HALO/claude/v1/messages endpoint and the familiarx-api-key header.":
      [
        {
          source: "Anthropic-compatible requests use the HALO",
          translated: "Anthropic 互換リクエストでは、HALO の ",
        },
        {
          source: "endpoint and the familiar",
          translated: " エンドポイントと一般的な ",
        },
        { source: "header.", translated: " ヘッダーを使用します。" },
      ],
    "Open the HALO dashboard, choose Projects, and create a project for the application or environment you are integrating.":
      [
        {
          source: "Open the HALO dashboard, choose",
          translated: "HALO ダッシュボードで",
        },
        { source: "Projects", translated: "プロジェクト" },
        {
          source:
            ", and create a project for the application or environment you are integrating.",
          translated:
            "を選択し、連携するアプリケーションまたは環境用のプロジェクトを作成します。",
        },
      ],
    "Memory is isolated by projectKey + endUserKey. A sessionKey may be carried as legacy metadata, but it does not replace the end-user scope.":
      [
        { source: "Memory is isolated by", translated: "メモリは " },
        { source: ". A", translated: " ごとに分離されます。" },
        {
          source:
            "may be carried as legacy metadata, but it does not replace the end-user scope.",
          translated:
            " は従来のメタデータとして渡せますが、エンドユーザーのスコープを置き換えるものではありません。",
        },
      ],
    "Select API Keys, create a client key, and copy it once. Store it in your server secret manager as HALO_API_KEY.":
      [
        { source: "Select", translated: "" },
        { source: "API Keys", translated: "API キー" },
        {
          source:
            ", create a client key, and copy it once. Store it in your server secret manager as",
          translated:
            "を選択してクライアントキーを作成し、一度だけコピーします。サーバーのシークレット管理ツールに ",
        },
        { source: ".", translated: " として保存してください。" },
      ],
    "Send the HALO key in x-api-key. Keep the requiredanthropic-version header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.":
      [
        { source: "Send the HALO key in", translated: "HALO キーを " },
        {
          source: ". Keep the required",
          translated: " ヘッダーで送信します。必須の ",
        },
        {
          source:
            "header expected by your Anthropic client version. Provider credentials are selected inside HALO and are never returned.",
          translated:
            " ヘッダーは Anthropic クライアントのバージョンに合わせて維持してください。プロバイダーの認証情報は HALO 内部で選択され、返されることはありません。",
        },
      ],
  },
};

const getContextualSegments = (
  locale: Exclude<DocsLocale, "en">,
  node: ReactElement<Record<string, unknown>>
): ContextualSegment[] | null => {
  const signature = normalize(
    getNodeText(node.props.children as ReactNode)
  );
  const dictionary = GENERATED_CONTEXTUAL_TRANSLATIONS[locale] as Record<
    string,
    readonly ContextualSegment[]
  >;
  const segments =
    REVIEWED_CONTEXTUAL_OVERRIDES[locale][signature] ||
    dictionary[signature];
  return segments ? [...segments] : null;
};

const localizeContextualNode = (
  node: ReactNode,
  locale: Exclude<DocsLocale, "en">,
  segments: ContextualSegment[],
  cursor: { value: number }
): ReactNode => {
  if (typeof node === "string") {
    const normalized = normalize(node);
    if (!normalized) return node;
    const segment = segments[cursor.value];
    if (segment && segment.source === normalized) {
      cursor.value += 1;
      const leadingWhitespace = node.match(/^\s*/)?.[0] || "";
      const trailingWhitespace = node.match(/\s*$/)?.[0] || "";
      const translated = preserveProductTerms(
        locale,
        segment.source,
        segment.translated
      );
      return `${leadingWhitespace}${translated}${trailingWhitespace}`;
    }
    return translateDocsText(locale, node);
  }
  if (
    node === null ||
    node === undefined ||
    typeof node === "number" ||
    typeof node === "boolean"
  ) {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((item) =>
      localizeContextualNode(item, locale, segments, cursor)
    );
  }
  if (!isValidElement(node)) return node;
  if (
    typeof node.type === "string" &&
    NON_TRANSLATABLE_ELEMENTS.has(node.type)
  ) {
    return node;
  }
  const element = node as ReactElement<Record<string, unknown>>;
  const localizedProps = {
    ...element.props,
    ...(typeof element.props.href === "string"
      ? { href: localizeDocsHref(locale, element.props.href) }
      : {}),
  };
  return cloneElement(element, {
    ...localizedProps,
    children: localizeContextualNode(
      element.props.children as ReactNode,
      locale,
      segments,
      cursor
    ),
  });
};

const localizeValue = (
  value: unknown,
  locale: DocsLocale,
  propName?: string
): unknown => {
  if (typeof value === "string") {
    if (propName === "href") return localizeDocsHref(locale, value);
    return propName && NON_TRANSLATABLE_PROPS.has(propName)
      ? value
      : translateDocsText(locale, value);
  }
  if (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "function"
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizeValue(item, locale, propName));
  }
  if (isValidElement(value)) {
    return localizeDocsNode(value, locale);
  }
  if (typeof value === "object" && isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        localizeValue(item, locale, key),
      ])
    );
  }
  return value;
};

export const localizeDocsNode = (
  node: ReactNode,
  locale: DocsLocale
): ReactNode => {
  if (locale === "en") return node;
  if (typeof node === "string") return translateDocsText(locale, node);
  if (
    node === null ||
    node === undefined ||
    typeof node === "number" ||
    typeof node === "boolean"
  ) {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((item) => localizeDocsNode(item, locale));
  }
  if (!isValidElement(node)) return node;
  if (
    typeof node.type === "string" &&
    NON_TRANSLATABLE_ELEMENTS.has(node.type)
  ) {
    return node;
  }

  const element = node as ReactElement<Record<string, unknown>>;
  if (
    typeof element.type === "string" &&
    (element.type === "p" || element.type === "li")
  ) {
    const contextualSegments = getContextualSegments(locale, element);
    if (contextualSegments) {
      return cloneElement(element, {
        ...element.props,
        children: localizeContextualNode(
          element.props.children as ReactNode,
          locale,
          contextualSegments,
          { value: 0 }
        ),
      });
    }
  }
  const translatedProps = Object.fromEntries(
    Object.entries(element.props).map(([key, value]) => [
      key,
      localizeValue(value, locale, key),
    ])
  );
  return cloneElement(element, translatedProps);
};

export const localizeDocEntry = (
  entry: DocEntry | null,
  locale: DocsLocale
): DocEntry | null => {
  if (!entry || locale === "en") return entry;
  return {
    ...entry,
    title: translateDocsText(locale, entry.title),
    description: translateDocsText(locale, entry.description),
    group: translateDocsText(locale, entry.group),
    keywords: entry.keywords
      ? [
          ...entry.keywords,
          ...entry.keywords.map((keyword) =>
            translateDocsText(locale, keyword)
          ),
        ]
      : undefined,
  };
};

export const localizeNavGroups = (
  groups: NavGroup[],
  locale: DocsLocale
): NavGroup[] => {
  if (locale === "en") return groups;
  return groups.map((group) => ({
    label: translateDocsText(locale, group.label),
    items: group.items.map(
      (entry) => localizeDocEntry(entry, locale) as DocEntry
    ),
  }));
};

export const localizeDocPage = (
  page: DocPage,
  locale: DocsLocale
): DocPage => {
  if (locale === "en") return page;
  return {
    toc: page.toc.map((item) => ({
      ...item,
      label: translateDocsText(locale, item.label),
    })),
    content: localizeDocsNode(page.content, locale),
  };
};
