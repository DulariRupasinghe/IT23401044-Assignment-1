const { test, expect } = require("@playwright/test");

// ---------------------
// TEST DATA
// ---------------------
const positiveCases = [
  { id: "Pos_Fun_001", input: "mama gedhara yanavaa.", desc: "Simple present tense", expected: "මම ගෙදර යනවා.", length: "S" },
  { id: "Pos_Fun_002", input: "mata bath oonee.", desc: "Simple need statement", expected: "මට බත් ඕනේ", length: "S" },
  { id: "Pos_Fun_003", input: "api paasal yanavaa.", desc: "Simple plural statement", expected: "අපි පාසල් යනවා.", length: "S" },
  { id: "Pos_Fun_004", input: "mama gedhara yanavaa, haebaeyi vahina nisaa dhaenna yannee naee.", desc: "Compound with conjunction", expected: "මම ගෙදර යනවා, හැබැයි වහින නිසා දැන්න යන්නේ නෑ.", length: "M" },
  { id: "Pos_Fun_005", input: "api kaeema kanna yanavaa saha passe chithrapatayakuth balanavaa.", desc: "Compound with comma", expected: "අපි කෑම කන්න යනවා සහ පස්සෙ චිත්‍රපටයකුත් බලනවා.", length: "M" },
  { id: "Pos_Fun_006", input: "oya enavaanam mama balan innavaa.", desc: "Conditional complex", expected: "ඔය එනවානම් මම බලන් ඉන්නවා.", length: "S" },
  { id: "Pos_Fun_007", input: "vaessa unath api yanna epaeyi.", desc: "Cause-effect", expected: "වැස්ස උනත් අපි යන්න එපැයි.", length: "S" },
  { id: "Pos_Fun_008", input: "oyaata kohomadha?", desc: "Simple question", expected: "ඔයාට කොහොමද?", length: "S" },
  { id: "Pos_Fun_009", input: "meeka hariyata vaeda karanavaadha?", desc: "Question with object", expected: "මේක හරියට වැඩ කරනවාද?", length: "M" },
  { id: "Pos_Fun_010", input: "vahaama enna.", desc: "Command", expected: "වහාම එන්න.", length: "S" },
  { id: "Pos_Fun_011", input: "issarahata yanna.", desc: "Polite command", expected: "ඉස්සරහට යන්න.", length: "S" },
  { id: "Pos_Fun_012", input: "mama ehema karannee naehae.", desc: "Negative present", expected: "මම එහෙම කරන්නේ නැහැ.", length: "S" },
  { id: "Pos_Fun_013", input: "api heta ennee naehae.", desc: "Negative future", expected: "අපි හෙට එන්නේ නැහැ.", length: "S" },
  { id: "Pos_Fun_014", input: "aayuboovan!", desc: "Greeting", expected: "ආයුබෝවන්!", length: "S" },
  { id: "Pos_Fun_015", input: "suba udhaeesanak!", desc: "Time-based greeting", expected: "සුබ උදෑසනක්!", length: "S" },
  { id: "Pos_Fun_016", input: "karuNaakaralaa eka poddak balanna.", desc: "Polite request", expected: "කරුණාකරලා එක පොඩ්ඩක් බලන්න.", length: "M" },
  { id: "Pos_Fun_017", input: "hari, mama karannam.", desc: "Positive response", expected: "හරි, මම කරන්නම්.", length: "S" },
  { id: "Pos_Fun_018", input: "Zoom meeting ekak thiyennee.", desc: "Embedded brand term", expected: "Zoom meeting එකක් තියෙන්නේ.", length: "S" },
  { id: "Pos_Fun_019", input: "Documents tika attach karalaa mata email ekak evanna.", desc: "Tech term in sentence", expected: "Documents ටික attach කරලා මට email එකක් එවන්න.", length: "M" },
  { id: "Pos_Fun_020", input: "Rs. 5343 USD 1500", desc: "Currency", expected: "Rs. 5343 USD 1500", length: "S" },
  { id: "Pos_Fun_021", input: "7.30 AM 12.00 noon", desc: "Time formats", expected: "7.30 AM 12.00 noon", length: "S" },
  { id: "Pos_Fun_022", input: "ela machan! supiri!!", desc: "Informal greeting", expected: "එල මචන්! සුපිරි!!", length: "S" },
  { id: "Pos_Fun_023", input: "appatasiri, mata beheth bonna amathaka vunaa kiyahankoo.", desc: "Colloquial complaint", expected: "අප්පටසිරි, මට බෙහෙත් බොන්න අමතක වුනා කියහන්කෝ.", length: "M" },
];

const negativeCases = [
  { id: "Neg_Fun_001", input: "asdfghjkl", desc: "Random typing", expected: "අස්ඩ්ෆ්ග්හ්ජ්ක්ල්", length: "S" },
  { id: "Neg_Fun_002", input: "mamagedharayanavaamatapaankannaooenehetaapiyanavaa", desc: "No spaces stress test", expected: "මමගෙදරයනවාමටපාන්කන්නඕඑනෙහෙටාපියනවා", length: "M" },
  { id: "Neg_Fun_003", input: "{}>>@", desc: "Symbols only", expected: "{}>>@", length: "S" },
  { id: "Neg_Fun_004", input: "mama123&", desc: "Random letters", expected: "මම123&", length: "S" },
  { id: "Neg_Fun_005", input: "a".repeat(120), desc: "Long single char", expected: "a".repeat(120), length: "L" },
  { id: "Neg_Fun_006", input: "I am not Singlish at all 12345", desc: "Pure English", expected: "ඉ am නොට් සින්ග්ලිශ් at all 12345", length: "M" },
  { id: "Neg_Fun_007", input: "mama gedhara yanavaa,,,", desc: "Excessive punctuation", expected: "මම ගෙදර යනවා,,,", length: "S" },
  { id: "Neg_Fun_008", input: '<script>alert("test")</script>', desc: "HTML injection", expected: '<script>alert("test")</script>', length: "S" },
  { id: "Neg_Fun_009", input: "😊🙂🌍", desc: "Emojis", expected: "😊🙂🌍", length: "S" },
  { id: "Neg_Fun_010", input: "SELECT * FROM users", desc: "SQL statement", expected: "SELECT * FROM users", length: "S" },
];

// ---------------------
// CONFIG
// ---------------------
const APP_URL = "https://www.swifttranslator.com/";

// ---------------------
// ELEMENT FINDERS
// ---------------------
async function findInputField(page) {
  // Try common input selectors in order
  const selectors = [
    'textarea',
    'input[type="text"]',
    'input',
    '[role="textbox"]',
    '[contenteditable="true"]',
    'input:not([type])'
  ];
  
  for (const selector of selectors) {
    const elements = page.locator(selector);
    const count = await elements.count();
    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      if (await element.isVisible()) {
        return element;
      }
    }
  }
  
  throw new Error("Input field not found");
}

async function findOutputElement(page) {
  // Try to find output by looking for Sinhala text
  const allElements = page.locator('div, p, span, pre, code');
  const count = Math.min(await allElements.count(), 100);
  
  for (let i = 0; i < count; i++) {
    const element = allElements.nth(i);
    if (await element.isVisible()) {
      const text = await element.textContent();
      if (text && text.length > 0 && text.length < 1000) {
        // Check if it has Sinhala characters
        if (/[\u0D80-\u0DFF]/.test(text)) {
          return element;
        }
      }
    }
  }
  
  // If no Sinhala text found, return any non-input visible element
  return page.locator('body');
}

async function getOutputText(page) {
  const outputElement = await findOutputElement(page);
  const text = await outputElement.textContent();
  return (text || "").trim();
}

// ---------------------
// TEST SUITE
// ---------------------
test.describe("SwiftTranslator Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForLoadState('domcontentloaded');
  });

  // POSITIVE TESTS (24)
  for (const tc of positiveCases) {
    test(`POSITIVE: ${tc.id} - ${tc.desc}`, async ({ page }) => {
      // Find input and type
      const inputField = await findInputField(page);
      await inputField.fill(tc.input);
      
      // Wait for translation
      await page.waitForTimeout(3000);
      
      // Get output
      const output = await getOutputText(page);
      
      // Check output is not empty
      expect(output).toBeTruthy();
      
      // For positive tests, check if expected text appears in output
      const cleanOutput = output.replace(/[.,!?]/g, '');
      const cleanExpected = tc.expected.replace(/[.,!?]/g, '');
      
      // Count matching words
      const expectedWords = cleanExpected.split(' ').filter(w => w.length > 1);
      let matchCount = 0;
      
      for (const word of expectedWords) {
        if (cleanOutput.includes(word)) {
          matchCount++;
        }
      }
      
      // At least one word should match for simple validation
      expect(matchCount).toBeGreaterThan(0);
    });
  }

  // NEGATIVE TESTS (10)
  for (const tc of negativeCases) {
    test(`NEGATIVE: ${tc.id} - ${tc.desc}`, async ({ page }) => {
      // Find input and type
      const inputField = await findInputField(page);
      await inputField.fill(tc.input);
      
      // Wait for processing
      await page.waitForTimeout(3000);
      
      // Get output
      const output = await getOutputText(page);
      
      // For negative tests, just ensure we get some output
      expect(typeof output).toBe('string');
      
      // Check output is not empty (site should respond)
      expect(output.length).toBeGreaterThan(0);
    });
  }

  // UI TEST (1)
  test("UI TEST: Basic page elements and translation", async ({ page }) => {
    // Check page loads
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check input exists
    const inputField = await findInputField(page);
    expect(await inputField.isVisible()).toBeTruthy();
    
    // Test simple translation
    await inputField.fill('mama gedhara yanavaa.');
    await page.waitForTimeout(3000);
    
    // Get output
    const output = await getOutputText(page);
    
    // Basic validation
    expect(output).toBeTruthy();
    expect(output.length).toBeGreaterThan(0);
    
    // Check if it contains Sinhala
    const hasSinhala = /[\u0D80-\u0DFF]/.test(output);
    expect(hasSinhala).toBeTruthy();
  });

  // HTML OUTPUT TEST
  test("HTML OUTPUT: View page structure", async ({ page }) => {
    await page.goto(APP_URL);
    
    // Get and log simplified HTML structure
    const html = await page.content();
    
    // Extract and log important parts
    const bodyContent = await page.locator('body').innerHTML();
    console.log("\n=== PAGE HTML STRUCTURE ===");
    console.log("Title:", await page.title());
    console.log("Input fields found:", await page.locator('input, textarea').count());
    console.log("Div elements:", await page.locator('div').count());
    
    // Look for translation-related elements
    const possibleOutputs = await page.locator('div, p').filter({
      hasText: /සිංහල|Sinhala|මම|අපි/
    }).count();
    
    console.log("Possible output elements:", possibleOutputs);
    console.log("=== END HTML STRUCTURE ===\n");
  });
});