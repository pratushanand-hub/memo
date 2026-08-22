const axios = require('axios');

exports.analyzeMistake = async (req, res) => {
  const { mistakeTitle, mistakeDescription, tags } = req.body;

  if (!mistakeTitle) {
    return res.status(400).json({ success: false, error: 'mistakeTitle is required' });
  }

  const memcodeKey = process.env.MEMCODE_API_KEY;
  const baseURL = (process.env.MEMCODE_BASE_URL || 'https://memory.memcode.in').replace(/\/+$/, '');

  let memoryIngested = false;
  let errorMsg = null;

  try {
    const memoryResponse = await axios.post(
      `${baseURL}/v2/memory/ingest`,
      {
        user_query: `Mistake: ${mistakeTitle}. Details: ${mistakeDescription || ''}. Tags: ${tags || 'General'}`,
        agent_response: 'Logged mistake to prevent repeat errors.',
        effort_level: 'low'
      },
      {
        headers: {
          'Authorization': `Bearer ${memcodeKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    if (memoryResponse.status === 200 || memoryResponse.status === 202) {
      memoryIngested = true;
    }
  } catch (memError) {
    errorMsg = memError?.response?.data || memError.message;
    console.error('Memcode Error Detail:', JSON.stringify(errorMsg, null, 2));
  }

  return res.status(200).json({
    success: true,
    memoryLogged: memoryIngested,
    apiError: errorMsg,
    data: {
      rootCause: `Root issue identified in "${mistakeTitle}": Incomplete state or parameter handling during execution.`,
      solution: `1. Isolate the logic block where "${mistakeTitle}" was triggered.\n2. Add guard clauses and validate variable schemas before invocation.\n3. Add defensive try/catch logging to monitor recurrence.`,
      tags: Array.isArray(tags) ? tags : [tags || 'Debugging', 'Optimization']
    }
  });
};