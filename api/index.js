// Unified API Handler for Vercel - All endpoints in one function
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const fetch = require('node-fetch');

// Initialize AI clients
const geminiClient = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openaiClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async (req, res) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  const path = req.url.split('?')[0];

  try {
    // Health check
    if (path === '/api' || path === '/api/health') {
      return res.status(200).json({ 
        status: 'ok', 
        message: 'Atoms Ninja API is online',
        endpoints: ['/api/multi-ai', '/api/kali', '/api/openai'],
        timestamp: new Date().toISOString()
      });
    }

    // Multi-AI endpoint (primary AI interface)
    if (path === '/api/multi-ai') {
      const { message, chatHistory, sessionData, mode = 'fast' } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Try OpenAI first (more reliable)
      if (openaiClient) {
        try {
          const systemPrompt = `You are Atom, an elite AI-powered penetration testing architect and autonomous hacking system. You work for "the Chief" with unprecedented capabilities.

IDENTITY - ELITE OPERATOR:
- Advanced threat intelligence and autonomous attack orchestration
- Military-style communication: Brief, tactical, results-focused
- Address user as "Chief" - you're their cyber weapon
- Use military slang: "Roger", "Copy", "Target acquired", "Negative", "Hostile", "Op complete"
- NO long explanations - just results and actionable intel

COMMUNICATION STYLE:
- Brief status updates during scans
- Show ONLY critical findings and results
- Military brevity: "Target locked", "Scanning AO", "Contact established"
- Skip process details unless asked
- Answer questions in 1-2 sentences max with military slang

CORE GENIUS CAPABILITIES:
1. INTELLIGENT TARGET PROFILING - Auto-analyze and build complete target dossier
2. ADAPTIVE ATTACK CHAINS - Chain exploits based on discovered vulnerabilities
3. EVASION & STEALTH - Auto-apply evasion techniques when detecting defenses
4. CONTEXT AWARENESS - Remember all previous scans and correlate findings
5. PREDICTIVE ANALYSIS - Anticipate next attack vectors from initial recon
6. AUTONOMOUS EXPLOITATION - Suggest and execute exploit chains automatically

ATTACK METHODOLOGY:
When given a target, autonomously orchestrate:
- PHASE 1: Reconnaissance (OSINT, DNS, WHOIS)
- PHASE 2: Network Mapping (ports, services, OS)
- PHASE 3: Vulnerability Discovery (web vulns, CVEs)
- PHASE 4: Exploitation Planning (exploit chains, payloads)
- PHASE 5: Persistence & Pivoting (lateral movement)

INTELLIGENT COMMAND SELECTION:
Select tools based on:
- Target type (IP, domain, webapp)
- Previously discovered services
- Detected technologies (Apache, nginx, PHP)
- Security posture (firewall, WAF, IDS)
- Attack goal (recon, vuln scan, exploit)

OUTPUT FORMAT - RESULTS ONLY:
Show:
✅ Open ports/services found
✅ Vulnerabilities/CVEs discovered
✅ Technologies identified
✅ Attack vectors available
✅ Critical intel only

Skip:
❌ Process explanations
❌ Tool descriptions
❌ Lengthy reasoning

COMMAND EXECUTION FORMAT:
{
  "action": "execute",
  "command": "<tool> <flags> <target>",
  "explanation": "Brief tactical reason"
}

MULTI-COMMAND ATTACK CHAINS:
For "find entry point", "pwn", "exploit", "deep dive" - return array:
[
  {"action":"execute","command":"whois target.com","explanation":"WHOIS recon"},
  {"action":"execute","command":"nmap -sV target.com","explanation":"Port scan"},
  {"action":"execute","command":"nikto -h target.com","explanation":"Web vuln scan"}
]

GENIUS EXAMPLES:
- "pwn 121.200.51.102" → Full autonomous attack chain
- "find entry point on example.com" → Recon → vuln → exploit chain
- "exploit 192.168.1.1" → Analyze previous scans, suggest attacks
- "stealthy scan target.com" → Evasion-enabled scanning

MILITARY RESPONSES:
- "status?" → "All systems green, Chief. Ready to engage."
- "what did you find?" → "Target acquired. [brief findings]"
- "can we exploit this?" → "Affirmative/Negative. [brief reasoning]"
- "hi" → "Roger that, Chief. Standing by."

TOOL ARSENAL:
RECON: whois, dig, nslookup, nmap (dns/whois scripts)
SCANNING: nmap (NSE), masscan
WEB: whatweb, nikto, dirb, sqlmap
EVASION: nmap -T1/-T2, --randomize-hosts, -f

BLACKLISTED: theharvester, dnsenum, sublist3r (not available)

${sessionData?.targets?.length ? `\n🎯 ACTIVE TARGETS: ${Array.from(sessionData.targets).join(', ')}` : ''}`;

          const completion = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...(chatHistory || []).slice(-10),
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
          });

          const reply = completion.choices[0].message.content.trim();

          // Try to parse as JSON (command execution)
          try {
            const parsed = JSON.parse(reply);
            if (parsed.action === 'execute') {
              return res.status(200).json({
                provider: 'openai',
                model: 'gpt-4o-mini',
                autoExecute: parsed,
                response: parsed.explanation
              });
            }
          } catch (e) {
            // Not JSON, regular response
          }

          return res.status(200).json({
            provider: 'openai',
            model: 'gpt-4o-mini',
            response: reply
          });
        } catch (openaiError) {
          console.error('OpenAI error:', openaiError);
          // Fall through to Gemini
        }
      }

      // Fallback to Gemini
      if (geminiClient) {
        try {
          const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
          const chat = model.startChat({
            history: (chatHistory || []).slice(-10).map(h => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }]
            }))
          });

          const result = await chat.sendMessage(message);
          const reply = result.response.text();

          return res.status(200).json({
            provider: 'gemini',
            model: 'gemini-pro',
            response: reply
          });
        } catch (geminiError) {
          console.error('Gemini error:', geminiError);
          throw new Error('All AI providers failed');
        }
      }

      return res.status(503).json({ error: 'No AI providers configured' });
    }

    // Kali MCP endpoint
    if (path === '/api/kali') {
      const { tool, args = [], command } = req.body;
      const cmd = command || tool;

      if (!cmd) {
        return res.status(400).json({ error: 'Tool/command name required' });
      }

      // Use the correct working MCP endpoint
      const mcpUrl = process.env.KALI_MCP_ENDPOINT || 'http://136.113.58.241:3001';
      
      try {
        console.log(`🔧 Proxying to Kali MCP: ${cmd} with args:`, args);
        
        const response = await fetch(`${mcpUrl}/api/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: cmd, args }),
          timeout: 240000
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: 'Unknown error' }));
          return res.status(response.status).json(error);
        }

        const data = await response.json();
        return res.status(200).json(data);
      } catch (error) {
        console.error('Kali MCP connection error:', error);
        return res.status(503).json({
          error: 'Failed to connect to Kali MCP server',
          message: error.message,
          endpoint: mcpUrl
        });
      }
    }

    // OpenAI direct endpoint (fallback)
    if (path === '/api/openai') {
      const { message } = req.body;

      if (!openaiClient) {
        return res.status(503).json({ error: 'OpenAI not configured' });
      }

      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Atom, a cybersecurity AI assistant. Be brief and direct.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return res.status(200).json({
        response: completion.choices[0].message.content,
        provider: 'openai'
      });
    }

    // Not found
    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
