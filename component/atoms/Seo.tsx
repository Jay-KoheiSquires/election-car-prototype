/**
 * SEO/OGPメタデータコンポーネント
 * 各ページのhead要素にメタ情報を追加
 */
import Head from "next/head";

interface SeoProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}

const SITE_NAME = "選挙カーレンタルラボ";
const DEFAULT_DESCRIPTION =
  "選挙カーのレンタル料金をリアルタイムで計算。統一地方選挙・一般地方選挙・衆参選挙に対応。鳥取県から全国へ配送。";
const DEFAULT_OG_IMAGE = "/og-image.png";
const SITE_URL = "https://jay-koheisquires.github.io/election-car-prototype";

export const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
}: SeoProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* OGP */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ja_JP" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />

      {/* その他 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#ff1250" />

      {noindex && <meta name="robots" content="noindex,nofollow" />}
    </Head>
  );
};

export default Seo;
