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