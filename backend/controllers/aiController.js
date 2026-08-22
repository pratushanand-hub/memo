const axios = require('axios');

exports.analyzeMistake = async (req, res) => {
  const title = req.body.title || req.body.mistakeTitle;
  const description = req.body.description || req.body.mistakeDescription || '';
  const tags = req.body.tags || 'General';
  const cause = req.body.cause || '';
  const solution = req.body.solution || '';
  const lesson = req.body.lesson || '';

  console.log(`\n📥 [NEW SUBMISSION] Title: "${title}"`);
  console.log(`📝 Description: ${description}`);
  console.log(`🏷️ Tags:`, tags);

  if (!title) {
    console.log('❌ Rejected: title is missing');
    return res.status(400).json({ success: false, error: 'title is required' });
  }

  const memcodeKey = process.env.MEMCODE_API_KEY;
  const baseURL = (process.env.MEMCODE_BASE_URL || 'https://memory.memcode.in').replace(/\/+$/, '');

  let memoryIngested = false;
  let errorMsg = null;

  try {
    console.log('⏳ Forwarding payload to Memcode API...');
    const memoryResponse = await axios.post(
      `${baseURL}/v2/memory/ingest`,
      {
        user_query: `Mistake: ${title}. Cause: ${cause || description}. Solution: ${solution}. Lesson: ${lesson}. Tags: ${Array.isArray(tags) ? tags.join(', ') : tags}`,
        agent_response: `Logged mistake: ${title} to prevent repeat errors.`,
        effort_level: 'low'
      },
      {
        headers: {
          'Authorization': `Bearer ${memcodeKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      }
    );

    if (memoryResponse.status === 200 || memoryResponse.status === 202) {
      memoryIngested = true;
      console.log('✅ Successfully ingested into Memcode!');
    }
  } catch (memError) {
    errorMsg = memError?.response?.data || memError.message;
    console.error('❌ Memcode Ingestion Error:', JSON.stringify(errorMsg, null, 2));
  }

  return res.status(200).json({
    success: true,
    memoryLogged: memoryIngested,
    apiError: errorMsg,
    data: {
      rootCause: cause || `Root issue identified in "${title}".`,
      solution: solution || `Isolate the logic block and add schema checks.`,
      tags: Array.isArray(tags) ? tags : [tags]
    }
  });
};

exports.askCoach = async (req, res) => {
  const { userQuery, memoryContext } = req.body;

  console.log(`\n💬 [COACH QUERY] "${userQuery}"`);

  if (!userQuery) {
    return res.status(400).json({ success: false, error: 'userQuery is required' });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    console.error('❌ Missing OPENROUTER_API_KEY in .env');
    return res.status(500).json({ success: false, error: 'OPENROUTER_API_KEY is not set in backend/.env' });
  }

  try {
    const systemPrompt = `You are an expert Senior Developer and AI Debug Coach for the developer's "Mistake-Memo" app.
Your goals:
1. Explain the root problem clearly and why it happens under the hood.
2. Provide clean, production-ready code examples demonstrating the fix.
3. Offer a bulleted checklist on how to avoid repeating this mistake in future codebases.
4. Reference relevant past mistake memories when applicable.

Relevant past mistake context:
${memoryContext ? JSON.stringify(memoryContext) : 'No past context provided.'}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'MistakeMemo AI Coach'
        },
        timeout: 30000
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || 'Unable to generate coach advice.';
    console.log('✅ Coach reply generated successfully');
    return res.status(200).json({ success: true, reply });
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error('❌ OpenRouter Coach Error:', errorDetails);
    return res.status(500).json({ success: false, error: errorDetails });
  }
};

exports.scanCodeForMistakes = async (req, res) => {
  const { code, language } = req.body;

  if (!code || !code.trim()) {
    return res.status(200).json({ success: true, markers: [] });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey) {
    return res.status(500).json({ success: false, error: 'OPENROUTER_API_KEY is not set' });
  }

  try {
    const prompt = `Analyze this ${language || 'javascript'} code for recurring developer mistakes, logic traps, or antipatterns (such as unmemoized objects in React hooks, missing async/await handling, wrong trigonometry units, or schema leaks).

Code to inspect:
\`\`\`${language || 'javascript'}
${code}
\`\`\`

If any potential bug or recurring mistake exists, return a STRICT JSON array of markers (and nothing else):
[
  {
    "startLineNumber": 1,
    "startColumn": 1,
    "endLineNumber": 1,
    "endColumn": 50,
    "message": "Brief description of the antipattern and the fix",
    "severity": 8
  }
]
Severity levels: 8 = Error, 4 = Warning, 2 = Info.
If no issues are found, return: []`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: 'You are a static code analysis engine that outputs only valid raw JSON without markdown explanations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'MistakeMemo Linter'
        },
        timeout: 25000
      }
    );

    const rawContent = response.data?.choices?.[0]?.message?.content || '[]';
    const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    let markers = [];
    try {
      markers = JSON.parse(cleaned);
    } catch {
      markers = [];
    }

    return res.status(200).json({ success: true, markers });
  } catch (error) {
    console.error('❌ Monaco scan error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};