
export default function handler(request: Request) {

  return new Response(
    JSON.stringify({ 
      message: 'Sentiment analysis is handled client-side in this implementation' 
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}