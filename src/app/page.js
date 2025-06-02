'use client'
import React from 'react'

const Page = () => {
  const handleClick = async () => {
    try {
      const response = await fetch('https://linkedin-company.chitlangia.co/api/post_companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          batch_id: '1222',
          company_urls: [
            "https://www.linkedin.com/company/thebicestercollection/",
            "https://www.linkedin.com/company/ericsson/",
            "https://www.linkedin.com/company/tns/",
            "https://www.linkedin.com/company/bausch-&-lomb/",
            "https://www.linkedin.com/company/carne-group/",
            "https://www.linkedin.com/company/waterland-private-equity/",
            "https://www.linkedin.com/company/worldwide-flight-services/",
            "https://www.linkedin.com/company/aer-lingus/",
            "https://www.linkedin.com/company/verband/",
            "https://www.linkedin.com/company/the-galmont-hotel-spa-galway/",
            "https://www.linkedin.com/company/airbnb/",
            "https://www.linkedin.com/company/lumavision/",
            "https://www.linkedin.com/company/citi/",
            "https://www.linkedin.com/company/coinbase/",
            "https://www.linkedin.com/company/wix-com/",
            "https://www.linkedin.com/company/dynamic-resources-inc./",
            "https://www.linkedin.com/company/indeed-com/",
            "https://www.linkedin.com/company/opwireland/",
            "https://www.linkedin.com/company/connacht-hospitality-group/",
            "https://www.linkedin.com/company/prochem-engineering/",
            "https://www.linkedin.com/company/maldron-hotels/",
            "https://www.linkedin.com/company/artizan-food-co-/",
            "https://www.linkedin.com/company/al-tayer-group/",
            "https://www.linkedin.com/company/workhuman/",
            "https://www.linkedin.com/company/masterlink-logistics/",
            "https://www.linkedin.com/company/accenture/",
            "https://www.linkedin.com/company/lough-rynn-castle/",
            "https://www.linkedin.com/company/health-service-executive/",
            "https://www.linkedin.com/company/pphe-hotel-group/",
            "https://www.linkedin.com/company/the-brooklodge-&-wells-spa/",
            "https://www.linkedin.com/company/primetals/",
            "https://www.linkedin.com/company/bt-sourced/",
            "https://www.linkedin.com/company/ptsbireland/",
            "https://www.linkedin.com/company/technological-university-dublin/",
            "https://www.linkedin.com/company/kerry/",
            "https://www.linkedin.com/company/svp-ireland/",
            "https://www.linkedin.com/company/legal-and-general-asset-management/",
            "https://www.linkedin.com/company/slateam/",
            "https://www.linkedin.com/company/amundi-/",
            "https://www.linkedin.com/company/pzena-investment-management/",
            "https://www.linkedin.com/company/bmo-capital-markets/",
            "https://www.linkedin.com/company/ara-partners/",
            "https://www.linkedin.com/company/guggenheim-partners/",
            "https://www.linkedin.com/company/northern-trust/",
            "https://www.linkedin.com/company/kkr/",
            "https://www.linkedin.com/company/calor-ireland/",
            "https://www.linkedin.com/company/fisher-investments/",
            "https://www.linkedin.com/company/tdsecurities/",
            "https://www.linkedin.com/company/axa-mps-financial-dac/",
            "https://www.linkedin.com/company/uniquelyireland/",
            "https://www.linkedin.com/company/enterprise-ireland/",
            "https://www.linkedin.com/company/irish-farmers-association/",
            "https://www.linkedin.com/company/cbre-gws/",
            "https://www.linkedin.com/company/murphy-geospatial/",
            "https://www.linkedin.com/company/iadt-dun-laoghaire-institute-of-art-design-and-technology/",
            "https://www.linkedin.com/company/transport-infrastructure-ireland/",
            "https://www.linkedin.com/company/irish-manufacturing-research/",
            "https://www.linkedin.com/company/spglobal/",
            "https://www.linkedin.com/company/law-society-of-ireland/",
            "https://www.linkedin.com/company/ibec/",
            "https://www.linkedin.com/company/courts-service/",
            "https://www.linkedin.com/company/dropbox/",
            "https://www.linkedin.com/company/notionhq/",
            "https://www.linkedin.com/company/heanet-limited/",
            "https://www.linkedin.com/company/digitalrealty/",
            "https://www.linkedin.com/company/ibm/",
            "https://www.linkedin.com/company/carelon-global-solutions-ireland/",
            "https://www.linkedin.com/company/clayton-hotels/",
            "https://www.linkedin.com/company/accessgroup/",
            "https://www.linkedin.com/company/waystoneglobal/",
            "https://www.linkedin.com/company/bnpparibassecuritiesservices/",
            "https://www.linkedin.com/company/knightsbrook-resort/",
            "https://www.linkedin.com/company/viotas/",
            "https://www.linkedin.com/company/brown-thomas/",
            "https://www.linkedin.com/company/romero-games-ltd-/",
            "https://www.linkedin.com/company/desso/",
            "https://www.linkedin.com/company/almac-group/",
            "https://www.linkedin.com/company/chiesi-group/",
            "https://www.linkedin.com/company/the-hope-foundation/",
            "https://www.linkedin.com/company/bristol-myers-squibb/",
            "https://www.linkedin.com/company/the-wilder-townhouse-dublin/",
            "https://www.linkedin.com/company/sport-ireland/",
            "https://www.linkedin.com/company/eirireland/",
            "https://www.linkedin.com/company/flutter-uk-ireland/",
            "https://www.linkedin.com/company/gate-theatre-dublin/",
            "https://www.linkedin.com/company/johnson-&-johnson/",
            "https://www.linkedin.com/company/servicenow/",
            "https://www.linkedin.com/company/medical-council-ireland/",
            "https://www.linkedin.com/company/hawksford/"
          ]
        })
      });

      const data = await response.json();
      console.log("✅ API Response:", data);
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Send Company URLs to API</h1>
      <button onClick={handleClick} style={{ padding: '1rem 2rem', fontSize: '16px' }}>
        Submit Data
      </button>
    </div>
  );
};

export default Page;
