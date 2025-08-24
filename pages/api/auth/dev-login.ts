import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For development only - simulate successful login
  if (process.env.NODE_ENV === 'development') {
    // In a real app, you would validate the Google token here
    const mockUser = {
      id: 'dev-user-123',
      name: 'Development User',
      email: 'dev@example.com',
      image: 'https://via.placeholder.com/40x40/4285f4/ffffff?text=DU'
    };

    return res.status(200).json({ 
      success: true, 
      user: mockUser,
      message: 'Development login successful' 
    });
  }

  return res.status(400).json({ error: 'OAuth not configured' });
}
