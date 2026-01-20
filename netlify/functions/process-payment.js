const axios = require('axios');

// Environment variables from Netlify
const { MOMO_API_KEY, MOMO_PHONE_NUMBER } = process.env;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { amount } = JSON.parse(event.body);

    // Validate amount
    if (!amount || isNaN(amount) || amount < 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount. Minimum is 100 RWF' })
      };
    }

    // In a real implementation, you would call the MTN MoMo API here
    // This is a mock implementation for demonstration
    const paymentData = {
      amount: amount,
      currency: 'RWF',
      externalId: 'ituro-' + Date.now(),
      payer: {
        partyIdType: 'MSISDN',
        partyId: MOMO_PHONE_NUMBER
      },
      payerMessage: 'Ituro - Rwanda Christian Revival Church',
      payeeNote: 'Thank you for your offering'
    };

    // In a real implementation, you would make an API call to MTN MoMo
    // const response = await axios.post('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', paymentData, {
    //   headers: {
    //     'X-Reference-Id': 'your-reference-id',
    //     'X-Target-Environment': 'sandbox',
    //     'Ocp-Apim-Subscription-Key': MOMO_API_KEY,
    //     'Content-Type': 'application/json'
    //   }
    // });

    // For now, return a mock response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Payment request created successfully',
        transactionId: 'mock-txn-' + Date.now(),
        amount: amount,
        currency: 'RWF'
      })
    };

  } catch (error) {
    console.error('Payment error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process payment',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
