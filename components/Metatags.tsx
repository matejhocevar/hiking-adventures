import Head from "next/head";

export default function Metatags({
  title = "Nena & Blaž - Hiking adventures",
  description = "The Pacific Crest Trail is 2,653 mi (4,270 km) long and ranges in elevation from just above sea level at the Oregon–Washington border on the Bridge of the Gods to 13,153 feet (4,009 m) at Forester Pass in the Sierra Nevada. The route passes through 25 national forests and 7 national parks. Its midpoint is near Chester, California, where the Sierra and Cascade mountain ranges meet.",
  image = "https://www.backpacker.com/wp-content/uploads/2019/10/33375759220_38b9bf64ce_o.jpg",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@pctassociation" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
