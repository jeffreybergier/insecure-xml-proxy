const API_KEY = process.env.VALID_KEY;

const TEST_FEEDS = [
  // RSS Feeds
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  { name: "MacRumors", url: "https://www.macrumors.com/macrumors.xml" },

  // Podcast Feeds
  { name: "The Talk Show", url: "https://daringfireball.net/thetalkshow/rss" },

];

// Helper to avoid W3C rate limits
const wait = (ms) => new Promise(resolve => {
  console.log(`...Waiting for ${ms}ms...`);
  setTimeout(resolve, ms);
});
async function getProxyHTMLBodyWithURLString(urlString) {
  const response = await fetch(`http://localhost:3000/proxy/submit?key=${API_KEY}&url=${encodeURIComponent(urlString)}`);
  if (!response.ok) { 
    console.error(`Error: getProxyHTMLBodyWithURLString(${urlString})`);
    return null; 
  }
  return await response.text();
} 

async function getXMLBodyWithURLString(urlString) {
  const response = await fetch(urlString);
  if (!response.ok) { 
    console.error(`Error: getXMLBodyWithURLString(${urlString})`);
    return null; 
  }
  return await response.text();
}

async function getW3CXMLBodyWithXMLBody(xmlBody) {
  const cleansedXMLBody = xmlBody.replace(/http:\/\/localhost:3000/g, 'https://xxx-proxy-yyy.com');
  const params = new URLSearchParams();
  params.append('output', 'soap12');
  params.append('manual', '1');
  params.append('rawdata', cleansedXMLBody);

  const response = await fetch('https://validator.w3.org/feed/check.cgi', {
    method: 'POST',
    body: params
  });
  
  if (!response.ok) { 
    console.error(`Error: getW3CXMLBodyWithXMLBody status(${response.status}) body(${cleansedXMLBody.length})`);
    return null; 
  }
  return await response.text();
}

function analyzeProxiedHTMLBody(htmlBody) {
  const match = htmlBody.match(/<textarea[^>]*>(http[^<]+)<\/textarea>/i);
  if (!match) { 
    console.error(`Error: analyzeProxiedHTMLBody(${htmlBody})`);
    return null; 
  }
  return match[1].trim();
}

function analyzeW3CXMLBody(xmlBody) {
  const errorMatch = xmlBody.match(/<m:errorcount>(\d+)<\/m:errorcount>/);
  const errors = errorMatch ? parseInt(errorMatch[1], 10) : -1;
  const warningMatch = xmlBody.match(/<m:warningcount>(\d+)<\/m:warningcount>/);
  const warnings = warningMatch ? parseInt(warningMatch[1], 10) : -1;

  if (errors < 0 || warnings < 0) return -1;
  return errors + warnings;
}

async function startTests() {
  console.log(`Testing Feeds: ${TEST_FEEDS.length}`);
  let errorCount = 0;
  let successCount = 0;

  for (const lhs of TEST_FEEDS) {
    console.log(`Testing: ${lhs.name} ${lhs.url}`);
    try {
      // 1. Get RHS via Proxy
      const rhsHTMLBody = await getProxyHTMLBodyWithURLString(lhs.url);
      const rhsURL = rhsHTMLBody ? analyzeProxiedHTMLBody(rhsHTMLBody) : null;
      if (!rhsURL) { errorCount += 1; continue; }
      
      // 2. Fetch both XML bodies
      const lhsXML = await getXMLBodyWithURLString(lhs.url);
      const rhsXML = await getXMLBodyWithURLString(rhsURL);
      if (!lhsXML || !rhsXML) { errorCount += 1; continue; }
      
      // 3. W3C Validation (LHS)
      await wait(3001);
      const lhsW3C = await getW3CXMLBodyWithXMLBody(lhsXML);
      const lhsCount = analyzeW3CXMLBody(lhsW3C);
      
      // 4. W3C Validation (RHS)
      await wait(3001); 
      const rhsW3C = await getW3CXMLBodyWithXMLBody(rhsXML);
      const rhsCount = analyzeW3CXMLBody(rhsW3C);

      // 5. Comparison
      if (lhsCount !== rhsCount) {
        console.error(`Error: ${lhs.name} ${lhs.url} lhs(${lhsCount}) rhs(${rhsCount})`);
        console.error("-------- LHS W3C Validation Response --------");
        console.error(`${lhsW3C}`);
        console.error("-------- RHS W3C Validation Response --------");
        console.error(`${rhsW3C}`);
        errorCount +=1
      } else {
        console.log(`Success: ${lhs.name} ${lhs.url} errorCount: ${lhsCount}`);
        successCount += 1;
      }
    } catch (err) {
      console.error(`Error: ${lhs.name} ${lhs.url} ${err.message}`);
      errorCount += 1;
    }
  }

  console.log(`Tested total(${TEST_FEEDS.length}) success(${successCount}) error(${errorCount})`);
  process.exit(errorCount);
}

startTests();